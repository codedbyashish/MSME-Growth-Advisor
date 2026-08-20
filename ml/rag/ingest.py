import os
import sys
import glob
import re
import json
import pickle
import numpy as np
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer

# Re-configure stdout for UTF-8 handling on Windows
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False


def chunk_text(text, source_filename, chunk_size=500, overlap=100):
    """
    Splits text into overlapping chunks, capturing section headings as metadata.
    """
    lines = text.split('\n')
    current_heading = "General Overview"
    chunks = []
    
    current_buffer = []
    current_len = 0
    
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('#') or stripped.startswith('##') or stripped.startswith('###'):
            current_heading = stripped.lstrip('#').strip()
            
        if not stripped:
            continue
            
        current_buffer.append(stripped)
        current_len += len(stripped)
        
        if current_len >= chunk_size:
            chunk_text_content = " ".join(current_buffer)
            chunks.append({
                "source": source_filename,
                "heading": current_heading,
                "text": chunk_text_content
            })
            
            # Keep overlap buffer
            overlap_buffer = []
            overlap_len = 0
            for item in reversed(current_buffer):
                overlap_buffer.insert(0, item)
                overlap_len += len(item)
                if overlap_len >= overlap:
                    break
            current_buffer = overlap_buffer
            current_len = overlap_len
            
    if current_buffer:
        chunk_text_content = " ".join(current_buffer)
        chunks.append({
            "source": source_filename,
            "heading": current_heading,
            "text": chunk_text_content
        })
        
    return chunks


def load_and_process_documents(docs_dir):
    """
    Loads all text and markdown files from the documents directory.
    """
    supported_extensions = ['*.txt', '*.md']
    doc_files = []
    for ext in supported_extensions:
        doc_files.extend(glob.glob(os.path.join(docs_dir, ext)))
        
    if not doc_files:
        raise FileNotFoundError(f"No .txt or .md documents found in directory: {docs_dir}")
        
    print(f"Found {len(doc_files)} document(s) in {docs_dir}")
    
    all_chunks = []
    for filepath in doc_files:
        filename = os.path.basename(filepath)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            chunks = chunk_text(content, source_filename=filename)
            all_chunks.extend(chunks)
            print(f"   -> Processed '{filename}': created {len(chunks)} chunk(s).")
            
    for idx, chunk in enumerate(all_chunks):
        chunk["id"] = idx
        
    return all_chunks


def generate_gemini_embeddings(chunks, api_key=None):
    """
    Generates embeddings via Google Generative AI API if key is present.
    """
    api_key = api_key or os.getenv("GEMINI_API_KEY")
    if not HAS_GENAI or not api_key:
        print("[INFO] GEMINI_API_KEY not found or google-generativeai module unavailable. Skipping Gemini dense embeddings.")
        return None
        
    try:
        genai.configure(api_key=api_key)
        print("[INFO] Generating dense embeddings with Gemini ('models/embedding-001')...")
        embeddings = []
        for chunk in chunks:
            text_to_embed = f"{chunk['source']} | {chunk['heading']}\n{chunk['text']}"
            res = genai.embed_content(
                model="models/embedding-001",
                content=text_to_embed,
                task_type="retrieval_document"
            )
            embeddings.append(res['embedding'])
            
        embeddings_matrix = np.array(embeddings, dtype=np.float32)
        # L2 Normalize
        norms = np.linalg.norm(embeddings_matrix, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        normalized_embeddings = embeddings_matrix / norms
        print(f"[SUCCESS] Generated Gemini embeddings shape: {normalized_embeddings.shape}")
        return normalized_embeddings
    except Exception as e:
        print(f"[WARNING] Gemini embedding generation failed: {e}. Will rely on TF-IDF fallback.")
        return None


def build_tfidf_index(chunks):
    """
    Fits TF-IDF vectorizer and transforms chunk texts.
    """
    print("[INFO] Building TF-IDF search index...")
    corpus = [f"{c['heading']} {c['text']}" for c in chunks]
    vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
    tfidf_matrix = vectorizer.fit_transform(corpus)
    print(f"[SUCCESS] TF-IDF index built. Vocabulary size: {len(vectorizer.vocabulary_)}, Matrix shape: {tfidf_matrix.shape}")
    return vectorizer, tfidf_matrix


def run_ingestion(docs_dir=None, output_dir=None):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    docs_dir = docs_dir or os.path.join(base_dir, "documents")
    output_dir = output_dir or os.path.join(base_dir, "index")
    
    os.makedirs(output_dir, exist_ok=True)
    
    print("==================================================")
    print("STARTING MSME RAG INGESTION PIPELINE")
    print("==================================================")
    
    chunks = load_and_process_documents(docs_dir)
    print(f"\nTotal extracted chunks: {len(chunks)}")
    
    vectorizer, tfidf_matrix = build_tfidf_index(chunks)
    gemini_embeddings = generate_gemini_embeddings(chunks)
    
    vector_store_data = {
        "chunks": chunks,
        "tfidf_vectorizer": vectorizer,
        "tfidf_matrix": tfidf_matrix,
        "gemini_embeddings": gemini_embeddings,
        "created_at": datetime.now().isoformat(),
        "total_chunks": len(chunks)
    }
    
    vector_store_path = os.path.join(output_dir, "vector_store.pkl")
    with open(vector_store_path, "wb") as f:
        pickle.dump(vector_store_data, f)
        
    metadata_path = os.path.join(output_dir, "metadata.json")
    metadata = {
        "created_at": datetime.now().isoformat(),
        "total_chunks": len(chunks),
        "documents": list(set([c["source"] for c in chunks])),
        "has_gemini_embeddings": gemini_embeddings is not None,
        "tfidf_vocabulary_size": len(vectorizer.vocabulary_)
    }
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
        
    print("\n==================================================")
    print("INGESTION COMPLETE!")
    print(f"Saved vector store to: {vector_store_path}")
    print(f"Saved index metadata to: {metadata_path}")
    print("==================================================")


if __name__ == "__main__":
    run_ingestion()

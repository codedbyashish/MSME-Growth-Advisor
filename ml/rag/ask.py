import os
import sys
import pickle
import argparse
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

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


def load_vector_store(index_dir=None):
    """
    Loads vector store from index directory.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    index_dir = index_dir or os.path.join(base_dir, "index")
    vector_store_path = os.path.join(index_dir, "vector_store.pkl")
    
    if not os.path.exists(vector_store_path):
        raise FileNotFoundError(
            f"Vector store not found at '{vector_store_path}'. "
            "Please run 'python ingest.py' first to build the index."
        )
        
    with open(vector_store_path, "rb") as f:
        data = pickle.load(f)
    return data


def retrieve_relevant_chunks(query, vector_store, top_k=3, api_key=None):
    """
    Retrieves top_k most relevant chunks using hybrid vector search (Gemini + TF-IDF).
    """
    chunks = vector_store["chunks"]
    vectorizer = vector_store["tfidf_vectorizer"]
    tfidf_matrix = vector_store["tfidf_matrix"]
    gemini_embeddings = vector_store.get("gemini_embeddings")
    
    # 1. Calculate TF-IDF similarity
    query_tfidf = vectorizer.transform([query])
    tfidf_sims = cosine_similarity(query_tfidf, tfidf_matrix).flatten()
    
    # 2. Calculate Gemini Dense Similarity if key & embeddings available
    api_key = api_key or os.getenv("GEMINI_API_KEY")
    gemini_sims = None
    if HAS_GENAI and api_key and gemini_embeddings is not None:
        try:
            genai.configure(api_key=api_key)
            res = genai.embed_content(
                model="models/embedding-001",
                content=query,
                task_type="retrieval_query"
            )
            q_embed = np.array(res['embedding'], dtype=np.float32)
            norm = np.linalg.norm(q_embed)
            if norm > 0:
                q_embed = q_embed / norm
            gemini_sims = np.dot(gemini_embeddings, q_embed)
        except Exception as e:
            print(f"[INFO] Gemini query embedding notice: {e}. Relying on TF-IDF retrieval.")
            
    # Combine scores
    if gemini_sims is not None:
        final_scores = 0.6 * gemini_sims + 0.4 * tfidf_sims
    else:
        final_scores = tfidf_sims
        
    top_indices = np.argsort(final_scores)[::-1][:top_k]
    
    results = []
    for idx in top_indices:
        results.append({
            "score": float(final_scores[idx]),
            "chunk": chunks[idx]
        })
    return results


def generate_answer_with_gemini(query, retrieved_results, api_key=None):
    """
    Generates RAG response using Gemini LLM if API key is available, else synthesizes context.
    """
    api_key = api_key or os.getenv("GEMINI_API_KEY")
    
    context_str = ""
    citations = []
    for i, res in enumerate(retrieved_results, 1):
        chunk = res["chunk"]
        context_str += f"\n--- CONTEXT CHUNK {i} (Source: {chunk['source']} | Section: {chunk['heading']}) ---\n"
        context_str += f"{chunk['text']}\n"
        citations.append(f"{chunk['source']} ({chunk['heading']})")
        
    unique_citations = sorted(list(set(citations)))
    
    if HAS_GENAI and api_key:
        try:
            genai.configure(api_key=api_key)
            model_name = "gemini-1.5-flash"
            try:
                model = genai.GenerativeModel(model_name)
            except Exception:
                model = genai.GenerativeModel("gemini-pro")
                
            prompt = f"""You are an expert MSME Growth Advisor AI. Answer the user's query clearly, professionally, and accurately using ONLY the provided official context guidelines below.

=== MSME DOMAIN CONTEXT ===
{context_str}

=== USER QUERY ===
{query}

=== INSTRUCTIONS ===
1. Provide a direct, actionable answer tailored for small/medium business owners.
2. Structure your response with markdown bullet points and clear sections.
3. Explicitly cite the source documents referenced.
"""
            print("[INFO] Querying Gemini AI model for answer generation...\n")
            response = model.generate_content(prompt)
            answer_text = response.text
            
            return {
                "answer": answer_text,
                "citations": unique_citations,
                "engine": f"Gemini LLM ({model_name})"
            }
        except Exception as e:
            print(f"[WARNING] Gemini generation API notice: {e}. Falling back to structured context output.")

    # Fallback response when GEMINI_API_KEY is not available
    fallback_text = f"### MSME Advisory Search Results\n\n"
    fallback_text += f"**Query:** *{query}*\n\n"
    fallback_text += f"Here are the top relevant MSME policy and guideline sections retrieved:\n\n"
    
    for i, res in enumerate(retrieved_results, 1):
        chunk = res["chunk"]
        score = res["score"]
        fallback_text += f"#### {i}. {chunk['heading']} (Relevance Score: {score:.2f})\n"
        fallback_text += f"**Source:** `{chunk['source']}`\n\n"
        fallback_text += f"> {chunk['text']}\n\n"
        
    fallback_text += f"\n*Note: Set your `GEMINI_API_KEY` environment variable to enable natural language AI synthesis.*"
    
    return {
        "answer": fallback_text,
        "citations": unique_citations,
        "engine": "Hybrid TF-IDF & Context Retriever (Offline Mode)"
    }


def ask_question(query, top_k=3):
    vector_store = load_vector_store()
    retrieved = retrieve_relevant_chunks(query, vector_store, top_k=top_k)
    result = generate_answer_with_gemini(query, retrieved)
    return result


def main():
    parser = argparse.ArgumentParser(description="Ask questions to the MSME RAG Knowledge Base.")
    parser.add_argument("query", type=str, nargs="?", help="Question for the MSME Advisor RAG")
    parser.add_argument("--top-k", type=int, default=3, help="Number of context chunks to retrieve")
    args = parser.parse_args()
    
    if args.query:
        print(f"\n[QUERY] '{args.query}'\n")
        res = ask_question(args.query, top_k=args.top_k)
        print("==================================================")
        print(res["answer"])
        print("==================================================")
        print(f"Sources Cited: {', '.join(res['citations'])}")
        print(f"Engine: {res['engine']}")
        print("==================================================\n")
    else:
        print("==================================================")
        print("Welcome to MSME Growth Advisor RAG Interactive Mode")
        print("Type your question below, or type 'exit' or 'quit' to end.")
        print("==================================================\n")
        
        while True:
            try:
                user_input = input("MSME-Advisor> ").strip()
                if not user_input:
                    continue
                if user_input.lower() in ["exit", "quit", "q"]:
                    print("Exiting MSME RAG. Goodbye!")
                    break
                    
                res = ask_question(user_input, top_k=args.top_k)
                print("\n==================================================")
                print(res["answer"])
                print("==================================================")
                print(f"Sources Cited: {', '.join(res['citations'])}")
                print(f"Engine: {res['engine']}")
                print("==================================================\n")
            except (KeyboardInterrupt, EOFError):
                print("\nSession ended.")
                break


if __name__ == "__main__":
    main()

import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  Download,
  TrendingUp,
  Receipt,
  Package,
  RefreshCw,
  Sparkles,
  ArrowRight,
  FileText,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  HelpCircle,
  Users,
  ShoppingCart,
  Truck,
  Check,
  Info,
} from 'lucide-react';
import { validateImportApi, executeImportApi } from '../../services/dataApi';
import { useData } from '../../context/DataContext';
import {
  processMultiSheetWorkbook,
  downloadTemplate,
  DEPARTMENT_CONFIG,
} from '../../utils/smartImporter';

// ---------- Cream / Linen theme (matches dashboard) ----------
const T = {
  card: 'rounded-xl border border-[#E7E3DC] bg-white',
  label: 'text-xs font-medium text-[#737D8B]',
  muted: 'text-[#737D8B]',
  btnPrimary:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-[#202B3C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#151D2A] disabled:cursor-not-allowed disabled:opacity-50',
  btnSecondary:
    'inline-flex items-center justify-center gap-2 rounded-lg border border-[#E7E3DC] bg-white px-4 py-2.5 text-sm font-medium text-[#202B3C] transition-colors hover:bg-[#F5F3EE] disabled:opacity-50',
  badgeGreen:
    'inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60',
  badgeGray:
    'inline-flex items-center gap-1.5 rounded-md bg-[#F1EFEA] px-2.5 py-1 text-xs font-medium text-[#4B5563] border border-[#E7E3DC]',
  badgeAmber:
    'inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200/60',
  badgeBlue:
    'inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200/60',
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export default function ImportModal({
  isOpen,
  onClose,
  onImportSuccess,
  initialCategory = 'all',
}) {
  const fileInputRef = useRef(null);
  const { setActiveTab, refreshData } = useData();

  const [file, setFile] = useState(null);
  const [workbookInstance, setWorkbookInstance] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sheetTypeOverrides, setSheetTypeOverrides] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverValidation, setServerValidation] = useState(null);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [overwriteDuplicates, setOverwriteDuplicates] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [modalStage, setModalStage] = useState('upload'); // 'upload' | 'preview' | 'complete'
  const [activePreviewTab, setActivePreviewTab] = useState('all');
  const [showFieldDetails, setShowFieldDetails] = useState(false);
  const [showAttentionDetails, setShowAttentionDetails] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isImporting && !isAnalyzing) {
        handleResetAndClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isImporting, isAnalyzing]);

  const handleResetAndClose = () => {
    setFile(null);
    setWorkbookInstance(null);
    setSheetTypeOverrides({});
    setAnalysis(null);
    setServerValidation(null);
    setErrorMessage('');
    setIsImporting(false);
    setIsAnalyzing(false);
    setImportResult(null);
    setModalStage('upload');
    setActivePreviewTab('all');
    setShowAttentionDetails(false);
    setShowFieldDetails(false);
    onClose();
  };

  const readAndProcessFile = (uploadedFile) => {
    if (!uploadedFile) return;

    if (uploadedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10 MB limit. Please upload a smaller file.');
      return;
    }

    const ext = uploadedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      setErrorMessage('Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file.');
      return;
    }

    setErrorMessage('');
    setFile(uploadedFile);
    setIsAnalyzing(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, {
          type: 'array',
          cellFormula: false,
          cellHTML: false,
        });

        setWorkbookInstance(wb);
        await runWorkbookAnalysis(wb, {});
      } catch (err) {
        console.error('File parsing error:', err);
        setErrorMessage('Failed to read spreadsheet. File might be corrupted or password-protected.');
        setModalStage('upload');
        setIsAnalyzing(false);
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const runWorkbookAnalysis = async (wb, overrides = {}) => {
    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      // Automatic detection across ALL sheets in the workbook
      const result = processMultiSheetWorkbook(wb, 'all', overrides);
      setAnalysis(result);

      if (result.totalReadyCount === 0) {
        setErrorMessage(
          'We could not find any valid records in this spreadsheet. Check if headers are empty or non-numeric values exist.'
        );
        setIsAnalyzing(false);
        setModalStage('upload');
        return;
      }

      // Validate across all detected modules on the backend
      try {
        const serverRes = await validateImportApi({
          type: 'all',
          modules: {
            sales: (result.categorizedReadyRows?.sales || []).map((r) => r.data),
            expenses: (result.categorizedReadyRows?.expenses || []).map((r) => r.data),
            purchases: (result.categorizedReadyRows?.purchases || []).map((r) => r.data),
            inventory: (result.categorizedReadyRows?.inventory || []).map((r) => r.data),
          },
        });
        setServerValidation(serverRes);
      } catch (serverErr) {
        console.warn('Server validation warning:', serverErr);
        setServerValidation({ duplicateCount: 0 });
      }

      setModalStage('preview');
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMessage('Error analyzing spreadsheet data.');
      setModalStage('upload');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClarifySheet = (sheetName, chosenType) => {
    const updatedOverrides = { ...sheetTypeOverrides, [sheetName]: chosenType };
    setSheetTypeOverrides(updatedOverrides);
    if (workbookInstance) {
      runWorkbookAnalysis(workbookInstance, updatedOverrides);
    }
  };

  const handleRemoveFile = (e) => {
    e?.stopPropagation();
    setFile(null);
    setWorkbookInstance(null);
    setSheetTypeOverrides({});
    setAnalysis(null);
    setServerValidation(null);
    setErrorMessage('');
    setModalStage('upload');
    setActivePreviewTab('all');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImportAllData = async () => {
    if (!analysis || analysis.totalReadyCount === 0) {
      setErrorMessage('No valid records are available to import.');
      return;
    }

    setIsImporting(true);
    setErrorMessage('');

    try {
      // Send all detected modules to backend in one action
      const payload = {
        type: 'all',
        modules: {
          sales: (analysis.categorizedReadyRows?.sales || []).map((r) => r.data),
          expenses: (analysis.categorizedReadyRows?.expenses || []).map((r) => r.data),
          purchases: (analysis.categorizedReadyRows?.purchases || []).map((r) => r.data),
          inventory: (analysis.categorizedReadyRows?.inventory || []).map((r) => r.data),
        },
        skipDuplicates,
        overwriteDuplicates,
      };

      const res = await executeImportApi(payload);
      setImportResult(res);
      setModalStage('complete');

      // Refresh every affected department across the entire application
      if (typeof refreshData === 'function') {
        await refreshData();
      }
      if (typeof onImportSuccess === 'function') {
        onImportSuccess();
      }
    } catch (err) {
      console.error('Import execution error:', err);
      setErrorMessage(
        err.response?.data?.message || err.message || 'Error saving imported records to database.'
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleViewImportedData = () => {
    if (analysis?.categorizedReadyRows?.sales?.length > 0) {
      setActiveTab('orders');
    } else if (analysis?.categorizedReadyRows?.inventory?.length > 0) {
      setActiveTab('products');
    } else {
      setActiveTab('dashboard');
    }
    handleResetAndClose();
  };

  const handleReturnToDashboard = () => {
    setActiveTab('dashboard');
    handleResetAndClose();
  };

  if (!isOpen) return null;

  const duplicateCount = serverValidation?.duplicateCount || 0;

  // Filter preview rows based on active tab
  const getFilteredPreviewRows = () => {
    if (!analysis) return [];
    if (activePreviewTab === 'all') {
      return analysis.previewRows || [];
    }
    if (activePreviewTab === 'sales') {
      return (analysis.categorizedReadyRows?.sales || []).slice(0, 10).map((r) => ({
        ...r.data,
        _module: 'sales',
        _department: 'Sales & Invoices',
        _sheet: r.sheetName,
      }));
    }
    if (activePreviewTab === 'expenses') {
      return (analysis.categorizedReadyRows?.expenses || []).slice(0, 10).map((r) => ({
        ...r.data,
        _module: 'expenses',
        _department: 'Business Expenses',
        _sheet: r.sheetName,
      }));
    }
    if (activePreviewTab === 'purchases') {
      return (analysis.categorizedReadyRows?.purchases || []).slice(0, 10).map((r) => ({
        ...r.data,
        _module: 'purchases',
        _department: 'Ingredient Purchases',
        _sheet: r.sheetName,
      }));
    }
    if (activePreviewTab === 'inventory') {
      return (analysis.categorizedReadyRows?.inventory || []).slice(0, 10).map((r) => ({
        ...r.data,
        _module: 'inventory',
        _department: 'Products & Stock',
        _sheet: r.sheetName,
      }));
    }
    return [];
  };

  const currentPreviewRows = getFilteredPreviewRows();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#202B3C]/40 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto"
      style={{ colorScheme: 'light' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
    >
      {/* File input (always mounted so replace works seamlessly) */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            readAndProcessFile(e.target.files[0]);
          }
          e.target.value = '';
        }}
      />

      <div className="flex max-h-[96vh] sm:max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-[#E7E3DC] bg-[#FAF9F6] text-[#202B3C] shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7E3DC] bg-white px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-[#202B3C] text-white">
              <FileSpreadsheet className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h2 id="import-modal-title" className="text-base sm:text-lg font-semibold leading-tight truncate">
                Import Excel & Worksheets
              </h2>
              <p className={`mt-0.5 text-xs sm:text-sm ${T.muted} truncate max-w-[280px] sm:max-w-none`}>
                Upload one spreadsheet — all departments are detected automatically.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            disabled={isImporting || isAnalyzing}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center text-[#737D8B] transition-colors hover:bg-[#F1EFEA] hover:text-[#202B3C] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 sm:space-y-5 overflow-y-auto p-3.5 sm:p-6">
          {errorMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 1: UPLOAD (No forced department selection) */}
          {/* ========================================================================= */}
          {modalStage === 'upload' && (
            <div className="space-y-6">
              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    readAndProcessFile(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all ${
                  isDragging
                    ? 'border-[#202B3C] bg-white ring-2 ring-[#202B3C]/10'
                    : 'border-[#D8D2C6] bg-white/70 hover:border-[#737D8B] hover:bg-white'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <RefreshCw className="h-8 w-8 animate-spin text-[#202B3C]" />
                    <div className="text-base font-semibold">Scanning all worksheets...</div>
                    <p className={`text-xs ${T.muted}`}>
                      Detecting Sales, Expenses, Stock, Ingredient Purchases & mapping columns
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E7E3DC] bg-[#FAF9F6] text-[#202B3C] shadow-sm">
                      <Upload className="h-7 w-7" />
                    </div>

                    <p className="text-center text-base font-semibold text-[#202B3C]">
                      Drag and drop your Excel or CSV file
                    </p>
                    <p className={`mt-1 text-xs sm:text-sm ${T.muted}`}>
                      or click to browse from your computer
                    </p>

                    <div className={`${T.badgeGreen} mt-4`}>
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Automatic detection: reads all worksheets in one single upload</span>
                    </div>

                    <div className="mt-2.5 text-[11px] text-[#9AA2AD]">
                      Supports .xlsx, .xls, and .csv up to 10 MB
                    </div>
                  </>
                )}
              </div>

              {/* Supported Departments Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737D8B]">
                    Recognized Departments & Modules
                  </h3>
                  <span className="text-[11px] text-[#737D8B]">
                    Automatically detected from sheet names & headers
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className={`${T.card} p-3`}>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                        <TrendingUp className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold">Sales & Invoices</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#737D8B]">
                      Customers, amounts, invoice dates & payment status
                    </p>
                  </div>

                  <div className={`${T.card} p-3`}>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-700">
                        <Receipt className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold">Business Expenses</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#737D8B]">
                      Expense titles, categories, costs & vendors
                    </p>
                  </div>

                  <div className={`${T.card} p-3`}>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                        <Package className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold">Products & Stock</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#737D8B]">
                      Product names, unit prices, available stock & units
                    </p>
                  </div>

                  <div className={`${T.card} p-3`}>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                        <ShoppingCart className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold">Ingredient Purchases</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#737D8B]">
                      Ingredients, suppliers, quantities & total costs
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample Templates Card */}
              <div className={`${T.card} flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center`}>
                <div>
                  <h4 className="text-sm font-semibold">Need a sample template?</h4>
                  <p className={`mt-0.5 text-xs ${T.muted}`}>
                    Download pre-formatted spreadsheets with sample business data.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadTemplate('all', 'xlsx')}
                    className={`${T.btnSecondary} !px-3 !py-1.5 !text-xs`}
                  >
                    <Download className="h-3.5 w-3.5 text-[#737D8B]" />
                    All Departments (.xlsx)
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadTemplate('sales', 'csv')}
                    className={`${T.btnSecondary} !px-3 !py-1.5 !text-xs`}
                  >
                    <Download className="h-3.5 w-3.5 text-[#737D8B]" />
                    Sales (.csv)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 2: COMBINED PREVIEW & VALIDATION */}
          {/* ========================================================================= */}
          {modalStage === 'preview' && analysis && (
            <div className="space-y-5">
              {/* File Info Bar */}
              <div className={`${T.card} flex items-center justify-between p-3.5`}>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{file?.name}</div>
                    <div className={`text-xs ${T.muted}`}>
                      {formatFileSize(file?.size)} · {analysis.totalWorksheets} worksheet
                      {analysis.totalWorksheets > 1 ? 's' : ''} detected · {analysis.totalFieldsCount} recognized fields
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#202B3C] hover:bg-[#F1EFEA]"
                  >
                    Replace File
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={isImporting}
                    title="Remove file"
                    className="rounded-lg p-1.5 text-[#737D8B] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className={`${T.card} p-3.5`}>
                  <div className={T.label}>Worksheets</div>
                  <div className="mt-1 text-2xl font-semibold">{analysis.totalWorksheets}</div>
                  <div className={`mt-0.5 text-xs ${T.muted}`}>detected in file</div>
                </div>
                <div className={`${T.card} p-3.5`}>
                  <div className={T.label}>Recognized Fields</div>
                  <div className="mt-1 text-2xl font-semibold">{analysis.totalFieldsCount}</div>
                  <div className={`mt-0.5 text-xs ${T.muted}`}>mapped columns</div>
                </div>
                <div className={`${T.card} p-3.5`}>
                  <div className={T.label}>Ready to Import</div>
                  <div className="mt-1 text-2xl font-semibold text-emerald-700">{analysis.totalReadyCount}</div>
                  <div className="mt-0.5 text-xs text-emerald-700">valid records</div>
                </div>
                <div className={`${T.card} p-3.5`}>
                  <div className={T.label}>Needs Attention</div>
                  <div className="mt-1 text-2xl font-semibold">{analysis.totalAttentionCount}</div>
                  <div className={`mt-0.5 text-xs ${analysis.totalAttentionCount > 0 ? 'text-orange-700' : T.muted}`}>
                    {analysis.totalAttentionCount > 0 ? 'will be skipped' : '0 errors'}
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* COMBINED DEPARTMENT SUMMARY TABLE (Requirement 3 from prompt) */}
              {/* =================================================================== */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">Detected Worksheets & Departments</h3>
                    <p className={`text-xs ${T.muted}`}>
                      Summary of all worksheets parsed from this workbook
                    </p>
                  </div>
                  <span className={T.badgeGreen}>
                    <Check className="h-3 w-3" />
                    All valid sheets will import in one click
                  </span>
                </div>

                <div className="overflow-x-auto -webkit-overflow-scrolling-touch scrollbar-thin rounded-xl border border-[#E7E3DC] bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[#E7E3DC] bg-[#FAF9F6] text-[#737D8B]">
                      <tr>
                        <th className="px-3.5 py-3 font-semibold">Department & Worksheet</th>
                        <th className="px-3 py-3 text-right font-semibold">Detected Rows</th>
                        <th className="px-3 py-3 text-right font-semibold text-emerald-700">Valid</th>
                        <th className="px-3 py-3 text-right font-semibold text-[#737D8B]">Invalid</th>
                        <th className="px-3.5 py-3 text-center font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E3DC]">
                      {analysis.sheets.map((s, idx) => {
                        const isSkipped = s.isSkipped;
                        const isInformational = s.detectedCategory === 'ignored';

                        let deptIcon = <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />;
                        if (s.detectedCategory === 'expenses') deptIcon = <Receipt className="h-3.5 w-3.5 text-rose-600" />;
                        if (s.detectedCategory === 'purchases') deptIcon = <ShoppingCart className="h-3.5 w-3.5 text-amber-600" />;
                        if (s.detectedCategory === 'inventory') deptIcon = <Package className="h-3.5 w-3.5 text-blue-600" />;
                        if (isInformational) deptIcon = <Info className="h-3.5 w-3.5 text-gray-500" />;

                        return (
                          <tr key={idx} className="transition-colors hover:bg-[#FAF9F6]/80">
                            <td className="px-3.5 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#FAF9F6] border border-[#E7E3DC]">
                                  {deptIcon}
                                </div>
                                <div>
                                  <div className="font-semibold text-[#202B3C]">
                                    {s.departmentName || s.detectedCategory}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="font-mono text-[10px] text-[#737D8B] bg-[#F1EFEA] px-1.5 py-0.5 rounded">
                                      Sheet: {s.sheetName}
                                    </span>
                                    {isSkipped && (
                                      <span className="text-[10px] text-gray-500 italic">
                                        ({s.skipReason || 'Non-transactional data'})
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-right font-semibold text-[#202B3C]">
                              {s.totalRows}
                            </td>
                            <td className="px-3 py-3 text-right font-semibold text-emerald-700">
                              {s.readyCount}
                            </td>
                            <td className="px-3 py-3 text-right text-[#737D8B]">
                              {s.attentionCount}
                            </td>
                            <td className="px-3.5 py-3 text-center">
                              {isSkipped ? (
                                <span className={T.badgeGray}>
                                  Skipped ({isInformational ? 'Informational' : 'Excluded'})
                                </span>
                              ) : (
                                <span className={T.badgeGreen}>
                                  <Check className="h-3 w-3" />
                                  Import
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ambiguous Sheet Clarification (if any) */}
              {analysis.ambiguousSheets?.length > 0 && (
                <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50/50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-orange-900">
                    <HelpCircle className="h-4 w-4 text-orange-600" />
                    <span>Clarify Department for Ambiguous Worksheet</span>
                  </div>

                  {analysis.ambiguousSheets.map((amb, i) => (
                    <div
                      key={i}
                      className="flex flex-col justify-between gap-2.5 rounded-lg border border-[#E7E3DC] bg-white p-3 sm:flex-row sm:items-center"
                    >
                      <div className="text-xs">
                        <span className="font-semibold text-[#202B3C]">Worksheet "{amb.sheetName}"</span>
                        <span className={`ml-1.5 ${T.muted}`}>
                          headers: {amb.headers.slice(0, 3).join(', ')}...
                        </span>
                      </div>

                      <div className="inline-flex rounded-lg border border-[#E7E3DC] bg-[#FAF9F6] p-0.5">
                        {['sales', 'expenses', 'purchases', 'inventory'].map((cand) => {
                          const active = (sheetTypeOverrides[amb.sheetName] || amb.suggestedType) === cand;
                          return (
                            <button
                              key={cand}
                              type="button"
                              onClick={() => handleClarifySheet(amb.sheetName, cand)}
                              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                                active ? 'bg-[#202B3C] text-white' : 'text-[#737D8B] hover:text-[#202B3C]'
                              }`}
                            >
                              {cand === 'sales'
                                ? 'Sales'
                                : cand === 'expenses'
                                ? 'Expenses'
                                : cand === 'purchases'
                                ? 'Purchases'
                                : 'Stock'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Duplicate Detection Options */}
              {duplicateCount > 0 && (
                <div className="space-y-2.5 rounded-xl border border-orange-200 bg-orange-50/50 p-4">
                  <div className="text-sm font-semibold text-orange-900">
                    {duplicateCount} possible duplicate record{duplicateCount > 1 ? 's' : ''} detected
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-[#202B3C]">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="dupChoice"
                        checked={skipDuplicates && !overwriteDuplicates}
                        onChange={() => {
                          setSkipDuplicates(true);
                          setOverwriteDuplicates(false);
                        }}
                        className="text-[#202B3C] focus:ring-0"
                      />
                      <span>
                        <strong>Skip duplicates</strong>{' '}
                        <span className={T.muted}>(recommended — prevents double-counting existing invoices)</span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="dupChoice"
                        checked={overwriteDuplicates}
                        onChange={() => {
                          setSkipDuplicates(false);
                          setOverwriteDuplicates(true);
                        }}
                        className="text-[#202B3C] focus:ring-0"
                      />
                      <span>
                        <strong>Update existing records</strong>{' '}
                        <span className={T.muted}>with values from this spreadsheet</span>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Interactive Department Switcher & Row Preview */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">Data Preview</h3>
                  <div className="inline-flex rounded-lg border border-[#E7E3DC] bg-white p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setActivePreviewTab('all')}
                      className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                        activePreviewTab === 'all'
                          ? 'bg-[#202B3C] text-white'
                          : 'text-[#737D8B] hover:text-[#202B3C]'
                      }`}
                    >
                      All ({analysis.totalReadyCount})
                    </button>
                    {(analysis.categorizedReadyRows?.sales?.length || 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => setActivePreviewTab('sales')}
                        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                          activePreviewTab === 'sales'
                            ? 'bg-[#202B3C] text-white'
                            : 'text-[#737D8B] hover:text-[#202B3C]'
                        }`}
                      >
                        Sales ({analysis.categorizedReadyRows.sales.length})
                      </button>
                    )}
                    {(analysis.categorizedReadyRows?.expenses?.length || 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => setActivePreviewTab('expenses')}
                        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                          activePreviewTab === 'expenses'
                            ? 'bg-[#202B3C] text-white'
                            : 'text-[#737D8B] hover:text-[#202B3C]'
                        }`}
                      >
                        Expenses ({analysis.categorizedReadyRows.expenses.length})
                      </button>
                    )}
                    {(analysis.categorizedReadyRows?.purchases?.length || 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => setActivePreviewTab('purchases')}
                        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                          activePreviewTab === 'purchases'
                            ? 'bg-[#202B3C] text-white'
                            : 'text-[#737D8B] hover:text-[#202B3C]'
                        }`}
                      >
                        Purchases ({analysis.categorizedReadyRows.purchases.length})
                      </button>
                    )}
                    {(analysis.categorizedReadyRows?.inventory?.length || 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => setActivePreviewTab('inventory')}
                        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                          activePreviewTab === 'inventory'
                            ? 'bg-[#202B3C] text-white'
                            : 'text-[#737D8B] hover:text-[#202B3C]'
                        }`}
                      >
                        Stock ({analysis.categorizedReadyRows.inventory.length})
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-[#E7E3DC] bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[#E7E3DC] bg-[#FAF9F6] text-[#737D8B]">
                      <tr>
                        <th className="px-3 py-2.5 font-medium">Department</th>
                        <th className="px-3 py-2.5 font-medium">Worksheet</th>
                        <th className="px-3 py-2.5 font-medium">Name / Title</th>
                        <th className="px-3 py-2.5 text-right font-medium">Amount / Price</th>
                        <th className="px-3 py-2.5 font-medium">Date / Stock</th>
                        <th className="px-3 py-2.5 font-medium">Additional Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E3DC]">
                      {currentPreviewRows.map((row, idx) => {
                        const moduleType = row._module || 'sales';
                        const customKeys = row.metadata ? Object.keys(row.metadata) : [];

                        let badgeStyle = 'bg-emerald-50 text-emerald-700';
                        let labelText = 'Sale';
                        if (moduleType === 'expenses') {
                          badgeStyle = 'bg-rose-50 text-rose-700';
                          labelText = 'Expense';
                        } else if (moduleType === 'purchases') {
                          badgeStyle = 'bg-amber-50 text-amber-700';
                          labelText = 'Purchase';
                        } else if (moduleType === 'inventory') {
                          badgeStyle = 'bg-blue-50 text-blue-700';
                          labelText = 'Product';
                        }

                        return (
                          <tr key={idx} className="transition-colors hover:bg-[#FAF9F6]/70">
                            <td className="px-3 py-2.5">
                              <span
                                className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ${badgeStyle}`}
                              >
                                {labelText}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 font-mono text-[11px] text-[#737D8B]">
                              {row._sheet || 'Sheet'}
                            </td>
                            <td className="px-3 py-2.5 font-medium text-[#202B3C]">
                              {row.client || row.title || row.name || '—'}
                            </td>
                            <td className="px-3 py-2.5 text-right font-medium">
                              ₹{Number(row.amount || row.unitPrice || 0).toLocaleString('en-IN')}
                            </td>
                            <td className={`px-3 py-2.5 ${T.muted}`}>
                              {row.date ||
                                (row.stock !== undefined ? `${row.stock} ${row.unit || 'units'}` : '—')}
                            </td>
                            <td className={`px-3 py-2.5 text-[11px] ${T.muted}`}>
                              {customKeys.length > 0 ? (
                                <span className="font-mono text-[#4B5563]">
                                  {customKeys.slice(0, 3).join(', ')}
                                  {customKeys.length > 3 ? '...' : ''}
                                </span>
                              ) : (
                                <span className="text-[#9AA2AD]">Standard fields</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* View Recognized Fields Accordion */}
              <div className={`${T.card} overflow-hidden`}>
                <button
                  type="button"
                  onClick={() => setShowFieldDetails(!showFieldDetails)}
                  className="flex w-full items-center justify-between p-3.5 text-sm font-medium transition-colors hover:bg-[#FAF9F6]"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#737D8B]" />
                    <span>View all {analysis.totalFieldsCount} recognized column headers</span>
                  </div>
                  {showFieldDetails ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {showFieldDetails && (
                  <div className="space-y-3 border-t border-[#E7E3DC] p-4">
                    <p className={`text-xs ${T.muted}`}>
                      Standard columns are mapped to application modules. Custom or extra columns are safely preserved as metadata.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.allHeaders.map((hdr) => (
                        <span
                          key={hdr}
                          className="rounded-md border border-[#E7E3DC] bg-[#FAF9F6] px-2.5 py-1 font-mono text-[11px] text-[#202B3C]"
                        >
                          {hdr}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Attention notice if any records are missing required fields */}
              {analysis.totalAttentionCount > 0 && (
                <div className="overflow-hidden rounded-xl border border-orange-200 bg-orange-50/50">
                  <button
                    type="button"
                    onClick={() => setShowAttentionDetails(!showAttentionDetails)}
                    className="flex w-full items-center justify-between p-3.5 text-left text-sm font-medium text-orange-900 transition-colors hover:bg-orange-100/40"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-orange-600" />
                      <span>
                        {analysis.totalAttentionCount} record{analysis.totalAttentionCount > 1 ? 's' : ''} have
                        missing required fields and will be skipped
                      </span>
                    </div>
                    {showAttentionDetails ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {showAttentionDetails && (
                    <div className="border-t border-orange-200 p-3.5 text-xs text-orange-800">
                      All valid records will be imported safely without requiring you to manually edit the spreadsheet.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3: COMPLETE RESULTS BREAKDOWN */}
          {/* ========================================================================= */}
          {modalStage === 'complete' && importResult && (
            <div className="space-y-6 py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#202B3C]">Import Complete</h3>
                <p className={`mx-auto mt-1 max-w-lg text-sm ${T.muted}`}>
                  {importResult.message || 'All records have been processed and saved to your business workspace.'}
                </p>
              </div>

              {/* Top Level Summary Cards */}
              <div className={`${T.card} inline-grid min-w-[320px] grid-cols-3 gap-6 p-4 text-left shadow-sm`}>
                <div>
                  <div className={T.label}>Inserted</div>
                  <div className="mt-0.5 text-2xl font-semibold text-emerald-700">
                    {importResult.insertedCount ?? 0}
                  </div>
                </div>
                <div>
                  <div className={T.label}>Updated</div>
                  <div className="mt-0.5 text-2xl font-semibold text-[#202B3C]">
                    {importResult.updatedCount ?? 0}
                  </div>
                </div>
                <div>
                  <div className={T.label}>Skipped</div>
                  <div className={`mt-0.5 text-2xl font-semibold ${T.muted}`}>
                    {(importResult.skippedCount ?? 0) + (analysis?.totalAttentionCount || 0)}
                  </div>
                </div>
              </div>

              {/* Per-Department Results Breakdown */}
              {importResult.byModule && (
                <div className="text-left space-y-2 max-w-xl mx-auto">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#737D8B]">
                    Per-Department Results
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {importResult.byModule.sales && (
                      <div className={`${T.card} p-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                          <span className="text-xs font-semibold">Sales & Invoices</span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700">
                          {importResult.byModule.sales.inserted} added
                          {importResult.byModule.sales.updated > 0 ? `, ${importResult.byModule.sales.updated} updated` : ''}
                        </span>
                      </div>
                    )}

                    {importResult.byModule.expenses && (
                      <div className={`${T.card} p-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-rose-600" />
                          <span className="text-xs font-semibold">Business Expenses</span>
                        </div>
                        <span className="text-xs font-semibold text-rose-700">
                          {importResult.byModule.expenses.inserted} added
                          {importResult.byModule.expenses.updated > 0 ? `, ${importResult.byModule.expenses.updated} updated` : ''}
                        </span>
                      </div>
                    )}

                    {importResult.byModule.purchases && (
                      <div className={`${T.card} p-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-amber-600" />
                          <span className="text-xs font-semibold">Ingredient Purchases</span>
                        </div>
                        <span className="text-xs font-semibold text-amber-700">
                          {importResult.byModule.purchases.inserted} added
                          {importResult.byModule.purchases.updated > 0 ? `, ${importResult.byModule.purchases.updated} updated` : ''}
                        </span>
                      </div>
                    )}

                    {importResult.byModule.inventory && (
                      <div className={`${T.card} p-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-semibold">Products & Stock</span>
                        </div>
                        <span className="text-xs font-semibold text-blue-700">
                          {importResult.byModule.inventory.inserted} added
                          {importResult.byModule.inventory.updated > 0 ? `, ${importResult.byModule.inventory.updated} updated` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Informational Sheets Skipped Notice */}
              {analysis?.sheets?.some((s) => s.isSkipped) && (
                <div className="max-w-xl mx-auto rounded-lg border border-[#E7E3DC] bg-white p-3 text-left text-xs text-[#737D8B]">
                  <span className="font-semibold text-[#202B3C]">Informational Sheets Excluded: </span>
                  {analysis.sheets
                    .filter((s) => s.isSkipped)
                    .map((s) => `"${s.sheetName}" (${s.skipReason || 'Informational'})`)
                    .join(', ')}
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleViewImportedData}
                  className={`${T.btnPrimary} w-full sm:w-auto`}
                >
                  View Imported Data
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleReturnToDashboard}
                  className={`${T.btnSecondary} w-full sm:w-auto`}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {modalStage !== 'complete' && (
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5 border-t border-[#E7E3DC] bg-white px-4 py-3 sm:px-6 sm:py-4">
            {modalStage === 'preview' ? (
              <button
                type="button"
                onClick={() => setModalStage('upload')}
                disabled={isImporting}
                className={`inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium ${T.muted} transition-colors hover:text-[#202B3C] py-1 cursor-pointer`}
              >
                ← Back / Replace File
              </button>
            ) : (
              <div />
            )}

            <div className="flex flex-col-reverse sm:flex-row items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleResetAndClose}
                disabled={isImporting}
                className={`${T.btnSecondary} w-full sm:w-auto min-h-[40px] justify-center`}
              >
                Cancel
              </button>

              {modalStage === 'preview' && (
                <button
                  type="button"
                  onClick={handleImportAllData}
                  disabled={isImporting || !analysis || analysis.totalReadyCount === 0}
                  className={`${T.btnPrimary} w-full sm:w-auto min-h-[40px] justify-center`}
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Importing All Data...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Import All Data ({analysis?.totalReadyCount} Records)
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
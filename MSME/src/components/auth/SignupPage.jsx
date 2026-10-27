import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  AlertCircle,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Check,
  TrendingUp,
  RefreshCw,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  findBestSalesWorksheet,
  processSpreadsheetData,
  processMultiSheetWorkbook,
  formatFileSize,
} from '../../utils/smartImporter';
import { executeImportApi } from '../../services/dataApi';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Other Territory',
];

const BUSINESS_TYPES = [
  'Retail Store',
  'Wholesale / B2B',
  'Manufacturing',
  'Services & Consulting',
  'E-Commerce',
  'Food & Restaurant',
  'Other',
];

const SECTORS = [
  'Apparel & Fashion',
  'Electronics & Hardware',
  'FMCG & Grocery',
  'Automotive & Spares',
  'Healthcare & Pharma',
  'Industrial & Materials',
  'IT & Digital Services',
  'Home & Furniture',
  'Other',
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { refreshData } = useData() || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});

  // Step 4 File Upload & Smart Import State
  const [salesFile, setSalesFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [detectedBestSheet, setDetectedBestSheet] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [multiSheetResult, setMultiSheetResult] = useState(null);
  const [importStatusMessage, setImportStatusMessage] = useState('');
  const [importSuccessMessage, setImportSuccessMessage] = useState('');
  const [importError, setImportError] = useState('');
  const [registeredUser, setRegisteredUser] = useState(null);
  const fileInputRef = useRef(null);

  // 4-Step Form State
  const [formData, setFormData] = useState({
    // Step 1: Business Info
    businessName: '',
    ownerName: '',
    phone: '',
    city: '',
    state: '',

    // Step 2: Business Category & Details
    businessType: 'Retail Store',
    sector: 'FMCG & Grocery',
    gstin: '',
    annualTurnover: '₹10L - ₹50L',
    monthlyRevenue: '',
    monthlyExpenses: '',

    // Step 3: Account Credentials
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  // Validation of uploaded file format and size
  const validateFile = (file) => {
    if (!file) return false;
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];
    const name = (file.name || '').toLowerCase();
    const hasValidExt = allowedExtensions.some((ext) => name.endsWith(ext));
    if (!hasValidExt) {
      setServerError('Please upload a valid spreadsheet file (.xlsx, .xls, or .csv).');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setServerError('File size exceeds 10 MB limit. Please select a smaller file.');
      return false;
    }
    setServerError('');
    return true;
  };

  // Process rows for selected worksheet using smartImporter
  const processSelectedSheet = (wb, sheetName) => {
    try {
      const ws = wb.Sheets[sheetName];
      if (!ws) {
        setParsedResult(null);
        return;
      }
      const rawRows = XLSX.utils.sheet_to_json(ws, { raw: false, defval: '', blankrows: false });
      if (rawRows.length === 0) {
        setParsedResult({
          total: 0,
          readyCount: 0,
          attentionCount: 0,
          readyRows: [],
          attentionRows: [],
          previewRows: [],
          detectedFields: {},
          isEmpty: true,
        });
        return;
      }

      const processed = processSpreadsheetData(rawRows, 'sales');
      setParsedResult({
        ...processed,
        isEmpty: false,
      });
    } catch (err) {
      console.error('Error processing worksheet:', err);
      setServerError(`Error reading worksheet "${sheetName}": ${err.message}`);
      setParsedResult(null);
    }
  };

  // Handle spreadsheet file parsing with automatic multi-department detection
  const handleFile = async (file) => {
    if (!validateFile(file)) return;
    setSalesFile(file);
    setParsing(true);
    setServerError('');
    setImportError('');
    setImportSuccessMessage('');

    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: 'array' });
      const sheets = wb.SheetNames || [];
      if (sheets.length === 0) {
        throw new Error('This workbook contains no worksheets.');
      }

      setWorkbook(wb);
      setSheetNames(sheets);

      // Automatically scan and detect ALL worksheets & departments
      const multiAnalysis = processMultiSheetWorkbook(wb, 'all');
      setMultiSheetResult(multiAnalysis);

      // Best sales sheet detection for backwards compatibility
      const detection = findBestSalesWorksheet(wb);
      const chosenSheet = (detection && detection.bestSheetName) || sheets[0];
      setSelectedSheet(chosenSheet);
      setDetectedBestSheet(detection ? detection.bestSheetName : chosenSheet);

      // Populate preview rows across detected departments
      setParsedResult({
        total: multiAnalysis.totalReadyCount,
        readyCount: multiAnalysis.totalReadyCount,
        attentionCount: multiAnalysis.totalAttentionCount,
        readyRows: multiAnalysis.previewRows.map((r, i) => ({ rowNumber: i + 1, data: r })),
        previewRows: multiAnalysis.previewRows || [],
        detectedFields: multiAnalysis.allHeaders || [],
        isEmpty: multiAnalysis.totalReadyCount === 0,
      });
    } catch (err) {
      console.error('File parsing error:', err);
      setServerError(
        err.message || 'Failed to read spreadsheet. Please ensure it is a valid, uncorrupted Excel or CSV file.'
      );
      setParsedResult(null);
      setMultiSheetResult(null);
    } finally {
      setParsing(false);
    }
  };

  // Handle switching worksheet if user manually inspects
  const handleSheetChange = (newSheet) => {
    setSelectedSheet(newSheet);
    if (workbook) {
      processSelectedSheet(workbook, newSheet);
    }
  };

  // Remove uploaded file and reset state
  const handleRemoveFile = () => {
    setSalesFile(null);
    setWorkbook(null);
    setSheetNames([]);
    setSelectedSheet('');
    setDetectedBestSheet('');
    setParsedResult(null);
    setMultiSheetResult(null);
    setImportError('');
    setServerError('');
    setImportSuccessMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and drop handlers for Step 4
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Validation per step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Please enter your business name.';
      }
      if (!formData.ownerName.trim()) {
        newErrors.ownerName = 'Please enter owner / legal name.';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Please enter mobile number.';
      } else if (!/^\d{10}$/.test(formData.phone.trim().replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'Please enter city.';
      }
      if (!formData.state) {
        newErrors.state = 'Please select state.';
      }
    }

    if (step === 2) {
      if (!formData.businessType) {
        newErrors.businessType = 'Please select business type.';
      }
      if (!formData.sector) {
        newErrors.sector = 'Please select industry sector.';
      }
    }

    if (step === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Please enter your email address.';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }

      if (!formData.password) {
        newErrors.password = 'Please create a password.';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters.';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm password.';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must accept the terms to proceed.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e, skipFile = false) => {
    if (e) e.preventDefault();

    // Ensure step 3 (credentials) is valid before submitting
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    setLoading(true);
    setServerError('');
    setImportError('');
    setImportSuccessMessage('');

    try {
      // 1. Account registration if not already registered (e.g. from prior retry)
      let activeUser = registeredUser;
      const existingToken = localStorage.getItem('token');
      if (!activeUser && !existingToken) {
        setImportStatusMessage('Creating your business account...');
        activeUser = await register({
          name: formData.ownerName.trim(),
          fullName: formData.ownerName.trim(),
          businessName: formData.businessName.trim(),
          phone: formData.phone.trim(),
          city: formData.city.trim(),
          state: formData.state,
          businessType: formData.businessType,
          sector: formData.sector,
          gstin: formData.gstin.trim(),
          annualTurnover: formData.annualTurnover,
          monthlyRevenue: formData.monthlyRevenue,
          monthlyExpenses: formData.monthlyExpenses,
          email: formData.email.trim(),
          password: formData.password,
          hasUploadedSalesData: !skipFile && !!salesFile && (parsedResult?.readyCount > 0),
          salesFileName: !skipFile && salesFile ? salesFile.name : null,
        });
        setRegisteredUser(activeUser);
      }

      // 2. If user uploaded a valid file and did not skip, persist records across all detected departments
      const totalToImport = multiSheetResult ? multiSheetResult.totalReadyCount : (parsedResult?.readyCount || 0);
      if (!skipFile && salesFile && totalToImport > 0) {
        setImportStatusMessage(`Importing ${totalToImport} records across all detected departments...`);
        let payload;

        if (multiSheetResult && multiSheetResult.categorizedReadyRows) {
          payload = {
            type: 'all',
            modules: {
              sales: (multiSheetResult.categorizedReadyRows.sales || []).map((r) => r.data),
              expenses: (multiSheetResult.categorizedReadyRows.expenses || []).map((r) => r.data),
              purchases: (multiSheetResult.categorizedReadyRows.purchases || []).map((r) => r.data),
              inventory: (multiSheetResult.categorizedReadyRows.inventory || []).map((r) => r.data),
            },
            skipDuplicates: true,
          };
        } else {
          payload = {
            type: 'sales',
            rows: (parsedResult?.readyRows || []).map((r) => r.data),
            skipDuplicates: true,
          };
        }

        const importRes = await executeImportApi(payload);
        const count = importRes?.insertedCount !== undefined ? importRes.insertedCount : totalToImport;
        setImportSuccessMessage(
          `Imported ${count} records across all departments successfully!`
        );
        setImportStatusMessage('Opening your dashboard...');
      }

      // 3. Refresh user data so dashboard metrics update immediately
      if (refreshData) {
        try {
          await refreshData();
        } catch (rErr) {
          console.warn('refreshData error on signup completion:', rErr);
        }
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 600);

    } catch (err) {
      console.error('Registration / import error:', err);
      const msg = err.response?.data?.message || err.message || 'Setup failed. Please try again.';
      const hasToken = !!localStorage.getItem('token');
      if (registeredUser || hasToken) {
        setImportError(`Account created, but sales import failed: ${msg}. You can retry importing now or continue to your dashboard.`);
      } else {
        setServerError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Step Header Titles
  const stepTitles = [
    'Business Info',
    'Business Details',
    'Account Security',
    'Upload Sales History',
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8 font-sans">
      
      {/* Brand Header */}
      <div className="text-center mb-5 sm:mb-6 space-y-1.5">
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer inline-flex items-center space-x-2 select-none"
        >
          <TrendingUp className="w-6 h-6 text-[#274258]" />
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
            MSME Growth Advisor
          </h1>
        </div>
      </div>

      {/* Main Card Container */}
      <div className={`${currentStep === 4 && salesFile && parsedResult?.readyCount > 0 ? 'max-w-2xl' : 'max-w-xl'} w-full mx-auto bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-4 sm:p-9 transition-all duration-300`}>
        
        {/* Step Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2.5 sm:space-x-3 mb-6">
            {[1, 2, 3, 4].map((stepNum, idx) => (
              <React.Fragment key={stepNum}>
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    stepNum < currentStep
                      ? 'bg-[#274258] text-white'
                      : stepNum === currentStep
                      ? 'border-2 border-[#274258] text-[#274258] bg-white shadow-xs'
                      : 'border border-[#CBD5E1] text-[#94A3B8] bg-white'
                  }`}
                >
                  {stepNum < currentStep ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  ) : (
                    stepNum
                  )}
                </div>
                {idx < 3 && (
                  <div
                    className={`w-6 sm:w-10 h-0.5 transition-all ${
                      stepNum < currentStep ? 'bg-[#274258]' : 'bg-[#E2E8F0]'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {currentStep < 4 && (
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h2 className="text-base font-bold text-[#1E293B]">
                {stepTitles[currentStep - 1]}
              </h2>
              <span className="text-xs font-semibold text-[#64748B]">
                Step {currentStep} of 4
              </span>
            </div>
          )}
        </div>

        {/* Global Error Banner */}
        {serverError && (
          <div className="mb-5 p-3 rounded-lg bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-[#F43F5E] text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* STEP 4: UPLOAD SALES HISTORY */}
        {currentStep === 4 ? (
          <div className="space-y-5">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-bold text-[#1E293B] tracking-tight">
                Upload your sales history
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mx-auto leading-relaxed">
                Upload your sales history to generate forecasts and business insights. We accept CSV or Excel files.
              </p>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".csv, .xls, .xlsx"
              className="hidden"
            />

            {!salesFile ? (
              /* Drag & Drop Upload Zone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-[#274258] bg-[#274258]/5 scale-[1.01]'
                    : 'border-[#CBD5E1] bg-[#FBF9F5] hover:border-[#274258] hover:bg-[#F5F2EC]'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#E2E8F0] flex items-center justify-center text-[#64748B] mb-1">
                    <UploadCloud className="w-5 h-5 text-[#475569]" />
                  </div>
                  <p className="text-sm font-bold text-[#1E293B]">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-[#64748B]">CSV, XLS, or XLSX (max. 10MB)</p>
                </div>
              </div>
            ) : (
              /* Selected File Details & Preview */
              <div className="space-y-4">
                {/* File Header Bar */}
                <div className="rounded-xl border border-[#E2E8F0] bg-[#FBF9F5] p-3.5 flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1E293B] truncate" title={salesFile.name}>
                        {salesFile.name}
                      </p>
                      <p className="text-[11px] text-[#64748B]">
                        {formatFileSize(salesFile.size)} • Spreadsheet loaded
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold text-[#274258] hover:text-[#1C3142] px-2 py-1 rounded hover:bg-white border border-transparent hover:border-[#E2E8F0] transition-colors cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-700 px-2 py-1 rounded hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Parsing State */}
                {parsing && (
                  <div className="py-6 flex flex-col items-center justify-center space-y-2 text-[#64748B]">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#274258]" />
                    <p className="text-xs font-medium">Analyzing spreadsheet and mapping columns...</p>
                  </div>
                )}

                {/* Parsed Results */}
                {!parsing && parsedResult && (
                  <div className="space-y-3.5">
                    {/* Multi-Department Automatic Detection Table */}
                    {multiSheetResult && multiSheetResult.sheets?.length > 1 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#1E293B]">
                            Detected Worksheets & Departments:
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            Auto-detected all sheets
                          </span>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-xs">
                          <table className="w-full text-left text-xs text-[#1E293B]">
                            <thead className="bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B] border-b border-[#E2E8F0]">
                              <tr>
                                <th className="px-3 py-2 font-semibold">Department & Worksheet</th>
                                <th className="px-3 py-2 text-right font-semibold">Detected</th>
                                <th className="px-3 py-2 text-right font-semibold text-emerald-700">Valid</th>
                                <th className="px-3 py-2 text-right font-semibold">Invalid</th>
                                <th className="px-3 py-2 text-center font-semibold">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9]">
                              {multiSheetResult.sheets.map((s, idx) => (
                                <tr key={idx} className="hover:bg-[#FAF8F5]/80 transition-colors">
                                  <td className="px-3 py-2">
                                    <div className="font-semibold text-[#1E293B]">
                                      {s.departmentName || s.detectedCategory}
                                    </div>
                                    <div className="text-[10px] text-[#64748B]">
                                      Sheet: <span className="font-mono text-[#334155]">{s.sheetName}</span>
                                      {s.isSkipped && (
                                        <span className="ml-1 text-gray-500 italic">
                                          ({s.skipReason || 'Informational'})
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 text-right font-medium text-[#1E293B]">
                                    {s.totalRows}
                                  </td>
                                  <td className="px-3 py-2 text-right font-semibold text-emerald-700">
                                    {s.readyCount}
                                  </td>
                                  <td className="px-3 py-2 text-right text-[#64748B]">
                                    {s.attentionCount}
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {s.isSkipped ? (
                                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                        Skipped (Informational)
                                      </span>
                                    ) : (
                                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Import
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}

                    {/* Summary Validation Badges */}
                    {parsedResult.isEmpty ? (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>This workbook has no valid data rows. Please check file format.</span>
                      </div>
                    ) : (multiSheetResult?.totalReadyCount || parsedResult.readyCount) > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {multiSheetResult ? multiSheetResult.totalReadyCount : parsedResult.readyCount} valid records ready to import across all departments
                          </span>
                        </div>

                        {(multiSheetResult ? multiSheetResult.totalAttentionCount : parsedResult.attentionCount) > 0 && (
                          <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-700">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>
                              {multiSheetResult ? multiSheetResult.totalAttentionCount : parsedResult.attentionCount} rows require attention (will be skipped)
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>No valid records detected. Please ensure your sheets contain standard business columns.</span>
                      </div>
                    )}

                    {/* Preview Table */}
                    {(multiSheetResult?.previewRows?.length > 0 || parsedResult.readyCount > 0) && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#475569]">
                          <span>Preview Sample Records</span>
                          <span className="text-[11px] text-[#64748B]">Across all detected sheets</span>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white">
                          <table className="w-full text-left text-xs text-[#1E293B]">
                            <thead className="bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B] border-b border-[#E2E8F0] uppercase tracking-wider">
                              <tr>
                                <th className="px-3 py-2">Department</th>
                                <th className="px-3 py-2">Name / Customer / Title</th>
                                <th className="px-3 py-2 text-right">Amount / Cost</th>
                                <th className="px-3 py-2">Date / Stock</th>
                                <th className="px-3 py-2 text-center">Status / Mode</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9]">
                              {(multiSheetResult?.previewRows || parsedResult.previewRows || []).slice(0, 6).map((row, idx) => {
                                const dept = row._department || (row._module === 'sales' ? 'Sales' : row._module === 'expenses' ? 'Expenses' : 'Product');
                                const name = row.client || row.title || row.name || '—';
                                const amount = Number(row.amount || row.unitPrice || 0);
                                const dateOrStock = row.date || (row.stock !== undefined ? `${row.stock} units` : '—');
                                const status = row.status || 'Ready';

                                return (
                                  <tr key={idx} className="hover:bg-[#FAF8F5]/80 transition-colors">
                                    <td className="px-3 py-2 whitespace-nowrap">
                                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F1EFEA] text-[#334155] border border-[#E2E8F0]">
                                        {dept}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 font-medium text-[#1E293B] max-w-[140px] truncate" title={name}>
                                      {name}
                                    </td>
                                    <td className="px-3 py-2 font-semibold text-[#1E293B] text-right whitespace-nowrap">
                                      ₹{amount.toLocaleString('en-IN')}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-[#475569]">
                                      {dateOrStock}
                                    </td>
                                    <td className="px-3 py-2 text-center whitespace-nowrap">
                                      <span
                                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                          status === 'Paid'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                                        }`}
                                      >
                                        {status}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Import Success Banner */}
            {importSuccessMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importSuccessMessage}</span>
              </div>
            )}

            {/* Import Error with Retry and Skip options */}
            {importError && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2.5">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{importError}</span>
                </div>
                <div className="flex items-center space-x-3 pt-1">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={loading}
                    className="px-3 py-1.5 bg-[#274258] text-white rounded-md text-xs font-semibold hover:bg-[#1C3142] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retry Import
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="text-xs font-medium text-[#475569] hover:text-[#1E293B] underline cursor-pointer"
                  >
                    Continue to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Security Banner */}
            <div className="bg-[#F8FAFC] rounded-lg p-3.5 border border-[#E2E8F0] flex items-start space-x-3 text-xs text-[#475569] leading-relaxed">
              <Lock className="w-4 h-4 text-[#475569] shrink-0 mt-0.5" />
              <span>
                Your data is securely encrypted and never shared. We use this strictly to initialize your AI forecasting models.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, false)}
                disabled={loading || (salesFile && parsedResult && parsedResult.readyCount === 0)}
                className="w-full py-3 px-4 rounded-lg bg-[#274258] hover:bg-[#1C3142] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{importStatusMessage || 'Setting up your dashboard...'}</span>
                  </div>
                ) : (
                  <>
                    <span>
                      {multiSheetResult && multiSheetResult.totalReadyCount > 0
                        ? `Finish Setup & Import All Data (${multiSheetResult.totalReadyCount} Records)`
                        : (parsedResult && parsedResult.readyCount > 0
                        ? `Finish Setup & Import ${parsedResult.readyCount} Records`
                        : 'Finish Setup')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                  className="text-xs text-[#64748B] hover:text-[#1E293B] font-medium transition-colors cursor-pointer py-1 disabled:opacity-50"
                >
                  Skip for now — I'll add data later
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* STEPS 1-3 FORM BODY */
          <form onSubmit={handleNextStep} className="space-y-4">
            
            {/* STEP 1: BUSINESS INFO */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Sharma Enterprises"
                    className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                      errors.businessName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                    }`}
                    autoFocus
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.businessName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Full Legal Name"
                    className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                      errors.ownerName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                    }`}
                  />
                  {errors.ownerName && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.ownerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Phone Number
                  </label>
                  <div className={`flex rounded-md border overflow-hidden focus-within:border-[#274258] transition-all ${
                    errors.phone ? 'border-red-500' : 'border-[#CBD5E1]'
                  }`}>
                    <span className="bg-[#F8FAFC] text-[#64748B] px-3.5 py-2.5 text-sm font-semibold border-r border-[#CBD5E1] select-none flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full px-3.5 py-2.5 text-sm text-[#1E293B] bg-white focus:outline-none"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.phone}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                        errors.city ? 'border-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                      State
                    </label>
                    <div className="relative">
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none appearance-none pr-8 transition-all ${
                          errors.state ? 'border-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                        }`}
                      >
                        <option value="" disabled>
                          Select State
                        </option>
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3 top-3 pointer-events-none" />
                    </div>
                    {errors.state && (
                      <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.state}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: BUSINESS DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Business Type
                  </label>
                  <div className="relative">
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#CBD5E1] text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#274258] appearance-none pr-8"
                    >
                      {BUSINESS_TYPES.map((bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Industry / Sector
                  </label>
                  <div className="relative">
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-md border border-[#CBD5E1] text-sm text-[#1E293B] bg-white focus:outline-none focus:border-[#274258] appearance-none pr-8"
                    >
                      {SECTORS.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    GSTIN Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    maxLength={15}
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#CBD5E1] text-sm text-[#1E293B] uppercase placeholder:normal-case bg-white focus:outline-none focus:border-[#274258]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Annual Turnover Bracket
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['< ₹10 Lakhs', '₹10L - ₹50L', '₹50L - ₹2 Cr', '> ₹2 Cr'].map((bracket) => (
                      <button
                        key={bracket}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, annualTurnover: bracket }))}
                        className={`p-2.5 rounded-md border font-medium text-left transition-all ${
                          formData.annualTurnover === bracket
                            ? 'border-[#274258] bg-[#274258]/5 text-[#274258] font-bold'
                            : 'border-[#CBD5E1] text-[#475569] hover:bg-slate-50'
                        }`}
                      >
                        {bracket}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ACCOUNT SECURITY */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="owner@business.com"
                    className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                      errors.email ? 'border-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Create Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                      errors.password ? 'border-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#1E293B] bg-white focus:outline-none transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-[#CBD5E1] focus:border-[#274258]'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-start space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-0.5 rounded border-[#CBD5E1] text-[#274258] focus:ring-[#274258]"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-[#64748B]">
                    I agree to the MSME Growth Advisor{' '}
                    <span className="text-[#1E293B] font-semibold underline cursor-pointer">Terms of Service</span>{' '}
                    and{' '}
                    <span className="text-[#1E293B] font-semibold underline cursor-pointer">Privacy Policy</span>.
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p className="text-[11px] text-red-500 font-medium">{errors.agreeTerms}</p>
                )}
              </div>
            )}

            {/* Steps 1-3 Navigation Bar */}
            <div className="pt-4 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2.5 rounded-md border border-[#CBD5E1] text-xs font-semibold text-[#1E293B] hover:bg-slate-50 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-md bg-[#274258] hover:bg-[#1C3142] text-white text-xs font-semibold transition-all flex items-center space-x-2 shadow-sm cursor-pointer ml-auto"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>
        )}

        {/* Existing User Login Link */}
        <p className="text-xs text-center text-[#64748B] pt-6 border-t border-[#E2E8F0] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#1E293B] hover:underline">
            Sign in
          </Link>
        </p>

      </div>

      {/* Security Footer */}
      <div className="mt-6 text-center flex items-center justify-center space-x-1.5 text-xs text-[#64748B]">
        <Lock className="w-3.5 h-3.5 text-[#64748B]" />
        <span>Your Information is securely encrypted</span>
      </div>

    </div>
  );
}

export { SignupPage as RegisterPage };

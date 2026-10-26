import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  ArrowRight,
  ArrowLeft,
  X,
  FileText,
  Layers,
  RefreshCw,
  Info,
} from 'lucide-react';
import { validateImportApi, executeImportApi } from '../../services/dataApi';

// Design tokens matching dashboard
const ui = {
  card: 'rounded-lg border border-[#E7E3DC] bg-white',
  primary:
    'inline-flex items-center justify-center gap-2 rounded-md bg-[#202B3C] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#151D2A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202B3C]/40 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-md border border-[#E7E3DC] bg-white px-3.5 py-2 text-sm font-medium text-[#202B3C] transition-colors hover:bg-[#F5F3EE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202B3C]/40 disabled:opacity-50',
  input:
    'w-full rounded-md border border-[#E7E3DC] bg-[#FAF9F6] px-3 py-2 text-sm text-[#202B3C] placeholder-[#9AA2AD] focus:border-[#202B3C] focus:bg-white focus:outline-none',
  select:
    'w-full rounded-md border border-[#E7E3DC] bg-[#FAF9F6] px-3 py-2 text-sm text-[#202B3C] focus:border-[#202B3C] focus:bg-white focus:outline-none',
};

// Target field definitions per data type
const TYPE_FIELDS = {
  sales: [
    { key: 'client', label: 'Customer / Client Name', required: true, aliases: ['client', 'customer', 'buyer', 'party', 'account', 'customer name', 'client name'] },
    { key: 'amount', label: 'Amount (INR)', required: true, aliases: ['amount', 'total', 'grand total', 'subtotal', 'value', 'price', 'total amount'] },
    { key: 'item', label: 'Item / Product', required: false, aliases: ['item', 'product', 'description', 'particulars', 'item name', 'goods'] },
    { key: 'date', label: 'Invoice Date', required: false, aliases: ['date', 'invoice date', 'billing date', 'date of issue'] },
    { key: 'status', label: 'Payment Status', required: false, aliases: ['status', 'payment status', 'payment', 'state'] },
  ],
  expenses: [
    { key: 'title', label: 'Expense Title / Description', required: true, aliases: ['title', 'description', 'expense', 'particulars', 'item', 'expense title'] },
    { key: 'amount', label: 'Amount (INR)', required: true, aliases: ['amount', 'cost', 'total', 'price', 'expense amount'] },
    { key: 'category', label: 'Category', required: false, aliases: ['category', 'type', 'expense category', 'department', 'head'] },
    { key: 'vendor', label: 'Vendor / Supplier', required: false, aliases: ['vendor', 'supplier', 'payee', 'paid to', 'merchant'] },
    { key: 'date', label: 'Expense Date', required: false, aliases: ['date', 'expense date', 'payment date'] },
  ],
  inventory: [
    { key: 'name', label: 'Product / Item Name', required: true, aliases: ['name', 'product', 'item', 'product name', 'item name', 'sku', 'title'] },
    { key: 'unitPrice', label: 'Unit Price (INR)', required: true, aliases: ['unit price', 'unitprice', 'price', 'rate', 'cost', 'mrp', 'selling price'] },
    { key: 'stock', label: 'Current Stock Qty', required: false, aliases: ['stock', 'quantity', 'qty', 'current stock', 'units', 'count'] },
    { key: 'category', label: 'Category', required: false, aliases: ['category', 'product category', 'type', 'group'] },
    { key: 'unit', label: 'Unit of Measure', required: false, aliases: ['unit', 'uom', 'measure', 'unit type'] },
    { key: 'minStock', label: 'Minimum Stock Threshold', required: false, aliases: ['min stock', 'minimum stock', 'minstock', 'reorder level', 'threshold'] },
  ],
};

// Sample template generators
const generateSampleTemplate = (type, format = 'xlsx') => {
  let sampleData = [];
  let fileName = '';

  if (type === 'sales') {
    fileName = 'Sales_Sample_Template';
    sampleData = [
      {
        'Customer Name': 'Sharma Enterprises Pvt Ltd',
        'Item / Product': 'Industrial Fasteners Pack',
        'Amount (INR)': 45000,
        'Invoice Date': '2026-10-15',
        'Payment Status': 'Paid',
      },
      {
        'Customer Name': 'Apex Electronics',
        'Item / Product': 'PCB Assembly Batch #4',
        'Amount (INR)': 28500,
        'Invoice Date': '2026-10-20',
        'Payment Status': 'Pending',
      },
      {
        'Customer Name': 'Vikas Logistics',
        'Item / Product': 'Fleet Spares Consignment',
        'Amount (INR)': 62000,
        'Invoice Date': '2026-10-24',
        'Payment Status': 'Paid',
      },
    ];
  } else if (type === 'expenses') {
    fileName = 'Expenses_Sample_Template';
    sampleData = [
      {
        'Expense Title': 'Office Electricity Bill',
        'Amount (INR)': 14200,
        Category: 'Utilities',
        Vendor: 'State Electricity Board',
        'Expense Date': '2026-10-12',
      },
      {
        'Expense Title': 'Raw Materials Freight',
        'Amount (INR)': 8500,
        Category: 'Logistics',
        Vendor: 'Blue Express Cargo',
        'Expense Date': '2026-10-18',
      },
      {
        'Expense Title': 'Workshop Maintenance & Tools',
        'Amount (INR)': 6200,
        Category: 'Operations',
        Vendor: 'National Tool Works',
        'Expense Date': '2026-10-22',
      },
    ];
  } else if (type === 'inventory') {
    fileName = 'Inventory_Sample_Template';
    sampleData = [
      {
        'Product Name': 'High-Tensile Hex Bolt M8',
        'Unit Price (INR)': 18.5,
        'Current Stock Qty': 450,
        Category: 'Hardware',
        'Unit of Measure': 'Pieces',
        'Minimum Stock Threshold': 50,
      },
      {
        'Product Name': 'Copper Wire Spool 10m',
        'Unit Price (INR)': 240,
        'Current Stock Qty': 85,
        Category: 'Electrical',
        'Unit of Measure': 'Spools',
        'Minimum Stock Threshold': 20,
      },
      {
        'Product Name': 'Industrial Sealant Cartridge',
        'Unit Price (INR)': 380,
        'Current Stock Qty': 30,
        Category: 'Chemicals',
        'Unit of Measure': 'Tubes',
        'Minimum Stock Threshold': 10,
      },
    ];
  }

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `${type.toUpperCase()}`);

  if (format === 'csv') {
    XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
  } else {
    XLSX.writeFile(workbook, `${fileName}.xlsx`, { bookType: 'xlsx' });
  }
};

export default function ImportModal({ isOpen, onClose, onImportSuccess }) {
  const fileInputRef = useRef(null);

  // Workflow steps: 1: 'upload', 2: 'mapping', 3: 'preview', 4: 'complete'
  const [step, setStep] = useState(1);
  const [dataType, setDataType] = useState('sales');

  // File & Workbook state
  const [file, setFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [rawHeaders, setRawHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);

  // Mapping state: { [targetKey]: selectedHeader }
  const [columnMapping, setColumnMapping] = useState({});

  // Validation results from server
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Execution options and state
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [overwriteDuplicates, setOverwriteDuplicates] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isImporting && !isValidating) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isImporting, isValidating]);

  // Reset state on modal open/close
  const handleClose = () => {
    setStep(1);
    setFile(null);
    setWorkbook(null);
    setSheetNames([]);
    setSelectedSheet('');
    setRawHeaders([]);
    setRawRows([]);
    setColumnMapping({});
    setValidationResult(null);
    setValidationError('');
    setImportResult(null);
    onClose();
  };

  // Helper to auto-suggest column mapping based on aliases
  const autoMapHeaders = (headers, targetFields) => {
    const mapping = {};
    const lowerHeaders = headers.map((h) => ({
      raw: h,
      clean: String(h).trim().toLowerCase().replace(/[^a-z0-9]/g, ''),
    }));

    targetFields.forEach((field) => {
      // 1. Direct alias exact match
      let match = lowerHeaders.find((lh) =>
        field.aliases.some((alias) => alias.replace(/[^a-z0-9]/g, '') === lh.clean)
      );

      // 2. Substring match if no exact match found
      if (!match) {
        match = lowerHeaders.find((lh) =>
          field.aliases.some((alias) => lh.clean.includes(alias.replace(/[^a-z0-9]/g, '')))
        );
      }

      if (match) {
        mapping[field.key] = match.raw;
      } else {
        mapping[field.key] = '';
      }
    });

    return mapping;
  };

  // Parse worksheet content safely
  const parseSheet = (wb, sheetName, currentType) => {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return;

    // Convert to 2D array with headers
    const jsonRows = XLSX.utils.sheet_to_json(sheet, {
      raw: false,
      defval: '',
      blankrows: false,
    });

    if (jsonRows.length === 0) {
      setValidationError('Selected worksheet appears to be empty.');
      setRawHeaders([]);
      setRawRows([]);
      return;
    }

    const headers = Object.keys(jsonRows[0] || {});
    setRawHeaders(headers);
    setRawRows(jsonRows);
    setValidationError('');

    // Pre-calculate suggested mapping
    const targetFields = TYPE_FIELDS[currentType] || [];
    const initialMapping = autoMapHeaders(headers, targetFields);
    setColumnMapping(initialMapping);
  };

  // Handle uploaded file
  const handleFileProcess = (uploadedFile) => {
    if (!uploadedFile) return;

    // Validate size (max 10MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setValidationError('File size exceeds the 10MB limit. Please upload a smaller file.');
      return;
    }

    // Validate extension
    const extension = uploadedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(extension)) {
      setValidationError('Unsupported file format. Please upload an .xlsx, .xls, or .csv spreadsheet.');
      return;
    }

    setValidationError('');
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, {
          type: 'array',
          cellFormula: false, // Security: never execute formulas
          cellHTML: false,
        });

        setWorkbook(wb);
        setSheetNames(wb.SheetNames);
        const initialSheet = wb.SheetNames[0];
        setSelectedSheet(initialSheet);
        parseSheet(wb, initialSheet, dataType);
        setStep(2);
      } catch (err) {
        console.error('Spreadsheet parse error:', err);
        setValidationError('Failed to parse spreadsheet. File might be corrupted or password protected.');
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  // Change worksheet
  const handleSheetChange = (sheetName) => {
    setSelectedSheet(sheetName);
    if (workbook) {
      parseSheet(workbook, sheetName, dataType);
    }
  };

  // Change data type
  const handleDataTypeChange = (newType) => {
    setDataType(newType);
    if (rawHeaders.length > 0) {
      const targetFields = TYPE_FIELDS[newType] || [];
      const updatedMapping = autoMapHeaders(rawHeaders, targetFields);
      setColumnMapping(updatedMapping);
    }
  };

  // Map raw row to standard payload
  const transformRowWithMapping = (row, mapping) => {
    const transformed = {};
    Object.entries(mapping).forEach(([targetKey, sourceHeader]) => {
      if (sourceHeader && row[sourceHeader] !== undefined) {
        transformed[targetKey] = row[sourceHeader];
      }
    });
    return transformed;
  };

  // Step 2 -> Step 3: Run Validation via Backend API
  const handleValidateAndPreview = async () => {
    const targetFields = TYPE_FIELDS[dataType] || [];
    // Verify all required fields are mapped
    const missingRequired = targetFields
      .filter((f) => f.required && !columnMapping[f.key])
      .map((f) => f.label);

    if (missingRequired.length > 0) {
      setValidationError(`Please map required fields: ${missingRequired.join(', ')}`);
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      // Transform raw rows according to the mapping
      const mappedRows = rawRows.map((r) => transformRowWithMapping(r, columnMapping));

      const res = await validateImportApi({
        type: dataType,
        rows: mappedRows,
      });

      setValidationResult(res);
      setStep(3);
    } catch (err) {
      console.error('Validation error:', err);
      setValidationError(
        err.response?.data?.message || err.message || 'Error validating data with backend server.'
      );
    } finally {
      setIsValidating(false);
    }
  };

  // Step 3 -> Step 4: Execute Batch Import to MongoDB
  const handleExecuteImport = async () => {
    if (!validationResult || validationResult.validCount === 0) {
      setValidationError('No valid records available to import.');
      return;
    }

    setIsImporting(true);
    setValidationError('');

    try {
      // Filter the rows to import based on validation results and duplicate choices
      let rowsToImport = validationResult.validRows.map((vr) => vr.data);

      if (skipDuplicates && !overwriteDuplicates) {
        // Only include non-duplicates if user chose strictly skip duplicates
        const nonDuplicateRows = validationResult.validRows
          .filter((vr) => !vr.isDuplicate)
          .map((vr) => vr.data);

        // If there are duplicate rows, pass all valid rows to backend with skipDuplicates=true
        // Backend handles skipping safely
      }

      const res = await executeImportApi({
        type: dataType,
        rows: rowsToImport,
        skipDuplicates,
        overwriteDuplicates,
      });

      setImportResult(res);
      setStep(4);

      // Trigger automatic refresh of the dashboard data
      if (typeof onImportSuccess === 'function') {
        onImportSuccess();
      }
    } catch (err) {
      console.error('Execute import error:', err);
      setValidationError(
        err.response?.data?.message || err.message || 'Error saving imported records to database.'
      );
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#202B3C]/50 p-4 backdrop-blur-sm animate-fade-in">
      <div
        className={`${ui.card} flex flex-col w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E7E3DC] px-6 py-4 bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#202B3C] text-white shadow-sm">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#202B3C]">Import Excel / CSV</h2>
              <p className="text-xs text-[#737D8B]">
                Batch import records into your business workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Sample Button */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => generateSampleTemplate(dataType, 'xlsx')}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#E7E3DC] bg-white px-2.5 py-1.5 text-xs font-medium text-[#202B3C] hover:bg-[#F5F3EE] transition-colors"
                title="Download formatted Excel sample file"
              >
                <Download className="h-3.5 w-3.5 text-[#737D8B]" />
                Sample {dataType.charAt(0).toUpperCase() + dataType.slice(1)} Template
              </button>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isImporting}
              className="rounded-md p-1.5 text-[#737D8B] hover:bg-[#E7E3DC]/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 border-b border-[#E7E3DC] bg-white text-xs font-medium">
          {[
            { num: 1, label: '1. Select File' },
            { num: 2, label: '2. Map Columns' },
            { num: 3, label: '3. Validate & Review' },
            { num: 4, label: '4. Completion' },
          ].map((item) => (
            <div
              key={item.num}
              className={`flex items-center justify-center py-2.5 px-3 border-r border-[#E7E3DC] last:border-r-0 transition-colors ${
                step === item.num
                  ? 'bg-[#FAF9F6] text-[#202B3C] font-semibold border-b-2 border-b-[#202B3C]'
                  : step > item.num
                  ? 'text-emerald-700 bg-white'
                  : 'text-[#9AA2AD] bg-white'
              }`}
            >
              <span>{item.label}</span>
              {step > item.num && <CheckCircle2 className="h-3.5 w-3.5 ml-1.5 text-emerald-600 inline" />}
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-5">
          {validationError && (
            <div className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{validationError}</div>
              <button
                type="button"
                onClick={() => setValidationError('')}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* STEP 1: Upload & Target Selection */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Data Type Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737D8B] mb-2">
                  Select Data to Import
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'sales', title: 'Sales Invoices', desc: 'Customer, item, amount, date & payment' },
                    { id: 'expenses', title: 'Business Expenses', desc: 'Category, vendor, cost & date' },
                    { id: 'inventory', title: 'Product Catalog', desc: 'Stock quantities, prices & unit thresholds' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleDataTypeChange(t.id)}
                      className={`text-left p-3.5 rounded-lg border transition-all ${
                        dataType === t.id
                          ? 'border-[#202B3C] bg-[#FAF9F6] ring-1 ring-[#202B3C]'
                          : 'border-[#E7E3DC] hover:border-[#B8C2CC] bg-white'
                      }`}
                    >
                      <div className="font-semibold text-sm text-[#202B3C]">{t.title}</div>
                      <div className="text-xs text-[#737D8B] mt-1">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag & Drop File Zone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#737D8B] mb-2">
                  Upload Spreadsheet
                </label>
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
                      handleFileProcess(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-[#202B3C] bg-[#FAF9F6]'
                      : 'border-[#E7E3DC] hover:border-[#737D8B] bg-[#FAF9F6]/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileProcess(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="h-12 w-12 rounded-full bg-white border border-[#E7E3DC] flex items-center justify-center text-[#202B3C] shadow-sm mb-3">
                    <Upload className="h-6 w-6 text-[#202B3C]" />
                  </div>

                  <p className="text-sm font-semibold text-[#202B3C]">
                    Click to select file or drag & drop here
                  </p>
                  <p className="text-xs text-[#737D8B] mt-1">
                    Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv) up to 10MB
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-[#737D8B] bg-white px-3 py-1.5 rounded-md border border-[#E7E3DC]">
                    <Info className="h-3.5 w-3.5 text-[#202B3C]" />
                    <span>Clean headers and non-empty rows recommended for automatic mapping</span>
                  </div>
                </div>
              </div>

              {/* Download templates guide */}
              <div className="rounded-lg border border-[#E7E3DC] bg-[#FAF9F6] p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#202B3C]">Need a pre-built spreadsheet template?</h4>
                  <p className="text-xs text-[#737D8B] mt-0.5">
                    Download sample files with valid mock data for your chosen data type.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => generateSampleTemplate(dataType, 'xlsx')}
                    className={ui.ghost}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download .xlsx
                  </button>
                  <button
                    type="button"
                    onClick={() => generateSampleTemplate(dataType, 'csv')}
                    className={ui.ghost}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download .csv
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Worksheet Selection & Column Mapping */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#FAF9F6] rounded-lg border border-[#E7E3DC]">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#202B3C]" />
                  <span className="text-xs font-semibold text-[#202B3C]">File:</span>
                  <span className="text-xs text-[#737D8B] font-mono">{file?.name}</span>
                  <span className="text-xs text-[#9AA2AD]">({rawRows.length} rows detected)</span>
                </div>

                {/* Multiple worksheets selector */}
                {sheetNames.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#202B3C]" />
                    <label className="text-xs font-semibold text-[#202B3C]">Worksheet:</label>
                    <select
                      value={selectedSheet}
                      onChange={(e) => handleSheetChange(e.target.value)}
                      className="rounded border border-[#E7E3DC] bg-white px-2 py-1 text-xs text-[#202B3C]"
                    >
                      {sheetNames.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Column Mapping Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#202B3C]">Map Spreadsheet Columns</h3>
                    <p className="text-xs text-[#737D8B]">
                      Match each field in MSME Growth Advisor with the corresponding column from your file.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const targetFields = TYPE_FIELDS[dataType] || [];
                      setColumnMapping(autoMapHeaders(rawHeaders, targetFields));
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#202B3C] hover:underline"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset Auto-Mapping
                  </button>
                </div>

                <div className="rounded-lg border border-[#E7E3DC] overflow-hidden divide-y divide-[#E7E3DC]">
                  <div className="grid grid-cols-12 bg-[#FAF9F6] px-4 py-2.5 text-xs font-semibold text-[#737D8B]">
                    <div className="col-span-5">Application Field</div>
                    <div className="col-span-7">Spreadsheet Header</div>
                  </div>

                  {TYPE_FIELDS[dataType]?.map((field) => (
                    <div key={field.key} className="grid grid-cols-12 px-4 py-3 items-center gap-4 bg-white">
                      <div className="col-span-5">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-[#202B3C]">
                          <span>{field.label}</span>
                          {field.required && (
                            <span className="text-xs font-bold text-red-600" title="Required field">*</span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#9AA2AD]">
                          {field.required ? 'Required field' : 'Optional field'}
                        </span>
                      </div>

                      <div className="col-span-7">
                        <select
                          value={columnMapping[field.key] || ''}
                          onChange={(e) =>
                            setColumnMapping((prev) => ({
                              ...prev,
                              [field.key]: e.target.value,
                            }))
                          }
                          className={ui.select}
                        >
                          <option value="">-- Do Not Import / Skip --</option>
                          {rawHeaders.map((header) => (
                            <option key={header} value={header}>
                              {header} {rawRows[0]?.[header] ? `(e.g. "${rawRows[0][header]}")` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Data Preview Table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#737D8B] mb-2">
                  Source Data Preview (First 4 rows)
                </h4>
                <div className="overflow-x-auto rounded-lg border border-[#E7E3DC]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F6] text-[#737D8B] border-b border-[#E7E3DC]">
                      <tr>
                        <th className="py-2 px-3 font-semibold">#</th>
                        {rawHeaders.map((h) => (
                          <th key={h} className="py-2 px-3 font-semibold whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E3DC]">
                      {rawRows.slice(0, 4).map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF9F6]/50">
                          <td className="py-2 px-3 font-mono text-[#9AA2AD]">{idx + 1}</td>
                          {rawHeaders.map((h) => (
                            <td key={h} className="py-2 px-3 text-[#202B3C] whitespace-nowrap">
                              {row[h] !== undefined ? String(row[h]) : '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Preview, Row-Level Validation & Duplicates Review */}
          {step === 3 && validationResult && (
            <div className="space-y-6 animate-fade-in">
              {/* Validation Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-800">Valid Rows</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-900 mt-1">
                    {validationResult.validCount}
                  </div>
                  <div className="text-xs text-emerald-700 mt-0.5">Ready to import</div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-800">Duplicates Detected</span>
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-amber-900 mt-1">
                    {validationResult.duplicateCount}
                  </div>
                  <div className="text-xs text-amber-700 mt-0.5">Match existing database records</div>
                </div>

                <div className="rounded-lg border border-red-200 bg-red-50/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-800">Invalid Rows</span>
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-900 mt-1">
                    {validationResult.invalidCount}
                  </div>
                  <div className="text-xs text-red-700 mt-0.5">Will be excluded from import</div>
                </div>
              </div>

              {/* Duplicate Handling Preferences */}
              {validationResult.duplicateCount > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                  <h4 className="text-sm font-semibold text-amber-900 mb-2">
                    Duplicate Records Resolution Policy
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-amber-900">
                      <input
                        type="radio"
                        name="duplicatePolicy"
                        checked={skipDuplicates && !overwriteDuplicates}
                        onChange={() => {
                          setSkipDuplicates(true);
                          setOverwriteDuplicates(false);
                        }}
                        className="rounded border-[#E7E3DC] text-[#202B3C] focus:ring-0"
                      />
                      <span>
                        <strong>Skip duplicates</strong> (Safely ignore matching spreadsheet rows and keep current database records unchanged)
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-amber-900">
                      <input
                        type="radio"
                        name="duplicatePolicy"
                        checked={overwriteDuplicates}
                        onChange={() => {
                          setSkipDuplicates(false);
                          setOverwriteDuplicates(true);
                        }}
                        className="rounded border-[#E7E3DC] text-[#202B3C] focus:ring-0"
                      />
                      <span>
                        <strong>Overwrite matching records</strong> (Update existing database entries with data from this spreadsheet)
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Invalid Rows Table if any */}
              {validationResult.invalidCount > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-red-700 mb-2">
                    Invalid Rows ({validationResult.invalidCount}) - Requires Attention
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-red-200 bg-red-50/30 max-h-48">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-red-100/50 text-red-900 border-b border-red-200">
                        <tr>
                          <th className="py-2 px-3 font-semibold">Row #</th>
                          <th className="py-2 px-3 font-semibold">Errors</th>
                          <th className="py-2 px-3 font-semibold">Row Data Sample</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-red-200">
                        {validationResult.invalidRows.map((inv, idx) => (
                          <tr key={idx} className="hover:bg-red-50/50">
                            <td className="py-2 px-3 font-mono text-red-700 font-semibold">{inv.rowNumber}</td>
                            <td className="py-2 px-3 text-red-800 font-medium">
                              {inv.errors?.join('; ')}
                            </td>
                            <td className="py-2 px-3 text-[#737D8B] font-mono text-[11px] truncate max-w-xs">
                              {JSON.stringify(inv.data)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Valid Rows Preview Table */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#737D8B] mb-2">
                  Records Ready For Import ({validationResult.validCount})
                </h4>
                <div className="overflow-x-auto rounded-lg border border-[#E7E3DC] max-h-60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F6] text-[#737D8B] border-b border-[#E7E3DC] sticky top-0">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Row #</th>
                        <th className="py-2 px-3 font-semibold">Status</th>
                        {dataType === 'sales' && (
                          <>
                            <th className="py-2 px-3 font-semibold">Customer</th>
                            <th className="py-2 px-3 font-semibold">Item</th>
                            <th className="py-2 px-3 font-semibold">Amount</th>
                            <th className="py-2 px-3 font-semibold">Date</th>
                            <th className="py-2 px-3 font-semibold">Payment</th>
                          </>
                        )}
                        {dataType === 'expenses' && (
                          <>
                            <th className="py-2 px-3 font-semibold">Title</th>
                            <th className="py-2 px-3 font-semibold">Category</th>
                            <th className="py-2 px-3 font-semibold">Amount</th>
                            <th className="py-2 px-3 font-semibold">Vendor</th>
                            <th className="py-2 px-3 font-semibold">Date</th>
                          </>
                        )}
                        {dataType === 'inventory' && (
                          <>
                            <th className="py-2 px-3 font-semibold">Product</th>
                            <th className="py-2 px-3 font-semibold">Category</th>
                            <th className="py-2 px-3 font-semibold">Stock</th>
                            <th className="py-2 px-3 font-semibold">Unit Price</th>
                            <th className="py-2 px-3 font-semibold">Unit</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E3DC]">
                      {validationResult.validRows.map((vr) => (
                        <tr key={vr.rowNumber} className="hover:bg-[#FAF9F6]/60">
                          <td className="py-2 px-3 font-mono text-[#9AA2AD]">{vr.rowNumber}</td>
                          <td className="py-2 px-3">
                            {vr.isDuplicate ? (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                                Duplicate
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                                Valid
                              </span>
                            )}
                          </td>
                          {dataType === 'sales' && (
                            <>
                              <td className="py-2 px-3 font-medium text-[#202B3C]">{vr.data.client}</td>
                              <td className="py-2 px-3 text-[#737D8B]">{vr.data.item}</td>
                              <td className="py-2 px-3 font-mono font-medium text-[#202B3C]">
                                ₹{Number(vr.data.amount).toLocaleString('en-IN')}
                              </td>
                              <td className="py-2 px-3 text-[#737D8B]">{vr.data.date}</td>
                              <td className="py-2 px-3 text-[#737D8B]">{vr.data.status}</td>
                            </>
                          )}
                          {dataType === 'expenses' && (
                            <>
                              <td className="py-2 px-3 font-medium text-[#202B3C]">{vr.data.title}</td>
                              <td className="py-2 px-3 text-[#737D8B]">{vr.data.category}</td>
                              <td className="py-2 px-3 font-mono font-medium text-[#202B3C]">
                                ₹{Number(vr.data.amount).toLocaleString('en-IN')}
                              </td>
                              <td className="py-2 px-3 text-[#737D8B]">{vr.data.vendor}</td>
                              <td className="py-2 px-3 text-[#737D8B]">{vr.data.date}</td>
                            </>
                          )}
                          {dataType === 'inventory' && (
                            <>
                              <td className="py-2 px-3 font-medium text-[#202B3C]">{vr.data.name}</td>
                              <td className="py-2 px-3 text-[#737D8B]">{vr.data.category}</td>
                              <td className="py-2 px-3 font-mono font-medium text-[#202B3C]">{vr.data.stock}</td>
                              <td className="py-2 px-3 font-mono font-medium text-[#202B3C]">
                                ₹{Number(vr.data.unitPrice).toLocaleString('en-IN')}
                              </td>
                              <td className="py-2 px-3 text-[#737D8B]">{vr.data.unit}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Import Complete Summary */}
          {step === 4 && importResult && (
            <div className="py-8 text-center space-y-4 animate-fade-in">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#202B3C]">Import Successfully Completed!</h3>
                <p className="text-xs text-[#737D8B] mt-1 max-w-md mx-auto">
                  {importResult.message}
                </p>
              </div>

              <div className="inline-grid grid-cols-3 gap-3 p-4 bg-[#FAF9F6] rounded-lg border border-[#E7E3DC] text-left">
                <div>
                  <div className="text-xs text-[#737D8B]">New Added</div>
                  <div className="text-xl font-bold text-emerald-700">{importResult.insertedCount}</div>
                </div>
                <div>
                  <div className="text-xs text-[#737D8B]">Updated</div>
                  <div className="text-xl font-bold text-blue-700">{importResult.updatedCount}</div>
                </div>
                <div>
                  <div className="text-xs text-[#737D8B]">Skipped</div>
                  <div className="text-xl font-bold text-[#737D8B]">{importResult.skippedCount}</div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className={ui.primary}
                >
                  View In Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-[#E7E3DC] px-6 py-4 bg-[#FAF9F6]">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              disabled={isImporting || isValidating}
              className={ui.ghost}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {step < 4 && (
              <button
                type="button"
                onClick={handleClose}
                disabled={isImporting || isValidating}
                className="text-xs text-[#737D8B] hover:text-[#202B3C] font-medium px-3 py-2"
              >
                Cancel
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={handleValidateAndPreview}
                disabled={isValidating}
                className={ui.primary}
              >
                {isValidating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Validating Rows...
                  </>
                ) : (
                  <>
                    Validate & Preview
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={isImporting || !validationResult || validationResult.validCount === 0}
                className={ui.primary}
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Importing Records...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm & Import ({validationResult?.validCount} records)
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

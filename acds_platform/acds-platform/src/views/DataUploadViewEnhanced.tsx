import { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, TrendingUp, Database, X } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { useDatasetStore } from '../store/datasetStore';
import { useUploadDataset } from '../hooks/useDatasetAnalysis';
import type { Dataset, DatasetMetadata, ColumnMappings } from '../types/dataset';
import { analyzeColumns, autoDetectMappings } from '../utils/dataProcessor';

interface DataUploadViewEnhancedProps {
  onDatasetUploaded: (dataset: Dataset) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const DataUploadViewEnhanced: React.FC<DataUploadViewEnhancedProps> = ({ 
  onDatasetUploaded
}) => {
  // Get existing datasets from Zustand store
  const store = useDatasetStore();
  const existingDatasets = store.datasets.map(ds => ds.metadata);
  
  // Use React Query mutation for upload
  const uploadMutation = useUploadDataset();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Dataset | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [datasetPeriod, setDatasetPeriod] = useState('');
  const [manualMappings, setManualMappings] = useState<ColumnMappings>({});
  const [showManualMapping, setShowManualMapping] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state
    setUploading(true);
    setError(null);
    setUploadProgress(0);
    setProcessingStage('Validating file...');

    try {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      }

      // Validate file type
      const fileName = file.name.toLowerCase();
      const fileType = fileName.endsWith('.csv') ? 'csv' : 
                      fileName.endsWith('.xlsx') || fileName.endsWith('.xls') ? 'xlsx' : null;
      
      if (!fileType) {
        throw new Error('Invalid file type. Please upload CSV or Excel (.xlsx, .xls) files only.');
      }

      setUploadProgress(20);

      if (fileType === 'csv') {
        await parseCSV(file);
      } else {
        await parseExcel(file);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const parseCSV = async (file: File) => {
    setProcessingStage('Parsing CSV file...');
    setUploadProgress(40);

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          throw new Error(`Parse error: ${results.errors[0].message}`);
        }

        const data = results.data as Record<string, any>[];
        processDataset(data, file, 'csv');
      },
      error: (error) => {
        throw new Error(`Failed to parse CSV: ${error.message}`);
      }
    });
  };

  const parseExcel = async (file: File) => {
    setProcessingStage('Parsing Excel file...');
    setUploadProgress(40);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
        
        if (jsonData.length === 0) {
          throw new Error('Excel file is empty or has no valid data');
        }

        processDataset(jsonData as Record<string, any>[], file, 'xlsx');
      } catch (err) {
        throw new Error(`Failed to parse Excel: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    reader.onerror = () => {
      throw new Error('Failed to read file');
    };

    reader.readAsArrayBuffer(file);
  };

  const processDataset = (data: Record<string, any>[], file: File, fileType: 'csv' | 'xlsx') => {
    setProcessingStage('Analyzing columns...');
    setUploadProgress(60);

    if (data.length === 0) {
      throw new Error('File is empty or has no valid data rows.');
    }

    // Analyze dataset
    const columns = analyzeColumns(data);
    const mappings = autoDetectMappings(columns);

    setProcessingStage('Generating preview...');
    setUploadProgress(80);

    const metadata: DatasetMetadata = {
      id: `DS_${Date.now()}`,
      name: datasetName || file.name.replace(/\.(csv|xlsx|xls)$/i, ''),
      uploadDate: new Date().toISOString(),
      period: datasetPeriod || 'Current Period',
      rowCount: data.length,
      columnCount: columns.length,
      fileType,
      fileSize: file.size
    };

    const dataset: Dataset = {
      metadata,
      columns,
      data,
      mappings: { ...mappings, ...manualMappings }
    };

    setPreview(dataset);
    setUploadProgress(100);
    setUploading(false);
    setProcessingStage('');
    
    toast.success(`Successfully loaded ${data.length} rows from ${file.name}`);
  };

  const handleConfirmUpload = () => {
    if (preview) {
      // Use React Query mutation
      uploadMutation.mutate(preview);
      
      // Call parent callback
      onDatasetUploaded(preview);
      
      // Reset form
      setPreview(null);
      setDatasetName('');
      setDatasetPeriod('');
      setManualMappings({});
      setShowManualMapping(false);
    }
  };

  const handleManualMapping = (metricKey: string, columnName: string) => {
    setManualMappings(prev => ({
      ...prev,
      [metricKey]: columnName || undefined
    }));
    
    if (preview) {
      setPreview({
        ...preview,
        mappings: {
          ...preview.mappings,
          ...manualMappings,
          [metricKey]: columnName || undefined
        }
      });
    }
  };

  const clearError = () => setError(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dataset Upload</h1>
        <p className="text-gray-600 mt-2">
          Upload CSV or Excel files to generate dynamic AI-powered insights
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <Database className="w-16 h-16 text-corporate-navy mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Upload New Dataset
            </h2>
            <p className="text-gray-600 text-sm">
              Supported: CSV, Excel (.xlsx, .xls) • Max 10MB
            </p>
          </div>

          {/* Dataset Metadata */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dataset Name *
              </label>
              <input
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="e.g., Q1 2026 Financial Data"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-navy focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period *
              </label>
              <input
                type="text"
                value={datasetPeriod}
                onChange={(e) => setDatasetPeriod(e.target.value)}
                placeholder="e.g., Q1 2026, Jan-Mar 2026"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-corporate-navy focus:border-transparent"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-corporate-navy transition-colors">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer flex flex-col items-center ${uploading ? 'opacity-50' : ''}`}
            >
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <span className="text-sm font-medium text-gray-700 mb-1">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500">
                CSV, XLSX, XLS up to 10MB
              </span>
            </label>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">{processingStage}</span>
                <span className="text-sm font-medium text-corporate-navy">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-corporate-navy h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Upload Error</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
              <button onClick={clearError} className="text-red-600 hover:text-red-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {preview && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Dataset Preview
                </h3>
                <p className="text-sm text-gray-600">
                  {preview.metadata.rowCount} rows × {preview.metadata.columnCount} columns • {preview.metadata.fileType.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowManualMapping(!showManualMapping)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {showManualMapping ? 'Hide' : 'Edit'} Mappings
              </button>
              <button
                onClick={handleConfirmUpload}
                className="btn-primary flex items-center"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze Dataset
              </button>
            </div>
          </div>

          {/* Manual Mapping UI */}
          {showManualMapping && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Manual Column Mapping
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {['revenue', 'expenses', 'profit', 'employees', 'customers', 'retention', 'satisfaction'].map(metric => (
                  <div key={metric}>
                    <label className="block text-xs text-gray-600 mb-1 capitalize">{metric}</label>
                    <select
                      value={preview.mappings?.[metric as keyof ColumnMappings] || ''}
                      onChange={(e) => handleManualMapping(metric, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-corporate-navy"
                    >
                      <option value="">Not mapped</option>
                      {preview.columns.map(col => (
                        <option key={col.name} value={col.name}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auto-Detected Mappings */}
          {!showManualMapping && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Auto-Detected Mappings
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(preview.mappings || {}).map(([key, value]) => (
                  value && (
                    <div key={key} className="bg-gray-50 rounded px-3 py-2">
                      <span className="text-xs text-gray-500 uppercase">{key}</span>
                      <p className="text-sm font-medium text-gray-900">{value}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Data Preview Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {preview.columns.slice(0, 6).map((col) => (
                    <th
                      key={col.name}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col.name}
                      <span className="ml-1 text-gray-400">({col.type})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.data.slice(0, 5).map((row, idx) => (
                  <tr key={idx}>
                    {preview.columns.slice(0, 6).map((col) => (
                      <td key={col.name} className="px-4 py-3 text-sm text-gray-900">
                        {String(row[col.name] ?? 'N/A')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.columns.length > 6 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Showing first 6 of {preview.columns.length} columns
            </p>
          )}
        </div>
      )}

      {/* Historical Datasets */}
      {existingDatasets.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Historical Datasets ({existingDatasets.length})
          </h3>
          <div className="space-y-3">
            {existingDatasets.map((ds) => (
              <div
                key={ds.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <FileSpreadsheet className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ds.name}</p>
                    <p className="text-xs text-gray-500">
                      {ds.period} • {ds.rowCount} rows • {ds.fileType.toUpperCase()} • {new Date(ds.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

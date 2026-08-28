import { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, TrendingUp, Database } from 'lucide-react';
import Papa from 'papaparse';
import type { Dataset, DatasetMetadata } from '../types/dataset';
import { analyzeColumns, autoDetectMappings } from '../utils/dataProcessor';

interface DataUploadViewProps {
  onDatasetUploaded: (dataset: Dataset) => void;
  existingDatasets: DatasetMetadata[];
}

export const DataUploadView: React.FC<DataUploadViewProps> = ({ 
  onDatasetUploaded,
  existingDatasets 
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Dataset | null>(null);
  const [datasetName, setDatasetName] = useState('');
  const [datasetPeriod, setDatasetPeriod] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Validate file type
      const fileType = file.name.endsWith('.csv') ? 'csv' : 
                      file.name.endsWith('.xlsx') ? 'xlsx' : null;
      
      if (!fileType) {
        throw new Error('Invalid file type. Please upload CSV or Excel (.xlsx) files only.');
      }

      if (fileType === 'xlsx') {
        setError('Excel files require additional library. Please convert to CSV for now.');
        setUploading(false);
        return;
      }

      // Parse CSV
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError(`Parse error: ${results.errors[0].message}`);
            setUploading(false);
            return;
          }

          const data = results.data as Record<string, any>[];
          
          if (data.length === 0) {
            setError('File is empty or has no valid data rows.');
            setUploading(false);
            return;
          }

          // Analyze dataset
          const columns = analyzeColumns(data);
          const mappings = autoDetectMappings(columns);

          const metadata: DatasetMetadata = {
            id: `DS_${Date.now()}`,
            name: datasetName || file.name.replace('.csv', ''),
            uploadDate: new Date().toISOString(),
            period: datasetPeriod || 'Current Period',
            rowCount: data.length,
            columnCount: columns.length,
            fileType: 'csv',
            fileSize: file.size
          };

          const dataset: Dataset = {
            metadata,
            columns,
            data,
            mappings
          };

          setPreview(dataset);
          setUploading(false);
        },
        error: (error) => {
          setError(`Failed to parse file: ${error.message}`);
          setUploading(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setUploading(false);
    }
  };

  const handleConfirmUpload = () => {
    if (preview) {
      onDatasetUploaded(preview);
      setPreview(null);
      setDatasetName('');
      setDatasetPeriod('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dataset Upload</h1>
        <p className="text-gray-600 mt-2">
          Upload company data to generate dynamic insights and predictions
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
              Supported formats: CSV, Excel (.xlsx)
            </p>
          </div>

          {/* Dataset Metadata */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dataset Name
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
                Period
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
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <span className="text-sm font-medium text-gray-700 mb-1">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500">
                CSV or XLSX up to 10MB
              </span>
            </label>
          </div>

          {uploading && (
            <div className="mt-4 flex items-center justify-center text-corporate-navy">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-corporate-navy mr-2" />
              <span className="text-sm">Processing file...</span>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Upload Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
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
                  {preview.metadata.rowCount} rows × {preview.metadata.columnCount} columns
                </p>
              </div>
            </div>
            <button
              onClick={handleConfirmUpload}
              className="btn-primary flex items-center"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analyze Dataset
            </button>
          </div>

          {/* Column Mappings */}
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
            Historical Datasets
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
                      {ds.period} • {ds.rowCount} rows • {new Date(ds.uploadDate).toLocaleDateString()}
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

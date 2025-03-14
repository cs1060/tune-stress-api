import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EndpointInfo, GeneratedTestData } from '../types';
import axios from 'axios';

interface TestDataGeneratorProps {
  endpoint: EndpointInfo;
  onClose: () => void;
}

export const TestDataGenerator: React.FC<TestDataGeneratorProps> = ({
  endpoint,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState<GeneratedTestData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateTestData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/generate-test-data', {
        endpoint: endpoint,
      });
      setTestData(response.data);
    } catch (err) {
      setError('Failed to generate test data. Please try again.');
      console.error('Error generating test data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-apple-gray-800 rounded-apple-lg shadow-apple p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-apple-gray-900 dark:text-white text-lg font-semibold">
          Generate Test Data
        </h2>
        <button
          onClick={onClose}
          className="text-apple-gray-500 hover:text-apple-gray-700 dark:text-apple-gray-400 dark:hover:text-apple-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-apple-gray-100 dark:bg-apple-gray-900 rounded-apple p-4">
          <div className="text-sm text-apple-gray-500 dark:text-apple-gray-400 mb-2">
            Endpoint
          </div>
          <div className="flex items-center space-x-3">
            <span className="bg-apple-blue text-white px-3 py-1 rounded-apple text-sm font-medium">
              {endpoint.method}
            </span>
            <span className="text-apple-gray-900 dark:text-white font-medium">
              {endpoint.path}
            </span>
          </div>
        </div>

        <button
          onClick={generateTestData}
          disabled={loading}
          className="w-full bg-apple-blue text-white py-2 rounded-apple font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Test Data'}
        </button>

        {error && (
          <div className="text-apple-red text-sm mt-2">{error}</div>
        )}

        {testData && (
          <div className="mt-4">
            <div className="bg-apple-gray-100 dark:bg-apple-gray-900 rounded-apple p-4 overflow-auto">
              <pre className="text-sm text-apple-gray-900 dark:text-white">
                {JSON.stringify(testData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

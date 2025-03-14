import React, { useState } from 'react';
import { RequestDataGenerator } from './lib/RequestDataGenerator';

function App() {
  const [apiUrl, setApiUrl] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const generator = new RequestDataGenerator();
      await generator.initialize(apiUrl);
      const generatedRequests = generator.generateAllRequests();
      setRequests(generatedRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Data Generator</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-2">
              FastAPI OpenAPI Documentation URL
            </label>
            <input
              id="apiUrl"
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://your-api.com/openapi.json"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading || !apiUrl}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Test Data'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
            {error}
          </div>
        )}

        {requests.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Requests</h2>
            {requests.map((request, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <h3 className="font-medium text-lg mb-2">
                  {request.method} {request.path}
                </h3>
                <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(request, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
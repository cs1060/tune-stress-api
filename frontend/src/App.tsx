import React, { useState } from 'react';
import axios from 'axios';
import { EndpointCard, EndpointDetails } from './components/EndpointCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { EndpointInfo } from './types';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [endpoints, setEndpoints] = useState<EndpointInfo[]>([
    {
      path: '/api/users',
      method: 'GET',
      description: 'Get all users',
      parameters: [],
    },
    {
      path: '/api/users/{id}',
      method: 'POST',
      description: 'Create a new user',
      parameters: [],
    },
    {
      path: '/api/users/{id}',
      method: 'PUT',
      description: 'Update user details',
      parameters: [],
    },
  ]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discoverEndpoints = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/discover-endpoints', {
        api_url: apiUrl,
      });
      setEndpoints(response.data.endpoints);
    } catch (err) {
      setError('Failed to discover endpoints. Please check the URL and try again.');
      console.error('Error discovering endpoints:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-apple-gray-900' : 'bg-apple-gray-100'}`}>
      <nav className="bg-white/80 dark:bg-apple-gray-800/80 backdrop-blur-lg border-b border-apple-gray-200 dark:border-apple-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-apple-gray-900 dark:text-white font-semibold text-lg">
              FastAPI Test Data Generator
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-apple-gray-200 dark:hover:bg-apple-gray-700"
              >
                {darkMode ? (
                  <SunIcon className="w-5 h-5 text-white" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-apple-gray-900" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-apple-gray-800 rounded-apple-lg shadow-apple p-6 mb-8">
          <div className="flex space-x-4">
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="Enter FastAPI URL"
              className="flex-1 bg-apple-gray-100 dark:bg-apple-gray-900 border-0 rounded-apple px-4 py-2 text-apple-gray-900 dark:text-white placeholder-apple-gray-500 focus:ring-2 focus:ring-apple-blue focus:outline-none"
            />
            <button
              onClick={discoverEndpoints}
              disabled={loading}
              className="bg-apple-blue text-white px-6 py-2 rounded-apple font-medium hover:opacity-90 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && <ArrowPathIcon className="w-5 h-5 animate-spin" />}
              <span>Discover Endpoints</span>
            </button>
          </div>
          {error && (
            <p className="mt-4 text-apple-red text-sm">{error}</p>
          )}
        </div>

        <AnimatePresence>
          {endpoints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {endpoints.map((endpoint, index) => (
                <EndpointCard
                  key={endpoint.path}
                  method={endpoint.method as 'GET' | 'POST' | 'PUT' | 'DELETE'}
                  path={endpoint.path}
                  description={endpoint.description || 'No description available'}
                  onSelect={() => setSelectedEndpoint(endpoint)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <EndpointDetails
        open={!!selectedEndpoint}
        onClose={() => setSelectedEndpoint(null)}
        endpoint={selectedEndpoint}
      />
    </div>
  );
}

export default App;

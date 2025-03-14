import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Activity, AlertCircle } from 'lucide-react';
import { URLInput } from './components/URLInput';
import { EndpointList } from './components/EndpointList';
import { TestConfigPanel } from './components/TestConfigPanel';
import { InteractionModes } from './components/InteractionModes';
import { OpenAPISpec, Endpoint, LoadTestConfig } from './types';

function App() {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [interactionMode, setInteractionMode] = useState<string>('gui');
  const [testConfig, setTestConfig] = useState({
    concurrent: 10,
    duration: 30
  });

  const { data: spec, isLoading, error } = useQuery<OpenAPISpec>(
    ['openapi', apiUrl],
    async () => {
      if (!apiUrl) return null;
      
      try {
        const isExternal = apiUrl.startsWith('http');
        const fullUrl = isExternal
          ? `/api${apiUrl.endsWith('/openapi.json') ? '' : '/openapi.json'}`
          : apiUrl;

        const response = await fetch(fullUrl, {
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data || !data.paths) {
          throw new Error('Invalid OpenAPI documentation format');
        }
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to fetch API documentation: ${error.message}`);
        }
        throw new Error('Failed to fetch API documentation');
      }
    },
    {
      retry: 1,
      retryDelay: 1000,
      enabled: !!apiUrl,
    }
  );

  const endpoints: Endpoint[] = React.useMemo(() => {
    if (!spec?.paths) return [];
    
    return Object.entries(spec.paths).flatMap(([path, methods]) => {
      if (!methods) return [];
      
      return Object.entries(methods).map(([method, details]) => ({
        path,
        method: method.toUpperCase(),
        summary: details?.summary,
        schema: details?.requestBody?.content?.['application/json']?.schema
      }));
    });
  }, [spec]);

  const handleStartTest = (config: LoadTestConfig) => {
    console.log('Starting load test with config:', config);
  };

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.toLowerCase().trim().split(' ');
    
    const commandMap: { [key: string]: (...args: string[]) => void } = {
      'next': () => {
        const currentIndex = endpoints.findIndex(e => e === selectedEndpoint);
        if (currentIndex < endpoints.length - 1) {
          setSelectedEndpoint(endpoints[currentIndex + 1]);
        }
      },
      'prev': () => {
        const currentIndex = endpoints.findIndex(e => e === selectedEndpoint);
        if (currentIndex > 0) {
          setSelectedEndpoint(endpoints[currentIndex - 1]);
        }
      },
      'run': () => {
        if (selectedEndpoint) {
          handleStartTest({
            url: apiUrl,
            endpoint: selectedEndpoint,
            concurrent: testConfig.concurrent,
            duration: testConfig.duration,
            data: {}
          });
        }
      },
      'list': () => {
        console.log('Available endpoints:');
        endpoints.forEach((endpoint, index) => {
          console.log(`${index + 1}. ${endpoint.method} ${endpoint.path}`);
        });
      },
      'select': (indexStr) => {
        const index = parseInt(indexStr, 10) - 1;
        if (index >= 0 && index < endpoints.length) {
          setSelectedEndpoint(endpoints[index]);
        }
      },
      'set': (param, value) => {
        if (param === 'concurrent' || param === 'duration') {
          const numValue = parseInt(value, 10);
          if (!isNaN(numValue)) {
            setTestConfig(prev => ({ ...prev, [param]: numValue }));
          }
        }
      },
      'help': () => {
        console.log(`
Available commands:
  next              - Move to next endpoint
  prev              - Move to previous endpoint
  run               - Start load test with current endpoint
  list              - Show all available endpoints
  select <number>   - Select endpoint by number
  set <param> <value> - Set test parameters:
    set concurrent <number> - Set concurrent users
    set duration <number>   - Set test duration in seconds
  help              - Show this help message
        `.trim());
      }
    };

    if (commandMap[cmd]) {
      commandMap[cmd](...args);
    } else {
      console.log('Unknown command. Type "help" for available commands.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center space-x-3 mb-12">
          <Activity className="text-blue-500" size={36} />
          <h1 className="text-4xl font-semibold text-gray-900">FastAPI Load Tester</h1>
        </div>

        <div className="mb-10 max-w-3xl">
          <URLInput onSubmit={setApiUrl} isLoading={isLoading} />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm text-red-700">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </p>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading API documentation...</p>
          </div>
        )}

        {spec && endpoints.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EndpointList
              endpoints={endpoints}
              onSelect={setSelectedEndpoint}
              selectedEndpoint={selectedEndpoint}
            />
            {selectedEndpoint && (
              <TestConfigPanel
                endpoint={selectedEndpoint}
                onStartTest={handleStartTest}
              />
            )}
          </div>
        )}

        <InteractionModes
          onModeChange={setInteractionMode}
          onCommand={handleCommand}
        />
      </div>
    </div>
  );
}

export default App;
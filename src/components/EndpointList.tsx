import React from 'react';
import { ChevronRight, Code } from 'lucide-react';
import { Endpoint } from '../types';

interface EndpointListProps {
  endpoints: Endpoint[];
  onSelect: (endpoint: Endpoint) => void;
  selectedEndpoint: Endpoint | null;
}

export function EndpointList({ endpoints, onSelect, selectedEndpoint }: EndpointListProps) {
  return (
    <div className="apple-card p-6">
      <h2 className="text-xl font-semibold mb-6">Available Endpoints</h2>
      <div className="space-y-2">
        {endpoints.map((endpoint) => {
          const isSelected = selectedEndpoint?.path === endpoint.path && 
                           selectedEndpoint?.method === endpoint.method;
          return (
            <button
              key={`${endpoint.method}-${endpoint.path}`}
              onClick={() => onSelect(endpoint)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200
                         flex items-center justify-between group
                         ${isSelected 
                           ? 'bg-blue-50 border border-blue-100' 
                           : 'hover:bg-gray-50 border border-transparent'}`}
            >
              <div className="flex items-center space-x-3">
                <Code className={`${isSelected ? 'text-blue-500' : 'text-gray-400'}`} size={20} />
                <div>
                  <span className={`font-mono text-sm px-2.5 py-1 rounded-full
                                  ${isSelected 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-gray-100 text-gray-600'}`}>
                    {endpoint.method}
                  </span>
                  <span className={`ml-2 font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {endpoint.path}
                  </span>
                </div>
              </div>
              <ChevronRight
                size={18}
                className={`transition-all duration-200
                           ${isSelected 
                             ? 'text-blue-500 translate-x-0 opacity-100' 
                             : 'text-gray-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
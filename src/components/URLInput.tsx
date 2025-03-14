import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function URLInput({ onSubmit, isLoading }: URLInputProps) {
  const [url, setUrl] = useState('https://api.thebighalo.com');
  const [showWarning, setShowWarning] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      new URL(url);
    } catch {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);
    onSubmit(url);
  };

  return (
    <div className="apple-card p-6">
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          FastAPI Server URL
        </label>
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setShowWarning(false);
            }}
            placeholder="Enter FastAPI server URL (e.g., https://api.example.com)"
            className="apple-input pl-4 pr-12"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
          >
            <Search size={20} />
          </button>
        </div>
        {showWarning && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start space-x-2">
            <AlertCircle className="text-yellow-500 flex-shrink-0" size={16} />
            <p className="text-sm text-yellow-700">
              Please enter a valid URL
            </p>
          </div>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Enter your FastAPI server URL - we'll automatically fetch the OpenAPI documentation
        </p>
      </form>
    </div>
  );
}
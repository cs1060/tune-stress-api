import React, { useState } from 'react';
import { Play, Sliders } from 'lucide-react';
import { Endpoint, LoadTestConfig } from '../types';

interface TestConfigPanelProps {
  endpoint: Endpoint;
  onStartTest: (config: LoadTestConfig) => void;
}

export function TestConfigPanel({ endpoint, onStartTest }: TestConfigPanelProps) {
  const [config, setConfig] = useState({
    concurrent: 10,
    duration: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartTest({
      url: '',
      endpoint,
      ...config,
      data: {}
    });
  };

  return (
    <div className="apple-card p-6">
      <div className="flex items-center space-x-3 mb-8">
        <Sliders className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold">Test Configuration</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Concurrent Users
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={config.concurrent}
            onChange={(e) => setConfig({ ...config, concurrent: +e.target.value })}
            className="apple-input"
          />
          <p className="mt-1.5 text-sm text-gray-500">
            Number of simultaneous users (1-1000)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Duration
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="1"
              max="3600"
              value={config.duration}
              onChange={(e) => setConfig({ ...config, duration: +e.target.value })}
              className="apple-input"
            />
            <span className="text-sm text-gray-600 font-medium">seconds</span>
          </div>
          <p className="mt-1.5 text-sm text-gray-500">
            How long to run the test (1-3600 seconds)
          </p>
        </div>

        <button type="submit" className="apple-button w-full mt-8">
          <Play size={18} />
          <span>Start Load Test</span>
        </button>
      </form>
    </div>
  );
}
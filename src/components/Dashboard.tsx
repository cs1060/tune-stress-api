import React from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Clock, Users, Server, AlertTriangle } from 'lucide-react';
import { TestReport } from '../types';

// Sample data - In a real app, this would come from your API
const sampleReport: TestReport = {
  config: {
    id: "test-123",
    startTime: Date.now() - 3600000,
    endTime: Date.now(),
    totalRequests: 10000,
    concurrentUsers: 100,
    targetUrl: "https://api.example.com/endpoint"
  },
  metrics: Array.from({ length: 60 }, (_, i) => ({
    timestamp: Date.now() - (3600000 - i * 60000),
    responseTime: Math.random() * 100 + 50,
    throughput: Math.random() * 1000 + 500,
    errorRate: Math.random() * 2,
    cpu: Math.random() * 60 + 20,
    memory: Math.random() * 40 + 30
  })),
  summary: {
    avgResponseTime: 75,
    p50ResponseTime: 70,
    p90ResponseTime: 120,
    p99ResponseTime: 200,
    totalErrors: 150,
    errorRate: 1.5,
    peakThroughput: 1200,
    avgCpu: 45,
    peakMemory: 65
  }
};

const StatCard = ({ icon: Icon, title, value, unit }: { icon: any, title: string, value: number, unit: string }) => (
  <div className="bg-white rounded-lg p-6 shadow-md">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-100 rounded-full">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">
          {value.toFixed(2)} {unit}
        </p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const formatTime = (timestamp: number) => format(new Date(timestamp), 'HH:mm');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance Test Results</h1>
          <p className="text-gray-600 mt-2">
            Test ID: {sampleReport.config.id} • 
            Duration: {format(sampleReport.config.startTime, 'HH:mm')} - {format(sampleReport.config.endTime, 'HH:mm')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Clock}
            title="Avg Response Time"
            value={sampleReport.summary.avgResponseTime}
            unit="ms"
          />
          <StatCard
            icon={Activity}
            title="Peak Throughput"
            value={sampleReport.summary.peakThroughput}
            unit="req/s"
          />
          <StatCard
            icon={AlertTriangle}
            title="Error Rate"
            value={sampleReport.summary.errorRate}
            unit="%"
          />
          <StatCard
            icon={Users}
            title="Concurrent Users"
            value={sampleReport.config.concurrentUsers}
            unit="users"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Response Time Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampleReport.metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTime}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => formatTime(label as number)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#2563eb"
                  name="Response Time (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">System Resources</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampleReport.metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTime}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => formatTime(label as number)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#dc2626"
                  name="CPU Usage (%)"
                />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#16a34a"
                  name="Memory Usage (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Throughput Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampleReport.metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTime}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => formatTime(label as number)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  stroke="#7c3aed"
                  name="Requests/sec"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Response Time Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'P50', value: sampleReport.summary.p50ResponseTime },
                { name: 'P90', value: sampleReport.summary.p90ResponseTime },
                { name: 'P99', value: sampleReport.summary.p99ResponseTime }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Response Time (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
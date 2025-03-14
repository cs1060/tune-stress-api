
import { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestResult } from '@/interfaces/test';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ResultsViewProps {
  testResult: TestResult | null;
  isVisible: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000', '#A020F0'];

const ResultsView = ({ testResult, isVisible }: ResultsViewProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isVisible && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isVisible, testResult]);
  
  if (!testResult) return null;

  // Prepare data for charts
  const timeSeriesData = testResult.timeSeries.map((point, index) => ({
    name: index,
    time: (point.timestamp - testResult.timestamp) / 1000, // seconds since start
    responseTime: point.responseTime,
    statusCode: point.statusCode,
  }));
  
  // Filter points to avoid too many data points in chart
  const sampleInterval = Math.max(1, Math.floor(timeSeriesData.length / 100));
  const sampledTimeSeriesData = timeSeriesData.filter((_, index) => index % sampleInterval === 0);
  
  // Prepare data for status code chart
  const statusCodeData = Object.entries(testResult.statusCodes).map(([code, count]) => ({
    name: code,
    value: count,
  }));
  
  return (
    <section 
      ref={containerRef}
      className={`py-12 px-6 transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Test Results</h2>
          <div className="flex items-center justify-center space-x-2">
            <Badge variant={testResult.status === 'completed' ? 'default' : 'destructive'}>
              {testResult.status === 'completed' ? 'Complete' : testResult.status}
            </Badge>
            <span className="text-gray-500">•</span>
            <div className="text-gray-600 dark:text-gray-300">
              {new Date(testResult.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
        
        <Card className="p-6 mb-8 glass-morphism">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-blue-600 dark:text-blue-300 text-sm font-medium mb-1">Total Requests</div>
              <div className="text-3xl font-bold">{testResult.totalRequests.toLocaleString()}</div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-green-600 dark:text-green-300 text-sm font-medium mb-1">Avg Response Time</div>
              <div className="text-3xl font-bold">{testResult.avgResponseTime.toFixed(2)} ms</div>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-purple-600 dark:text-purple-300 text-sm font-medium mb-1">Requests/sec</div>
              <div className="text-3xl font-bold">{testResult.requestsPerSecond.toFixed(2)}</div>
            </div>
            
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="text-amber-600 dark:text-amber-300 text-sm font-medium mb-1">Success Rate</div>
              <div className="text-3xl font-bold">
                {testResult.totalRequests > 0
                  ? ((testResult.successfulRequests / testResult.totalRequests) * 100).toFixed(1)
                  : 0}%
              </div>
            </div>
          </div>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeseries">Time Series</TabsTrigger>
            <TabsTrigger value="statuscodes">Status Codes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-6">
            <Card className="p-6 glass-morphism">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Performance Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Min Response Time</div>
                    <div className="text-lg font-semibold">
                      {testResult.minResponseTime === Infinity ? 0 : testResult.minResponseTime} ms
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Average Response Time</div>
                    <div className="text-lg font-semibold">{testResult.avgResponseTime.toFixed(2)} ms</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Max Response Time</div>
                    <div className="text-lg font-semibold">{testResult.maxResponseTime} ms</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Request Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Total Requests</div>
                    <div className="text-lg font-semibold">{testResult.totalRequests.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Successful Requests</div>
                    <div className="text-lg font-semibold">{testResult.successfulRequests.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="text-gray-500 dark:text-gray-400 text-sm">Failed Requests</div>
                    <div className="text-lg font-semibold">{testResult.failedRequests.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Response Time Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sampledTimeSeriesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} 
                      />
                      <YAxis 
                        label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${value} ms`, 'Response Time']}
                        labelFormatter={(value) => `Time: ${value}s`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="responseTime" 
                        name="Response Time" 
                        fill="#3B82F6" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="timeseries" className="pt-6">
            <Card className="p-6 glass-morphism">
              <h3 className="text-lg font-medium mb-4">Response Time Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sampledTimeSeriesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }} 
                    />
                    <YAxis 
                      label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} 
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value} ms`, 'Response Time']}
                      labelFormatter={(value) => `Time: ${value}s`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      name="Response Time" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="statuscodes" className="pt-6">
            <Card className="p-6 glass-morphism">
              <h3 className="text-lg font-medium mb-4">Status Code Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <div className="w-full md:w-1/2 h-full">
                      <PieChart width={300} height={300}>
                        <Pie
                          data={statusCodeData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusCodeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [value, 'Requests']}
                          labelFormatter={(value) => `Status: ${value}`}
                        />
                      </PieChart>
                    </div>
                    <div className="w-full md:w-1/2 h-full">
                      <div className="space-y-4">
                        <h4 className="text-base font-medium text-center md:text-left">Status Code Details</h4>
                        <div className="space-y-2">
                          {statusCodeData.map((status, index) => (
                            <div key={status.name} className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full mr-2" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="font-medium">{status.name}</span>
                                  <span>{status.value} requests</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="h-2 rounded-full" 
                                    style={{ 
                                      width: `${(status.value / testResult.totalRequests) * 100}%`,
                                      backgroundColor: COLORS[index % COLORS.length] 
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ResultsView;

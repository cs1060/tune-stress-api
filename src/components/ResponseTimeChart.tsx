
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { RequestMetric } from '@/models/PerformanceMetrics';
import { cn } from '@/lib/utils';

interface ResponseTimeChartProps {
  requestMetrics: RequestMetric[];
  className?: string;
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ requestMetrics, className }) => {
  const [activeTab, setActiveTab] = useState('endpoints');
  
  // Process data for charts
  const processDataByTime = () => {
    const sortedData = [...requestMetrics].sort((a, b) => a.timestamp - b.timestamp);
    
    // Generate time buckets (one point per second)
    const buckets: Record<number, { avg: number; count: number }> = {};
    
    sortedData.forEach(metric => {
      // Round to seconds for bucketing
      const second = Math.floor(metric.timestamp / 1000) * 1000;
      
      if (!buckets[second]) {
        buckets[second] = { avg: 0, count: 0 };
      }
      
      // Incrementally calculate average
      buckets[second].avg = (buckets[second].avg * buckets[second].count + metric.responseTime) / 
                            (buckets[second].count + 1);
      buckets[second].count += 1;
    });
    
    // Convert to array for chart
    return Object.entries(buckets).map(([time, data]) => ({
      timestamp: parseInt(time),
      formattedTime: formatTimestamp(parseInt(time)),
      avgResponseTime: data.avg
    }));
  };
  
  const processDataByEndpoint = () => {
    // Group by endpoint
    const endpointData: Record<string, RequestMetric[]> = {};
    
    requestMetrics.forEach(metric => {
      if (!endpointData[metric.endpoint]) {
        endpointData[metric.endpoint] = [];
      }
      
      endpointData[metric.endpoint].push(metric);
    });
    
    // Calculate averages per endpoint
    return Object.entries(endpointData).map(([endpoint, metrics]) => {
      const totalTime = metrics.reduce((sum, m) => sum + m.responseTime, 0);
      const averageTime = totalTime / metrics.length;
      
      return {
        endpoint,
        averageResponseTime: averageTime,
        requestCount: metrics.length
      };
    }).sort((a, b) => b.requestCount - a.requestCount); // Sort by request count
  };
  
  const timeData = processDataByTime();
  const endpointData = processDataByEndpoint();
  
  return (
    <Card className={cn("animate-fade-in glass-card subtle-shadow", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Response Time Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="endpoints" onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full grid grid-cols-2">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="endpoints">By Endpoint</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="formattedTime" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickMargin={10}
                  tickFormatter={(value) => value}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickMargin={8}
                  tickFormatter={(value) => `${value} ms`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--card-foreground))'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} ms`, 'Avg Response Time']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="avgResponseTime" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1}
                  fill="url(#colorResponseTime)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="endpoints" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={endpointData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="endpoint" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickMargin={8}
                  tickFormatter={(value) => `${value} ms`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--card-foreground))'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} ms`, 'Avg Response Time']}
                  labelFormatter={(label) => `Endpoint: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="averageResponseTime" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 5 }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResponseTimeChart;

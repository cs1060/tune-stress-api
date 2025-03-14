
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { RequestMetric } from '@/models/PerformanceMetrics';
import { cn } from '@/lib/utils';

interface ErrorDistributionChartProps {
  requestMetrics: RequestMetric[];
  className?: string;
}

const COLORS = [
  'hsl(142, 71%, 45%)',  // Success - Green
  'hsl(36, 100%, 65%)',   // 4xx - Amber
  'hsl(0, 84%, 60%)'     // 5xx - Red
];

const ErrorDistributionChart: React.FC<ErrorDistributionChartProps> = ({ requestMetrics, className }) => {
  // Process data for status code distribution
  const processStatusCodeData = () => {
    const statusGroups: Record<string, number> = {
      'Success (2xx)': 0,
      'Client Errors (4xx)': 0,
      'Server Errors (5xx)': 0
    };
    
    requestMetrics.forEach(metric => {
      const statusCode = metric.statusCode;
      
      if (statusCode >= 200 && statusCode < 300) {
        statusGroups['Success (2xx)'] += 1;
      } else if (statusCode >= 400 && statusCode < 500) {
        statusGroups['Client Errors (4xx)'] += 1;
      } else if (statusCode >= 500 && statusCode < 600) {
        statusGroups['Server Errors (5xx)'] += 1;
      }
    });
    
    return Object.entries(statusGroups).map(([name, value]) => ({ name, value }));
  };
  
  // Process data for specific error codes
  const processErrorCodesData = () => {
    const errorCodes: Record<number, number> = {};
    
    requestMetrics.forEach(metric => {
      if (metric.statusCode >= 400) {
        if (!errorCodes[metric.statusCode]) {
          errorCodes[metric.statusCode] = 0;
        }
        errorCodes[metric.statusCode] += 1;
      }
    });
    
    return Object.entries(errorCodes)
      .map(([code, count]) => ({ code: `${code}`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 error codes
  };
  
  const statusData = processStatusCodeData();
  const errorCodesData = processErrorCodesData();
  
  return (
    <Card className={cn("animate-fade-in glass-card subtle-shadow", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Status Code Distribution</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} (${((value / requestMetrics.length) * 100).toFixed(1)}%)`,
                  name
                ]}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {errorCodesData.length > 0 && (
          <div className="h-[240px]">
            <p className="text-sm text-muted-foreground mb-4">Top Error Codes</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorCodesData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  dataKey="code" 
                  type="category" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} requests`, 'Count']}
                  labelFormatter={(label) => `Status Code: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorDistributionChart;

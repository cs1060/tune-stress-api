
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { SystemMetric } from '@/models/PerformanceMetrics';
import { cn } from '@/lib/utils';

interface SystemResourceChartProps {
  systemMetrics: SystemMetric[];
  className?: string;
}

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

const SystemResourceChart: React.FC<SystemResourceChartProps> = ({ systemMetrics, className }) => {
  const processedData = systemMetrics.map(metric => ({
    ...metric,
    formattedTime: formatTimestamp(metric.timestamp)
  }));
  
  return (
    <Card className={cn("animate-fade-in glass-card subtle-shadow", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">System Resource Utilization</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={processedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="formattedTime" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickMargin={10}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickMargin={8}
              domain={[0, 'dataMax + 20']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--card-foreground))'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'CPU Usage' || name === 'Memory Usage') {
                  return [`${value.toFixed(1)}%`, name];
                }
                return [value, name];
              }}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="cpuUsage"
              name="CPU Usage"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="memoryUsage"
              name="Memory Usage"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="activeConnections"
              name="Active Connections"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SystemResourceChart;

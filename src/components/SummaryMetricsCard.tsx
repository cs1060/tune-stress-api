
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AggregatedMetrics } from '@/models/PerformanceMetrics';
import { cn } from '@/lib/utils';

interface SummaryMetricsCardProps {
  metrics: AggregatedMetrics;
  className?: string;
}

const MetricItem = ({ label, value, className }: { label: string; value: string | number; className?: string }) => (
  <div className="flex flex-col space-y-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className={cn("text-2xl font-semibold", className)}>{value}</p>
  </div>
);

const SummaryMetricsCard: React.FC<SummaryMetricsCardProps> = ({ metrics, className }) => {
  const { 
    totalRequests, 
    successCount, 
    errorRate, 
    avgResponseTime, 
    p99ResponseTime, 
    requestsPerSecond 
  } = metrics;
  
  const successRate = 100 - errorRate;
  
  return (
    <Card className={cn("animate-fade-in glass-card subtle-shadow", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Test Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <MetricItem 
            label="Total Requests" 
            value={totalRequests.toLocaleString()} 
          />
          <MetricItem 
            label="Success Rate" 
            value={`${successRate.toFixed(2)}%`} 
            className={successRate > 95 ? "text-green-500" : successRate > 80 ? "text-yellow-500" : "text-red-500"}
          />
          <MetricItem 
            label="Error Rate" 
            value={`${errorRate.toFixed(2)}%`}
            className={errorRate < 5 ? "text-green-500" : errorRate < 20 ? "text-yellow-500" : "text-red-500"}
          />
          <MetricItem 
            label="Avg Response Time" 
            value={`${avgResponseTime.toFixed(2)} ms`} 
          />
          <MetricItem 
            label="Throughput" 
            value={`${requestsPerSecond.toFixed(2)} req/s`} 
          />
          <MetricItem 
            label="Successful Requests" 
            value={successCount.toLocaleString()} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryMetricsCard;

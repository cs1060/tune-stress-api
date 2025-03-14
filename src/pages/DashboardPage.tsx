
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import SummaryMetricsCard from '@/components/SummaryMetricsCard';
import ResponseTimeChart from '@/components/ResponseTimeChart';
import ErrorDistributionChart from '@/components/ErrorDistributionChart';
import SystemResourceChart from '@/components/SystemResourceChart';
import ReportExport from '@/components/ReportExport';
import { TestResult, TestConfig } from '@/models/PerformanceMetrics';
import { generateMockTestResult, getTestHistoryMock } from '@/services/MockDataService';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestConfig[]>([]);
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setTestResult(generateMockTestResult());
      setTestHistory(getTestHistoryMock());
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleHistoryItemClick = (id: string) => {
    setLoading(true);
    
    // Simulate loading a specific test result
    setTimeout(() => {
      setTestResult(generateMockTestResult());
      setLoading(false);
    }, 800);
  };
  
  if (!testResult && loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-4 w-[450px]" />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!testResult) return null;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{testResult.config.name}</h1>
              <p className="text-muted-foreground">
                Test started at {formatDate(testResult.config.testStartTime)} | 
                Duration: {testResult.config.duration} seconds
              </p>
            </div>
            <ReportExport testResult={testResult} />
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Test History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <SummaryMetricsCard metrics={testResult.metrics} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponseTimeChart requestMetrics={testResult.rawRequestMetrics} />
              <ErrorDistributionChart requestMetrics={testResult.rawRequestMetrics} />
            </div>
            
            <SystemResourceChart systemMetrics={testResult.systemMetrics} />
          </TabsContent>
          
          <TabsContent value="history" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Previous Tests</CardTitle>
                <CardDescription>View and compare previous load test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testHistory.map((test) => (
                    <div 
                      key={test.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => handleHistoryItemClick(test.id)}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{test.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {test.concurrentUsers} users
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(test.testStartTime)} • {test.duration} seconds
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {test.url}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;

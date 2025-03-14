import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { TestConfig } from '@/interfaces/test';
import testService from '@/utils/testService';

interface TestFormProps {
  onTestStarted: () => void;
}

const TestForm = ({ onTestStarted }: TestFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<TestConfig>({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
    concurrentUsers: 10,
    duration: 10,
    headers: {},
    body: ''
  });
  const [headerKey, setHeaderKey] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [headersDisplay, setHeadersDisplay] = useState<Record<string, string>>({});
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, url: e.target.value });
  };
  
  const handleMethodChange = (value: string) => {
    setConfig({ ...config, method: value as TestConfig['method'] });
  };
  
  const handleConcurrentUsersChange = (value: number[]) => {
    setConfig({ ...config, concurrentUsers: value[0] });
  };
  
  const handleDurationChange = (value: number[]) => {
    setConfig({ ...config, duration: value[0] });
  };
  
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig({ ...config, body: e.target.value });
  };
  
  const addHeader = () => {
    if (headerKey.trim() === '') return;
    
    const updatedHeaders = { ...config.headers, [headerKey]: headerValue };
    setConfig({ ...config, headers: updatedHeaders });
    setHeadersDisplay({ ...headersDisplay, [headerKey]: headerValue });
    
    setHeaderKey('');
    setHeaderValue('');
  };
  
  const removeHeader = (key: string) => {
    const updatedHeaders = { ...config.headers };
    delete updatedHeaders[key];
    
    const updatedHeadersDisplay = { ...headersDisplay };
    delete updatedHeadersDisplay[key];
    
    setConfig({ ...config, headers: updatedHeaders });
    setHeadersDisplay(updatedHeadersDisplay);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate URL
      if (!config.url) {
        throw new Error('Please enter a valid URL');
      }
      
      toast({
        title: "Test Started",
        description: `Running test with ${config.concurrentUsers} concurrent users for ${config.duration} seconds`,
      });
      
      // For demo purposes we're using the simulate method
      await testService.simulateTest(config);
      onTestStarted();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="test" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Testing Your API</h2>
          <p className="text-gray-600 dark:text-gray-300">Configure your test parameters and get results in seconds</p>
        </div>
        
        <Alert className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50">
          <InfoIcon className="h-5 w-5 text-blue-500" />
          <AlertTitle className="text-blue-700 dark:text-blue-400 font-medium">How to use StressAPI</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-300 mt-2">
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Enter your API endpoint URL</strong> - The full address of the API you want to test.</li>
              <li><strong>Select HTTP method</strong> - Choose GET, POST, PUT, DELETE, or PATCH.</li>
              <li><strong>Set concurrent users</strong> - Adjust how many simultaneous users will make requests.</li>
              <li><strong>Set test duration</strong> - Choose how long the test should run (in seconds).</li>
              <li><strong>Add headers</strong> (optional) - Include any authorization or content-type headers.</li>
              <li><strong>Add request body</strong> (optional) - For POST/PUT requests, include a JSON payload.</li>
              <li><strong>Start the test</strong> - Click the button and watch real-time results appear below.</li>
            </ol>
          </AlertDescription>
        </Alert>
        
        <Card className="p-6 glass-morphism">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">API Endpoint URL</label>
                <Input
                  placeholder="https://api.example.com/endpoint"
                  value={config.url}
                  onChange={handleUrlChange}
                  className="w-full transition-all duration-200"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">HTTP Method</label>
                  <Select value={config.method} onValueChange={handleMethodChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select HTTP method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Concurrent Users: {config.concurrentUsers}</label>
                  <Slider
                    defaultValue={[config.concurrentUsers]}
                    max={100}
                    min={1}
                    step={1}
                    onValueChange={handleConcurrentUsersChange}
                    className="py-2"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Test Duration: {config.duration} seconds</label>
                <Slider
                  defaultValue={[config.duration]}
                  max={60}
                  min={5}
                  step={5}
                  onValueChange={handleDurationChange}
                  className="py-2"
                />
              </div>
              
              <Tabs defaultValue="headers" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="body">Request Body</TabsTrigger>
                </TabsList>
                
                <TabsContent value="headers" className="space-y-4 pt-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Header Name"
                      value={headerKey}
                      onChange={(e) => setHeaderKey(e.target.value)}
                      className="w-1/3"
                    />
                    <Input
                      placeholder="Header Value"
                      value={headerValue}
                      onChange={(e) => setHeaderValue(e.target.value)}
                      className="w-1/3"
                    />
                    <Button 
                      type="button" 
                      onClick={addHeader}
                      variant="outline"
                      className="whitespace-nowrap"
                    >
                      Add Header
                    </Button>
                  </div>
                  
                  {Object.keys(headersDisplay).length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-2 mt-4">
                      {Object.entries(headersDisplay).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{key}</span>: {value}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeHeader(key)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-4 w-4" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="body" className="space-y-2 pt-4">
                  <Textarea
                    placeholder="Enter request body (JSON)"
                    value={config.body}
                    onChange={handleBodyChange}
                    className="font-mono min-h-[150px]"
                  />
                  <p className="text-xs text-gray-500">
                    Request body will be ignored for GET requests.
                  </p>
                </TabsContent>
              </Tabs>
              
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Running Test...</span>
                  </div>
                ) : (
                  <span>Start Load Test</span>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default TestForm;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { runTest } from '@/services/testService';

interface TestConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestConfigModal: React.FC<TestConfigModalProps> = ({ isOpen, onClose }) => {
  const [targetUrl, setTargetUrl] = useState('https://api.example.com');
  const [workers, setWorkers] = useState(50);
  const [duration, setDuration] = useState(30);
  const [pattern, setPattern] = useState('interleaved');
  const [rateLimit, setRateLimit] = useState(100);
  const [endpoints, setEndpoints] = useState([
    { path: '/users', method: 'GET', headers: {}, payload: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleAddEndpoint = () => {
    setEndpoints([...endpoints, { path: '', method: 'GET', headers: {}, payload: '' }]);
  };

  const handleEndpointChange = (index: number, field: string, value: any) => {
    const newEndpoints = [...endpoints];
    newEndpoints[index] = { ...newEndpoints[index], [field]: value };
    setEndpoints(newEndpoints);
  };

  const handleRemoveEndpoint = (index: number) => {
    setEndpoints(endpoints.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Convert duration to seconds format for API
      const durationFormat = `${duration}s`;
      
      const result = await runTest({
        baseUrl: targetUrl,
        workers,
        duration: durationFormat,
        pattern,
        rateLimit,
        endpoints
      });
      
      toast.success('Test started successfully!', {
        description: `Testing ${targetUrl} with ${workers} workers for ${duration} seconds`,
      });
      onClose();
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Failed to start test', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Load Test</DialogTitle>
          <DialogDescription>
            Set up your FastAPI load test parameters.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target API URL</Label>
              <Input
                id="targetUrl"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://api.example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workers">Concurrent Workers</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="workers"
                  value={[workers]}
                  onValueChange={(value) => setWorkers(value[0])}
                  min={1}
                  max={500}
                  step={1}
                  className="flex-1"
                />
                <span className="w-12 text-right">{workers}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="duration"
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  min={5}
                  max={300}
                  step={5}
                  className="flex-1"
                />
                <span className="w-12 text-right">{duration}s</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pattern">Traffic Pattern</Label>
              <Select value={pattern} onValueChange={setPattern}>
                <SelectTrigger id="pattern">
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential</SelectItem>
                  <SelectItem value="interleaved">Interleaved</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="rateLimit">Request Rate Limit (req/sec)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="rateLimit"
                  value={[rateLimit]}
                  onValueChange={(value) => setRateLimit(value[0])}
                  min={10}
                  max={1000}
                  step={10}
                  className="flex-1"
                />
                <span className="w-16 text-right">{rateLimit}/sec</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Endpoints to Test</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddEndpoint}
                  type="button"
                >
                  Add Endpoint
                </Button>
              </div>

              {endpoints.map((endpoint, index) => (
                <div key={index} className="space-y-3 p-3 border rounded-md">
                  <div className="flex justify-between">
                    <Label>Endpoint #{index + 1}</Label>
                    {endpoints.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveEndpoint(index)}
                        className="h-6 p-0 text-destructive hover:text-destructive/80"
                        type="button"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <Label htmlFor={`path-${index}`} className="text-xs">Path</Label>
                      <Input
                        id={`path-${index}`}
                        value={endpoint.path}
                        onChange={(e) => handleEndpointChange(index, 'path', e.target.value)}
                        placeholder="/users"
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`method-${index}`} className="text-xs">Method</Label>
                      <Select 
                        value={endpoint.method}
                        onValueChange={(value) => handleEndpointChange(index, 'method', value)}
                      >
                        <SelectTrigger id={`method-${index}`} className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {endpoint.method !== 'GET' && (
                    <div>
                      <Label htmlFor={`payload-${index}`} className="text-xs">Payload (JSON)</Label>
                      <Input
                        id={`payload-${index}`}
                        value={endpoint.payload}
                        onChange={(e) => handleEndpointChange(index, 'payload', e.target.value)}
                        placeholder='{"name": "example", "value": 123}'
                        className="h-8"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Starting Test...' : 'Start Test'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestConfigModal;

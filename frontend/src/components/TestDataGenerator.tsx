import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import ReactJson from '@microlink/react-json-view';
import { EndpointInfo, GeneratedTestData } from '../types';
import axios from 'axios';

interface TestDataGeneratorProps {
  endpoint: EndpointInfo;
}

export const TestDataGenerator: React.FC<TestDataGeneratorProps> = ({ endpoint }) => {
  const [generatedData, setGeneratedData] = useState<GeneratedTestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTestData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/generate-test-data', {
        endpoint_path: endpoint.path,
        method: endpoint.method,
      });

      setGeneratedData(response.data);
    } catch (err) {
      setError('Failed to generate test data. Please try again.');
      console.error('Error generating test data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Test Data Generator
        </Typography>
        
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            Endpoint: {endpoint.method} {endpoint.path}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={generateTestData}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Test Data'}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {generatedData && (
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              Generated Test Data:
            </Typography>
            <ReactJson
              src={generatedData}
              theme="monokai"
              enableClipboard={false}
              displayDataTypes={false}
              name={false}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

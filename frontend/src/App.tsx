import React, { useState } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import axios from 'axios';
import { EndpointList } from './components/EndpointList';
import { TestDataGenerator } from './components/TestDataGenerator';
import { EndpointInfo } from './types';

function App() {
  const [apiUrl, setApiUrl] = useState('');
  const [endpoints, setEndpoints] = useState<EndpointInfo[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discoverEndpoints = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/discover-endpoints', {
        api_url: apiUrl,
      });
      setEndpoints(response.data.endpoints);
    } catch (err) {
      setError('Failed to discover endpoints. Please check the URL and try again.');
      console.error('Error discovering endpoints:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        FastAPI Test Data Generator
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9}>
            <TextField
              fullWidth
              label="FastAPI URL"
              variant="outlined"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000"
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={discoverEndpoints}
              disabled={loading || !apiUrl}
            >
              Discover Endpoints
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>

      {endpoints.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Available Endpoints
              </Typography>
              <EndpointList
                endpoints={endpoints}
                onEndpointSelect={setSelectedEndpoint}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            {selectedEndpoint ? (
              <TestDataGenerator endpoint={selectedEndpoint} />
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Select an endpoint to generate test data
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default App;

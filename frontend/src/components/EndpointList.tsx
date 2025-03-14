import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { EndpointInfo } from '../types';

interface EndpointListProps {
  endpoints: EndpointInfo[];
  onEndpointSelect: (endpoint: EndpointInfo) => void;
}

const methodColors: Record<string, 'success' | 'primary' | 'warning' | 'error' | 'info' | 'default' | 'secondary'> = {
  GET: 'success',
  POST: 'primary',
  PUT: 'warning',
  DELETE: 'error',
  PATCH: 'info',
};

export const EndpointList: React.FC<EndpointListProps> = ({
  endpoints,
  onEndpointSelect,
}) => {
  return (
    <List>
      {endpoints.map((endpoint, index) => (
        <ListItem key={`${endpoint.method}-${endpoint.path}-${index}`} disablePadding>
          <ListItemButton onClick={() => onEndpointSelect(endpoint)}>
            <Box display="flex" alignItems="center" width="100%">
              <Chip
                label={endpoint.method}
                color={methodColors[endpoint.method] || 'default'}
                size="small"
                sx={{ mr: 2, minWidth: 70 }}
              />
              <ListItemText
                primary={endpoint.path}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Parameters: {endpoint.parameters.length}
                    {endpoint.request_body && ' | Has Request Body'}
                  </Typography>
                }
              />
            </Box>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

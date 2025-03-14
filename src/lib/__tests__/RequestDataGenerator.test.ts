import { describe, it, expect, beforeAll } from 'vitest';
import { RequestDataGenerator } from '../RequestDataGenerator';

describe('RequestDataGenerator', () => {
  let generator: RequestDataGenerator;

  beforeAll(async () => {
    generator = new RequestDataGenerator();
    await generator.initialize('http://api.example.com/openapi.json');
  });

  it('should generate valid request data for endpoints', () => {
    const requests = generator.generateAllRequests();
    expect(requests.length).toBeGreaterThan(0);
    
    for (const request of requests) {
      expect(request).toHaveProperty('path');
      expect(request).toHaveProperty('method');
      expect(request).toHaveProperty('parameters');
    }
  });

  it('should maintain consistency for cached requests', () => {
    const firstRequest = generator.generateAllRequests()[0];
    const secondRequest = generator.generateAllRequests()[0];
    
    expect(firstRequest).toEqual(secondRequest);
  });
});
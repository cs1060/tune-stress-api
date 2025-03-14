import { OpenAPIV3 } from 'openapi-types';
import { BaseDataGenerator, DataGeneratorOptions } from './DataGenerator';
import { DataGeneratorFactory } from '../DataGeneratorFactory';

export class ObjectGenerator extends BaseDataGenerator {
  generate(): Record<string, any> {
    const result: Record<string, any> = {};
    const properties = this.schema.properties || {};
    const required = this.schema.required || [];

    for (const [key, propSchema] of Object.entries(properties)) {
      if (typeof propSchema === 'boolean') continue;

      const generator = DataGeneratorFactory.createGenerator({
        schema: propSchema as OpenAPIV3.SchemaObject,
        required: required.includes(key),
        context: this.context
      });

      result[key] = generator.generate();
    }

    return result;
  }
}
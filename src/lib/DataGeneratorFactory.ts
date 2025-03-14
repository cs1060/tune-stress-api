import { OpenAPIV3 } from 'openapi-types';
import { DataGenerator, DataGeneratorOptions } from './generators/DataGenerator';
import { StringGenerator } from './generators/StringGenerator';
import { NumberGenerator } from './generators/NumberGenerator';
import { ArrayGenerator } from './generators/ArrayGenerator';
import { ObjectGenerator } from './generators/ObjectGenerator';

export class DataGeneratorFactory {
  static createGenerator(options: DataGeneratorOptions): DataGenerator {
    const { schema } = options;

    switch (schema.type) {
      case 'string':
        return new StringGenerator(options);
      case 'number':
      case 'integer':
        return new NumberGenerator(options);
      case 'array':
        return new ArrayGenerator(options);
      case 'object':
        return new ObjectGenerator(options);
      default:
        throw new Error(`Unsupported schema type: ${schema.type}`);
    }
  }
}
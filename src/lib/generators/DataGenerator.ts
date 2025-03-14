import { OpenAPIV3 } from 'openapi-types';

export interface DataGenerator {
  generate(): any;
}

export interface DataGeneratorOptions {
  schema: OpenAPIV3.SchemaObject;
  required?: boolean;
  context?: Record<string, any>;
}

export abstract class BaseDataGenerator implements DataGenerator {
  protected schema: OpenAPIV3.SchemaObject;
  protected required: boolean;
  protected context: Record<string, any>;

  constructor(options: DataGeneratorOptions) {
    this.schema = options.schema;
    this.required = options.required ?? false;
    this.context = options.context ?? {};
  }

  abstract generate(): any;
}

export { BaseDataGenerator }
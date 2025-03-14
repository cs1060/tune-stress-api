import { BaseDataGenerator, DataGeneratorOptions } from './DataGenerator';
import { DataGeneratorFactory } from '../DataGeneratorFactory';

export class ArrayGenerator extends BaseDataGenerator {
  generate(): any[] {
    const minItems = this.schema.minItems || 1;
    const maxItems = this.schema.maxItems || 5;
    const itemCount = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;
    
    const items = [];
    const itemSchema = this.schema.items;
    
    if (!itemSchema || typeof itemSchema === 'boolean') {
      throw new Error('Invalid array items schema');
    }
    
    for (let i = 0; i < itemCount; i++) {
      const generator = DataGeneratorFactory.createGenerator({
        schema: itemSchema,
        context: this.context
      });
      items.push(generator.generate());
    }
    
    return items;
  }
}
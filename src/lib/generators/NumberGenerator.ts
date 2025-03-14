import { faker } from '@faker-js/faker';
import { BaseDataGenerator, DataGeneratorOptions } from './DataGenerator';

export class NumberGenerator extends BaseDataGenerator {
  generate(): number {
    const { minimum, maximum, exclusiveMinimum, exclusiveMaximum } = this.schema;
    
    let min = minimum !== undefined ? Number(minimum) : -1000;
    let max = maximum !== undefined ? Number(maximum) : 1000;
    
    if (exclusiveMinimum) min += 1;
    if (exclusiveMaximum) max -= 1;
    
    if (this.schema.type === 'integer') {
      return faker.number.int({ min, max });
    }
    
    return faker.number.float({ min, max, precision: 0.01 });
  }
}
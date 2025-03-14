import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { BaseDataGenerator, DataGeneratorOptions } from './DataGenerator';

export class StringGenerator extends BaseDataGenerator {
  constructor(options: DataGeneratorOptions) {
    super(options);
  }

  generate(): string {
    const format = this.schema.format;
    const pattern = this.schema.pattern;

    if (pattern) {
      return faker.string.alphanumeric(10); // Using the correct faker method
    }

    switch (format) {
      case 'email':
        return faker.internet.email();
      case 'date':
        return faker.date.recent().toISOString().split('T')[0];
      case 'date-time':
        return faker.date.recent().toISOString();
      case 'uuid':
        return uuidv4();
      case 'uri':
        return faker.internet.url();
      case 'hostname':
        return faker.internet.domainName();
      case 'ipv4':
        return faker.internet.ip();
      case 'ipv6':
        return faker.internet.ipv6();
      default:
        if (this.schema.enum) {
          return faker.helpers.arrayElement(this.schema.enum as string[]);
        }
        return faker.lorem.sentence();
    }
  }
}
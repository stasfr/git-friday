import type { IErrorMetadata } from '@/errors/errorsTypes.js';

export class ExtendedError extends Error {
  metadata: IErrorMetadata;

  constructor(metadata: IErrorMetadata) {
    super(metadata.message);
    this.metadata = metadata;
  }

  logToConsole() {
    console.log(`${this.metadata.layer}`);
    if (this.metadata.command) {
      console.log('Command:', this.metadata.command);
    }
    if (this.metadata.service) {
      console.log('In Service:', this.metadata.service);
    }
    console.log(`\n${this.metadata.message}\n`);
    if (this.metadata.hint) {
      console.log('Hint:');
      console.log(this.metadata.hint);
    }
  }
}

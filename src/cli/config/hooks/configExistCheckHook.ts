import { ExtendedError } from '@/errors/ExtendedError.js';
import { ConfigService } from '../configService.js';

export async function configExistCheckHook() {
  const configService = new ConfigService();
  const result = await configService.checkIfConfigExists();

  if (result instanceof ExtendedError) {
    throw result;
  }
}

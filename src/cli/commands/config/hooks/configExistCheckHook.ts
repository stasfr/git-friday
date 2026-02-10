import { ConfigService } from '../configService.js';

export async function configExistCheckHook() {
  const configService = new ConfigService();
  await configService.checkIfConfigExists();
}

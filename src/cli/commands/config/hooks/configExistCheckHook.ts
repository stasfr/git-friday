import { ConfigService } from '../config.service.js';

export async function configExistCheckHook() {
  const configService = new ConfigService();
  await configService.checkIfConfigExists();
}

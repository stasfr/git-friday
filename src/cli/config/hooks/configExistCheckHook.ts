import { ConfigService } from '../configService.js';

export async function configExistCheckHook() {
  const configService = new ConfigService();
  const result = await configService.checkIfConfigExists();
  if (!result) {
    console.error('Config file does not exist.');
    process.exit(1);
  }
}

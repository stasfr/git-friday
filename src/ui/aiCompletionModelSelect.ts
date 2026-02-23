import { input, confirm, select } from '@inquirer/prompts';
import { ProfileRegistryService } from '@/cli/profile/ProfileRegistryService.js';

export async function aiCompletionModelSelect() {
  const profileRegistryService = new ProfileRegistryService();
  const otherProfilesModels =
    await profileRegistryService.listAllProfilesAiCompletionModels();

  if (otherProfilesModels && otherProfilesModels.length > 0) {
    const selectAiCompletionModel = await confirm({
      message: 'Would you like to choose model from other profiles?',
      default: true,
    });

    if (selectAiCompletionModel === true) {
      return await select({
        message: 'Which preset AI completion model would you like to use?',
        choices: otherProfilesModels.map((model) => ({
          name: model,
          value: model,
        })),
      });
    }
  }

  return await input({
    message: 'Enter AI completion model',
    validate: (input) => {
      if (!input) {
        return 'Please enter a model';
      }
      return true;
    },
  });
}

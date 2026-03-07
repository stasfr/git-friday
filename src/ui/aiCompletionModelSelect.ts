import { text, confirm, select, isCancel } from '@clack/prompts';
import { ProfileRegistryService } from '@/cli/profile/ProfileRegistryService.js';

export async function aiCompletionModelSelect() {
  const profileRegistryService = new ProfileRegistryService();
  const otherProfilesModels =
    await profileRegistryService.listAllProfilesAiCompletionModels();

  if (otherProfilesModels && otherProfilesModels.length > 0) {
    const selectAiCompletionModel = await confirm({
      message: 'Would you like to choose model from other profiles?',
      initialValue: true,
    });

    if (isCancel(selectAiCompletionModel)) {
      console.log('Operation cancelled');
      process.exit(0);
    }

    if (selectAiCompletionModel === true) {
      const selectedModel = await select({
        message: 'Which preset AI completion model would you like to use?',
        options: otherProfilesModels.map((model) => ({
          label: model,
          value: model,
        })),
      });

      if (isCancel(selectedModel)) {
        console.log('Operation cancelled');
        process.exit(0);
      }

      return selectedModel;
    }
  }

  const modelName = await text({
    message: 'Enter AI completion model',
    validate: (input) => {
      if (!input) {
        return 'Please enter a model';
      }
      return undefined;
    },
  });

  if (isCancel(modelName)) {
    console.log('Operation cancelled');
    process.exit(0);
  }

  return modelName;
}

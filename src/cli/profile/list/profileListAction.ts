import { CommandExecutionError } from '@/errors/Errors.js';
import { ProfileRegistryService } from '@/cli/profile/ProfileRegistryService.js';

export async function profileListAction() {
  const profileRegistryService = new ProfileRegistryService();
  const profiles = await profileRegistryService.listAllProfiles();

  if (profiles.length === 0) {
    throw new CommandExecutionError({
      message: 'No profiles found',
      hint: 'Create a profile first using "friday profile create" command',
    });
  }

  console.log('Profiles:');
  profiles.forEach((profile) => {
    console.log(` - ${profile}`);
  });
}

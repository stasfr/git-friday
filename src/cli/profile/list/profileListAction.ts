import { ExtendedError } from '@/errors/ExtendedError.js';
import { ProfileService } from '@/cli/profile/profileService.js';

export async function profileListAction() {
  const profiles = await ProfileService.listAllProfiles();

  if (profiles.length === 0) {
    throw new ExtendedError({
      layer: 'CommandExecutionError',
      message: 'No profiles found',
      command: 'profile list',
      service: null,
      hint: 'Create a profile first using "friday profile create" command',
    });
  }

  console.log('Profiles:');
  profiles.forEach((profile) => {
    console.log(` - ${profile}`);
  });
}

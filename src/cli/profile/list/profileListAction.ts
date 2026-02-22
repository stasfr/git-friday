import { ProfileService } from '@/cli/profile/profileService.js';

export async function profileListAction() {
  const profiles = await ProfileService.listAllProfiles();

  console.log('Profiles:');
  profiles.forEach((profile) => {
    console.log(` - ${profile}`);
  });
}

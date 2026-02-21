export interface IEmptyProfileConfig {
  name: string;
  git_log_command: null;
}

export interface IProfileConfigFile {
  name: string;
  git_log_command: string | null;
}

export interface IProfileConfig {
  name: string;
  gitLogCommand: string | null;
}

export interface IProfilePrompts {
  systemPrompt: string;
  userPrompt: string;
}

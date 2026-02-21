export interface IProfileConfigFile {
  name: string;
  git_log_command: string;
}

export interface IProfileConfig {
  name: string;
  gitLogCommand: string;
}

export interface IProfilePrompts {
  systemPrompt: string;
  userPrompt: string;
}

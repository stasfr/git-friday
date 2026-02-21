export interface IEmptyProfileConfig {
  name: string;
  git_log_command: null;
  ai_completion_model: null;
}

export interface IProfileConfigFile {
  name: string;
  git_log_command: string | null;
  ai_completion_model: string;
}

export interface IProfileConfig {
  name: string;
  gitLogCommand: string | null;
  aiCompletionModel: string;
}

export interface IProfilePrompts {
  systemPrompt: string;
  userPrompt: string;
}

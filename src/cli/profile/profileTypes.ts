export interface IEmptyProfileConfig {
  name: string;
  gitLogCommand: null;
  aiCompletionModel: null;
}

export interface IRawProfileConfig {
  name: string;
  gitLogCommand: string | null;
  aiCompletionModel: string | null;
}

export interface IValidProfileConfig {
  name: string;
  gitLogCommand: string | null;
  aiCompletionModel: string;
}

export interface IProfilePrompts {
  systemPrompt: string;
  userPrompt: string;
}

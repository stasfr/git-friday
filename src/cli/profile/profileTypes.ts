import * as v from 'valibot';

export const rawProfileConfigSchema = v.object({
  name: v.string(),
  gitLogCommand: v.nullable(v.string()),
  gitDiffCommand: v.nullable(v.string()),
  aiCompletionModel: v.nullable(v.string()),
});

export const validProfileConfigSchema = v.object({
  name: v.string(),
  gitLogCommand: v.nullable(v.string()),
  gitDiffCommand: v.nullable(v.string()),
  aiCompletionModel: v.string(),
});

export interface IEmptyProfileConfig {
  name: string;
  gitLogCommand: null;
  gitDiffCommand: null;
  aiCompletionModel: null;
}

export type IRawProfileConfig = v.InferOutput<typeof rawProfileConfigSchema>;

export type IRawProfileConfigKeys = keyof IRawProfileConfig;
export type IEditableProfileConfigKeys = Exclude<IRawProfileConfigKeys, 'name'>;

export type IValidProfileConfig = v.InferOutput<
  typeof validProfileConfigSchema
>;

export interface IProfilePrompts {
  systemPrompt: string;
  userPrompt: string;
}

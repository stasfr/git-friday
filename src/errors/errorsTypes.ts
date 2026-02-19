export type IErrorLayerTypes = 'ConfigurationError' | 'CommandExecutionError';

export interface IErrorMetadata {
  layer: IErrorLayerTypes;
  message: string;
  command: string | null;
  service: string | null;
  hint: string | null;
}

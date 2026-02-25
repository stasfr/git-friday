export type IErrorLayerTypes =
  | 'ConfigurationError'
  | 'CommandExecutionError'
  | 'InternalError';

export interface IErrorMetadata {
  layer: IErrorLayerTypes;
  message: string;
  command: string | null;
  service: string | null;
  hint: string | null;
}

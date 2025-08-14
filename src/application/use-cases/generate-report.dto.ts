export interface ReportDto {
  body: string | null;
  error: string | null;
  statistic: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  saved: boolean;
}

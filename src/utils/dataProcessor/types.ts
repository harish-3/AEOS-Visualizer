export interface ProcessedData {
  data: Array<{ name: string; value: number }>;
  insights: string[];
  suggestedCharts: string[];
  suggestedTheme: string;
  predictions: string[];
  trends: string[];
}
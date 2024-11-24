export type DataType = 'percentage' | 'temporal' | 'numerical' | 'categorical';

export interface ChartTheme {
  name: string;
  colors: string[];
  background: string;
  textColor: string;
  gridColor: string;
  animation: {
    type: 'bounce' | 'fade' | 'scale' | 'rotate' | 'slide';
    duration: number;
  };
}

export interface EnhancedPrompt {
  enhancedText: string;
  suggestedCharts: string[];
  dataType: DataType;
}
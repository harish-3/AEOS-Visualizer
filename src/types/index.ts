export type DataType = 'percentage' | 'temporal' | 'numerical' | 'categorical';

export type AnimationType = 
  | 'fade'
  | 'scale'
  | 'slide'
  | 'reveal'
  | 'wave'
  | 'bounce'
  | 'spiral'
  | 'stagger'
  | 'float'
  | 'pulse';

export interface ChartTheme {
  name: string;
  colors: string[];
  background: string;
  textColor: string;
  gridColor: string;
}

export interface EnhancedPrompt {
  enhancedText: string;
  suggestedCharts: string[];
  dataType: DataType;
}

export interface VisualizationSuggestion {
  suggestedCharts: string[];
  suggestedTheme: string;
}

export interface AnimationConfig {
  type: AnimationType;
  duration: number;
  delay?: number;
  easing?: string;
}
import { VisualizationSuggestion } from './types';

export function suggestVisualizations(
  data: Array<{ name: string; value: number }>
): VisualizationSuggestion {
  const suggestedCharts: string[] = [];

  if (data.length <= 5) {
    suggestedCharts.push('pie');
  }
  if (data.length > 3) {
    suggestedCharts.push('bar');
  }
  if (data.length > 5) {
    suggestedCharts.push('treemap');
  }

  if (suggestedCharts.length === 0) {
    suggestedCharts.push('pie');
  }

  return {
    suggestedCharts,
    suggestedTheme: 'default'
  };
}
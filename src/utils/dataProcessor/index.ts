import { ProcessedData } from './types';
import { parseInput } from './parser';
import { analyzeData } from './analyzer';
import { suggestVisualizations } from './visualizer';

export function processData(input: string): ProcessedData {
  const data = parseInput(input);
  const { insights, predictions, trends } = analyzeData(data, input);
  const { suggestedCharts, suggestedTheme } = suggestVisualizations(data);

  return {
    data,
    insights,
    predictions,
    trends,
    suggestedCharts,
    suggestedTheme
  };
}

export * from './types';
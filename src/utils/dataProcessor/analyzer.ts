import { ProcessedData } from './types';

export function analyzeData(
  data: Array<{ name: string; value: number }>,
  input: string
): Omit<ProcessedData, 'data' | 'suggestedCharts' | 'suggestedTheme'> {
  const insights: string[] = [];
  const predictions: string[] = [];
  const trends: string[] = [];
  
  const sorted = [...data].sort((a, b) => b.value - a.value);
  
  // Basic insights
  insights.push(`${sorted[0].name} leads with ${sorted[0].value}%`);
  insights.push(`${sorted[sorted.length - 1].name} has the lowest share at ${sorted[sorted.length - 1].value}%`);

  // Distribution analysis
  const average = data.reduce((sum, item) => sum + item.value, 0) / data.length;
  const variance = data.reduce((sum, item) => sum + Math.pow(item.value - average, 2), 0) / data.length;
  const standardDev = Math.sqrt(variance);

  if (standardDev < 5) {
    insights.push('The distribution is relatively even across categories');
  } else if (standardDev > 15) {
    insights.push('There are significant disparities between categories');
  }

  // Market analysis
  const top2Share = sorted.slice(0, 2).reduce((sum, item) => sum + item.value, 0);
  if (top2Share > 60) {
    insights.push(`High market concentration: top 2 categories control ${top2Share}%`);
    predictions.push('Market consolidation trend likely to continue');
  } else if (top2Share < 40) {
    insights.push('Market is fairly fragmented');
    predictions.push('Expect increased competition in the market');
  }

  // Growth trends
  const emergingSegments = data.filter(item => 
    item.value > average * 0.7 && item.value < average * 1.3
  );
  
  if (emergingSegments.length > 0) {
    trends.push(`${emergingSegments[0].name} shows growth potential`);
  }

  return { insights, predictions, trends };
}
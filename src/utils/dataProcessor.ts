import Color from 'color';
import { DataType } from '../types';

export interface ProcessedData {
  data: Array<{ name: string; value: number }>;
  insights: string[];
  suggestedCharts: string[];
  suggestedTheme: string;
  predictions: string[];
  trends: string[];
}

export function processData(input: string): ProcessedData {
  if (!input || typeof input !== 'string') {
    throw new Error('Please provide valid input data');
  }

  // Extract numbers and labels using more specific patterns
  const patterns = [
    /(\d+(?:\.\d+)?)%\s*(?:for|of|were|was|are|is)?\s*([^,.]+?)(?=\s*(?:,|\s+and|\s*$))/g,
    /([^,.]+?)\s*(?:at|with|has)\s*(\d+(?:\.\d+)?)%/g
  ];

  let matches: Array<[string, string, string]> = [];
  
  // Try each pattern until we find matches
  for (const pattern of patterns) {
    const patternMatches = Array.from(input.matchAll(pattern));
    if (patternMatches.length > 0) {
      matches = patternMatches.map(match => [match[0], match[1], match[2]]);
      break;
    }
  }

  if (matches.length === 0) {
    throw new Error('No valid percentage data found. Please provide data in format like "30% for Category A" or "Category B at 40%"');
  }

  // Parse data with improved label handling
  const data = matches.map(match => ({
    name: cleanLabel(match[2]),
    value: parseFloat(match[1])
  }));

  // Validate data
  data.forEach(item => {
    if (isNaN(item.value) || item.value < 0 || item.value > 100) {
      throw new Error(`Invalid percentage value for ${item.name}. Values must be between 0 and 100`);
    }
  });

  // Calculate total and handle remaining percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total < 100) {
    const remaining = 100 - total;
    const restPattern = /(?:the\s+)?(?:rest|remaining|others?)\s+(?:for|of|were|was|are|is)?\s*([^,.]+)/i;
    const restMatch = input.match(restPattern);
    const restLabel = restMatch ? cleanLabel(restMatch[1]) : 'Others';
    
    data.push({
      name: `${restLabel}`,
      value: remaining
    });
  } else if (total > 100) {
    throw new Error('Total percentage exceeds 100%. Please check your input values');
  }

  // Generate insights and predictions
  const { insights, predictions, trends } = generateAnalysis(data, input);

  // Determine best visualizations
  const { suggestedCharts, suggestedTheme } = suggestVisualizations(input, data);

  return {
    data,
    insights,
    predictions,
    trends,
    suggestedCharts,
    suggestedTheme
  };
}

function cleanLabel(label: string): string {
  return label
    .trim()
    .replace(/^(for|of|were|was|are|is)\s+/i, '')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function generateAnalysis(
  data: Array<{ name: string; value: number }>, 
  input: string
): { 
  insights: string[],
  predictions: string[],
  trends: string[] 
} {
  const insights: string[] = [];
  const predictions: string[] = [];
  const trends: string[] = [];
  
  // Sort data by value
  const sorted = [...data].sort((a, b) => b.value - a.value);
  
  // Basic insights
  insights.push(`${sorted[0].name} leads with ${sorted[0].value}%`);
  insights.push(`${sorted[sorted.length - 1].name} has the lowest share at ${sorted[sorted.length - 1].value}%`);

  // Calculate distribution metrics
  const average = data.reduce((sum, item) => sum + item.value, 0) / data.length;
  const variance = data.reduce((sum, item) => sum + Math.pow(item.value - average, 2), 0) / data.length;
  const standardDev = Math.sqrt(variance);

  // Distribution insights
  if (standardDev < 5) {
    insights.push('The distribution is relatively even across categories');
  } else if (standardDev > 15) {
    insights.push('There are significant disparities between categories');
  }

  // Market concentration
  const top2Share = sorted.slice(0, 2).reduce((sum, item) => sum + item.value, 0);
  if (top2Share > 60) {
    insights.push(`High concentration: top 2 categories control ${top2Share}% of the total`);
    predictions.push('Consolidation likely to continue');
  } else if (top2Share < 40) {
    insights.push('Distribution is fairly fragmented');
    predictions.push('Expect increased competition');
  }

  // Growth potential
  const emergingSegments = data.filter(item => item.value > average * 0.7 && item.value < average * 1.3);
  if (emergingSegments.length > 0) {
    trends.push(`${emergingSegments[0].name} shows potential for growth`);
  }

  return { insights, predictions, trends };
}

function suggestVisualizations(input: string, data: Array<{ name: string; value: number }>): {
  suggestedCharts: string[];
  suggestedTheme: string;
} {
  const suggestedCharts: string[] = [];
  let suggestedTheme = 'default';

  // Analyze data characteristics
  if (data.length <= 5) {
    suggestedCharts.push('pie');
  }
  if (data.length > 3) {
    suggestedCharts.push('bar');
  }
  if (data.length > 5) {
    suggestedCharts.push('treemap');
  }

  // Ensure we have at least one chart type
  if (suggestedCharts.length === 0) {
    suggestedCharts.push('pie');
  }

  return {
    suggestedCharts,
    suggestedTheme
  };
}
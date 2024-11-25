import { DataType } from '../types';

interface ProcessedData {
  type: DataType;
  entities: Array<{ name: string; value: number }>;
  relationships: string[];
  suggestedVisualization: string;
}

export function processText(text: string): ProcessedData {
  // Extract percentages and numbers
  const percentageRegex = /(\d+(?:\.\d+)?)%\s*(?:of\s+)?([^,.]+)/g;
  const matches = Array.from(text.matchAll(percentageRegex));
  
  // Extract entities and their values
  const entities = matches.map(match => ({
    name: cleanLabel(match[2]),
    value: parseFloat(match[1])
  }));
  
  // Determine relationships between entities
  const relationships = findRelationships(text);
  
  // Determine best visualization type
  const suggestedVisualization = suggestVisualization(text, entities, relationships);
  
  return {
    type: determineDataType(text),
    entities,
    relationships,
    suggestedVisualization
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

function findRelationships(text: string): string[] {
  const relationships: string[] = [];
  
  // Find comparison words
  if (/(more than|less than|compared to|versus|vs)/i.test(text)) {
    relationships.push('comparison');
  }
  
  // Find temporal relationships
  if (/(over time|yearly|monthly|weekly|daily)/i.test(text)) {
    relationships.push('temporal');
  }
  
  // Find hierarchical relationships
  if (/(within|inside|containing|comprises)/i.test(text)) {
    relationships.push('hierarchical');
  }
  
  return relationships;
}

function determineDataType(text: string): DataType {
  if (text.includes('%')) return 'percentage';
  if (text.match(/\d{4}/)) return 'temporal';
  if (text.match(/\d+(\.\d+)?/)) return 'numerical';
  return 'categorical';
}

function suggestVisualization(
  text: string, 
  entities: Array<{ name: string; value: number }>, 
  relationships: string[]
): string {
  if (relationships.includes('temporal')) {
    return 'line';
  }
  
  if (relationships.includes('hierarchical')) {
    return 'treemap';
  }
  
  if (relationships.includes('comparison')) {
    return entities.length > 4 ? 'bar' : 'pie';
  }
  
  // Default cases
  if (entities.length <= 5) return 'pie';
  if (entities.length <= 10) return 'bar';
  return 'treemap';
}
const PATTERNS = [
  /(\d+(?:\.\d+)?)%\s*(?:for|of|were|was|are|is)?\s*([^,.]+?)(?=\s*(?:,|\s+and|\s*$))/g,
  /([^,.]+?)\s*(?:at|with|has|own)\s*(\d+(?:\.\d+)?)%/g
];

export function parseInput(input: string): Array<{ name: string; value: number }> {
  if (!input || typeof input !== 'string') {
    throw new Error('Please provide valid input data');
  }

  let matches: Array<[string, string, string]> = [];
  
  for (const pattern of PATTERNS) {
    const patternMatches = Array.from(input.matchAll(pattern));
    if (patternMatches.length > 0) {
      matches = patternMatches.map(match => [match[0], match[1], match[2]]);
      break;
    }
  }

  if (matches.length === 0) {
    throw new Error('No valid percentage data found. Please provide data in format like "30% for Category A" or "Category B has 40%"');
  }

  const data = matches.map(match => ({
    name: cleanLabel(match[2]),
    value: parseFloat(match[1])
  }));

  validateData(data);
  return handleRemainingPercentage(data);
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

function validateData(data: Array<{ name: string; value: number }>): void {
  data.forEach(item => {
    if (isNaN(item.value) || item.value < 0 || item.value > 100) {
      throw new Error(`Invalid percentage value for ${item.name}. Values must be between 0 and 100`);
    }
  });

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total > 100) {
    throw new Error('Total percentage exceeds 100%. Please check your input values');
  }
}

function handleRemainingPercentage(
  data: Array<{ name: string; value: number }>
): Array<{ name: string; value: number }> {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total < 100) {
    const remaining = 100 - total;
    data.push({
      name: 'Others',
      value: remaining
    });
  }
  
  return data;
}
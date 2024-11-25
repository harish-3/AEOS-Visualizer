import { v4 as uuidv4 } from 'uuid';

export interface LabeledDataPoint {
  id: string;
  value: number;
  category: string;
  label: string;
  confidence: number;
}

export interface DatasetStats {
  totalPoints: number;
  labeledPoints: number;
  unlabeledPoints: number;
  averageConfidence: number;
}

export class DataLabeler {
  private static readonly CATEGORY_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  static labelDataset(data: Array<{ value: number; name: string }>): {
    labeledData: LabeledDataPoint[];
    stats: DatasetStats;
  } {
    const labeledData: LabeledDataPoint[] = [];
    let totalConfidence = 0;
    let labelIndex = 0;

    // Sort data by value in descending order
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    for (const item of sortedData) {
      if (labelIndex >= DataLabeler.CATEGORY_LABELS.length) break;

      // Calculate confidence based on value distribution
      const confidence = DataLabeler.calculateConfidence(item.value);
      
      if (confidence >= 0.5) { // Only label data points with confidence >= 50%
        labeledData.push({
          id: uuidv4(),
          value: item.value,
          category: DataLabeler.CATEGORY_LABELS[labelIndex],
          label: item.name,
          confidence
        });
        totalConfidence += confidence;
        labelIndex++;
      }
    }

    const stats: DatasetStats = {
      totalPoints: data.length,
      labeledPoints: labeledData.length,
      unlabeledPoints: data.length - labeledData.length,
      averageConfidence: labeledData.length > 0 ? totalConfidence / labeledData.length : 0
    };

    return { labeledData, stats };
  }

  private static calculateConfidence(value: number): number {
    // Calculate confidence based on value characteristics
    // Values between 20 and 80 are considered more reliable
    if (value < 1 || value > 100) return 0;
    if (value >= 20 && value <= 80) return 0.8;
    if (value > 80) return 0.7;
    return 0.6;
  }
}
import { v4 as uuidv4 } from 'uuid';

export interface LabeledDataPoint {
  id: string;
  value: number;
  category: string;
  label: string;
}

export interface DatasetStats {
  totalPoints: number;
  labeledPoints: number;
}

export class DataLabeler {
  private static readonly CATEGORY_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  static labelDataset(data: Array<{ value: number; name: string }>): {
    labeledData: LabeledDataPoint[];
    stats: DatasetStats;
  } {
    const labeledData: LabeledDataPoint[] = [];
    let labelIndex = 0;

    // Sort data by value in descending order
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    for (const item of sortedData) {
      if (labelIndex >= DataLabeler.CATEGORY_LABELS.length) break;

      labeledData.push({
        id: uuidv4(),
        value: item.value,
        category: DataLabeler.CATEGORY_LABELS[labelIndex],
        label: item.name
      });
      labelIndex++;
    }

    const stats: DatasetStats = {
      totalPoints: data.length,
      labeledPoints: labeledData.length
    };

    return { labeledData, stats };
  }
}
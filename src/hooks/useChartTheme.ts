import { useState } from 'react';
import { ChartTheme } from '../types';

export const CHART_THEMES: ChartTheme[] = [
  {
    name: 'Vibrant Future',
    colors: [
      '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#10B981', '#3B82F6',
      '#6EE7B7', '#A855F7', '#FB923C', '#F472B6'
    ],
    background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
    textColor: '#1F2937',
    gridColor: '#E5E7EB',
    animation: {
      type: 'scale',
      duration: 1.5
    }
  },
  {
    name: 'Ocean Depths',
    colors: [
      '#0EA5E9', '#2563EB', '#06B6D4', '#0891B2', '#0E7490',
      '#0369A1', '#38BDF8', '#7DD3FC', '#67E8F9', '#155E75'
    ],
    background: 'linear-gradient(145deg, #F0F9FF, #E0F2FE)',
    textColor: '#0C4A6E',
    gridColor: '#BAE6FD',
    animation: {
      type: 'slide',
      duration: 1.2
    }
  },
  {
    name: 'Enchanted Forest',
    colors: [
      '#059669', '#047857', '#10B981', '#34D399', '#6EE7B7',
      '#065F46', '#0D9488', '#14B8A6', '#2DD4BF', '#99F6E4'
    ],
    background: 'linear-gradient(145deg, #ECFDF5, #D1FAE5)',
    textColor: '#064E3B',
    gridColor: '#6EE7B7',
    animation: {
      type: 'bounce',
      duration: 1.3
    }
  },
  {
    name: 'Sunset Horizon',
    colors: [
      '#F97316', '#EA580C', '#FB923C', '#FD8A4D', '#FDBA74',
      '#C2410C', '#FB7185', '#F43F5E', '#FF5733', '#FED7AA'
    ],
    background: 'linear-gradient(145deg, #FFF7ED, #FFEDD5)',
    textColor: '#9A3412',
    gridColor: '#FED7AA',
    animation: {
      type: 'fade',
      duration: 1.4
    }
  },
  {
    name: 'Neon Dreams',
    colors: [
      '#22D3EE', '#06B6D4', '#67E8F9', '#A5F3FC', '#7C3AED',
      '#8B5CF6', '#F472B6', '#EC4899', '#F43F5E', '#FB7185'
    ],
    background: 'linear-gradient(145deg, #0F172A, #1E293B)',
    textColor: '#F8FAFC',
    gridColor: '#334155',
    animation: {
      type: 'rotate',
      duration: 1.6
    }
  },
  {
    name: 'Royal Elegance',
    colors: [
      '#7C3AED', '#8B5CF6', '#A855F7', '#C084FC', '#D946EF',
      '#E879F9', '#F472B6', '#FB7185', '#FCA5A5', '#FECDD3'
    ],
    background: 'linear-gradient(145deg, #FAF5FF, #F3E8FF)',
    textColor: '#581C87',
    gridColor: '#E9D5FF',
    animation: {
      type: 'scale',
      duration: 1.5
    }
  },
  {
    name: 'Earth Tones',
    colors: [
      '#92400E', '#B45309', '#D97706', '#F59E0B', '#FBBF24',
      '#78350F', '#92400E', '#B45309', '#D97706', '#FDE68A'
    ],
    background: 'linear-gradient(145deg, #FFFBEB, #FEF3C7)',
    textColor: '#78350F',
    gridColor: '#FDE68A',
    animation: {
      type: 'slide',
      duration: 1.4
    }
  },
  {
    name: 'Nordic Frost',
    colors: [
      '#0F766E', '#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4',
      '#67E8F9', '#7DD3FC', '#93C5FD', '#A5B4FC', '#C7D2FE'
    ],
    background: 'linear-gradient(145deg, #F0FDFA, #CCFBF1)',
    textColor: '#134E4A',
    gridColor: '#99F6E4',
    animation: {
      type: 'bounce',
      duration: 1.3
    }
  }
];

export function useChartTheme() {
  const [currentTheme, setCurrentTheme] = useState<ChartTheme>(CHART_THEMES[0]);

  return {
    currentTheme,
    setCurrentTheme,
    themes: CHART_THEMES
  };
}
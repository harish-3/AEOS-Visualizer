import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, LineChart, AlertTriangle, BarChart2, 
  ArrowUpRight, ArrowDownRight, Target, Zap, PieChart, 
  TrendingDown, Activity, Lightbulb, Sparkles
} from 'lucide-react';
import { InsightCard } from './insights/InsightCard';
import { InsightItem } from './insights/InsightItem';
import { PredictionItem } from './insights/PredictionItem';
import { TrendItem } from './insights/TrendItem';

interface DataInsightsProps {
  insights: string[];
  suggestedCharts: string[];
}

export function DataInsights({ insights, suggestedCharts }: DataInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightCard
          title="Key Insights"
          icon={Lightbulb}
          gradient="from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20"
          borderColor="border-purple-100 dark:border-purple-900"
        >
          {insights.map((insight, index) => (
            <InsightItem
              key={index}
              icon={BarChart2}
              text={insight}
              color="purple"
              index={index}
            />
          ))}
        </InsightCard>

        <InsightCard
          title="Suggested Charts"
          icon={Sparkles}
          gradient="from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20"
          borderColor="border-blue-100 dark:border-blue-900"
        >
          {suggestedCharts.map((chart, index) => (
            <InsightItem
              key={index}
              icon={chart === 'pie' ? PieChart : chart === 'bar' ? BarChart2 : LineChart}
              text={`${chart.charAt(0).toUpperCase() + chart.slice(1)} Chart Recommended`}
              color="blue"
              index={index}
            />
          ))}
        </InsightCard>
      </div>
    </motion.div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface TrendItemProps {
  icon: LucideIcon;
  text: string;
  type: string;
  momentum: 'positive' | 'negative' | 'neutral';
  index: number;
  predictionsLength: number;
}

export function TrendItem({ icon: Icon, text, type, momentum, index, predictionsLength }: TrendItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (predictionsLength + index) * 0.1 }}
      className={`flex items-start gap-3 p-4 rounded-lg ${
        momentum === 'positive'
          ? 'bg-gradient-to-r from-green-50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
          : momentum === 'negative'
          ? 'bg-gradient-to-r from-red-50 to-orange-50/50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
      } border backdrop-blur-sm`}
    >
      <div className={`p-2 rounded-lg ${
        momentum === 'positive'
          ? 'bg-green-100 dark:bg-green-900/50'
          : momentum === 'negative'
          ? 'bg-red-100 dark:bg-red-900/50'
          : 'bg-blue-100 dark:bg-blue-900/50'
      }`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{text}</p>
        <span className={`text-xs px-2 py-1 rounded-full font-medium mt-2 inline-block ${
          momentum === 'positive'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : momentum === 'negative'
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        }`}>
          {type} trend
        </span>
      </div>
    </motion.div>
  );
}
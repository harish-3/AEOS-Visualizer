import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PredictionItemProps {
  icon: LucideIcon;
  text: string;
  confidence: 'high' | 'medium' | 'low';
  impact: 'critical' | 'high' | 'moderate' | 'low';
  index: number;
}

export function PredictionItem({ icon: Icon, text, confidence, impact, index }: PredictionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-700/50 border border-gray-200 dark:border-gray-600 backdrop-blur-sm"
    >
      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{text}</p>
        <div className="flex gap-2 mt-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            confidence === 'high' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {confidence} confidence
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            impact === 'critical'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : impact === 'high'
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            {impact} impact
          </span>
        </div>
      </div>
    </motion.div>
  );
}
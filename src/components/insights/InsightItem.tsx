import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface InsightItemProps {
  icon: LucideIcon;
  text: string;
  color: string;
  index: number;
}

export function InsightItem({ icon: Icon, text, color, index }: InsightItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-start gap-3 p-4 rounded-lg bg-${color}-50/80 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800 backdrop-blur-sm`}
    >
      <div className={`p-2 bg-${color}-100 dark:bg-${color}-900/50 rounded-lg`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{text}</p>
      </div>
    </motion.div>
  );
}
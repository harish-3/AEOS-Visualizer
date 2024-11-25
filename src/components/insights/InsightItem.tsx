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
  const colorClasses = {
    purple: {
      bg: 'bg-purple-50/80 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'bg-purple-100 dark:bg-purple-900/50'
    },
    blue: {
      bg: 'bg-blue-50/80 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'bg-blue-100 dark:bg-blue-900/50'
    }
  };

  const classes = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-start gap-3 p-4 rounded-lg ${classes.bg} border ${classes.border} backdrop-blur-sm`}
    >
      <div className={`p-2 ${classes.icon} rounded-lg`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{text}</p>
      </div>
    </motion.div>
  );
}
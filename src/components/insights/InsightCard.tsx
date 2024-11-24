import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  gradient: string;
  borderColor: string;
}

export function InsightCard({ title, icon: Icon, children, gradient, borderColor }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg p-6 border ${borderColor}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
          <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
          {title}
        </h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
}
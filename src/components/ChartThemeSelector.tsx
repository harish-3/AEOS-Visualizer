import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartTheme } from '../types';
import { CHART_THEMES } from '../hooks/useChartTheme';

interface ChartThemeSelectorProps {
  currentTheme: ChartTheme;
  onThemeChange: (theme: ChartTheme) => void;
}

export function ChartThemeSelector({ currentTheme, onThemeChange }: ChartThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
      >
        <Palette className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme: {currentTheme.name}</span>
        <div className="flex gap-1">
          {currentTheme.colors.slice(0, 3).map((color, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-40 overflow-hidden"
            >
              <div className="p-3 space-y-1">
                {CHART_THEMES.map((theme) => (
                  <motion.button
                    key={theme.name}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => {
                      onThemeChange(theme);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between rounded-lg transition-colors
                      ${currentTheme.name === theme.name
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                  >
                    <span className="text-sm font-medium">{theme.name}</span>
                    <div className="flex gap-1">
                      {theme.colors.slice(0, 5).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
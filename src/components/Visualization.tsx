import React from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Treemap
} from 'recharts';
import { ChartTheme } from '../types';
import { ExportControls } from './ExportControls';

interface VisualizationProps {
  data?: Array<{
    name: string;
    value: number;
  }>;
  chartType?: 'pie' | 'bar' | 'treemap';
  theme: ChartTheme;
}

const ANIMATION_CONFIG = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <p className="font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
        <p className="text-purple-600 dark:text-purple-400 font-medium">
          {payload[0].value}%
        </p>
      </motion.div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    className="flex flex-wrap justify-center gap-4 mt-6 p-4 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md backdrop-blur-sm"
  >
    {payload?.map((entry: any, index: number) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{ 
          backgroundColor: `${entry.color}20`,
          border: `2px solid ${entry.color}`
        }}
      >
        <motion.div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.value}
        </span>
      </motion.div>
    ))}
  </motion.div>
);

export function Visualization({ data = [], chartType = 'pie', theme }: VisualizationProps) {
  const chartRef = React.useRef<HTMLDivElement>(null);
  const exportRef = React.useRef<HTMLDivElement>(null);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <p className="text-gray-500 dark:text-gray-400">No data available to visualize</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={theme.colors[index % theme.colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(156, 163, 175, 0.2)" 
                vertical={false}
              />
              <XAxis 
                dataKey="name"
                tick={{ 
                  fill: '#374151',
                  fontSize: 12,
                  fontWeight: 500
                }}
                stroke="#374151"
                angle={-45}
                textAnchor="end"
                height={80}
                tickMargin={10}
              />
              <YAxis
                tick={{ 
                  fill: '#374151',
                  fontSize: 12,
                  fontWeight: 500
                }}
                stroke="#374151"
                label={{ 
                  value: 'Percentage (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: '#374151',
                  fontSize: 14,
                  fontWeight: 600,
                  offset: -10
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                maxBarSize={60}
                animationBegin={0}
                animationDuration={1000}
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={theme.colors[index % theme.colors.length]}
                  />
                ))}
              </Bar>
              <Legend 
                content={<CustomLegend />}
                verticalAlign="bottom"
                height={80}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <Treemap
              data={data}
              dataKey="value"
              aspectRatio={4/3}
              stroke={theme.gridColor}
              animationBegin={0}
              animationDuration={1000}
              content={({ x, y, width, height, index, name, value }) => (
                <g>
                  <motion.rect
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={theme.colors[index % theme.colors.length]}
                  />
                  {width > 30 && height > 30 && (
                    <>
                      <motion.text
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                        x={x + width / 2}
                        y={y + height / 2 - 8}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        className="font-medium"
                      >
                        {name}
                      </motion.text>
                      <motion.text
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        x={x + width / 2}
                        y={y + height / 2 + 8}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        className="font-medium"
                      >
                        {value}%
                      </motion.text>
                    </>
                  )}
                </g>
              )}
            />
          </ResponsiveContainer>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-xl shadow-lg p-4 bg-white dark:bg-gray-800"
      ref={chartRef}
    >
      <motion.div className="mb-4">
        <ExportControls chartRef={exportRef} data={data} currentTheme={theme} />
      </motion.div>

      <motion.div 
        className="w-full" 
        ref={exportRef}
        {...ANIMATION_CONFIG}
      >
        {renderChart()}
      </motion.div>
    </motion.div>
  );
}
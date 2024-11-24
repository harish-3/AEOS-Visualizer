import React from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Treemap, Label
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
        <p className="text-purple-600 dark:text-purple-400 font-medium">
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => (
  <div className="flex flex-wrap justify-center gap-2 mt-4 p-3 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md backdrop-blur-sm">
    {payload?.map((entry: any, index: number) => (
      <div 
        key={index} 
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{ 
          backgroundColor: `${entry.color}20`,
          border: `2px solid ${entry.color}`
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.value}
        </span>
      </div>
    ))}
  </div>
);

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value, fill }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  return (
    <g>
      <text
        x={x}
        y={y}
        fill="#FFFFFF"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-medium"
        style={{
          filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))',
          paintOrder: 'stroke',
          stroke: 'rgba(0,0,0,0.75)',
          strokeWidth: '3px',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }}
      >
        {`${name} - ${value}%`}
      </text>
    </g>
  );
};

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
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={180}
                innerRadius={0}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={theme.colors[index % theme.colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />
              <XAxis 
                dataKey="name"
                tick={{ fill: theme.textColor }}
                stroke={theme.textColor}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: theme.textColor }}
                stroke={theme.textColor}
                label={{ 
                  value: 'Percentage (%)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  fill: theme.textColor 
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" maxBarSize={60}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={theme.colors[index % theme.colors.length]}
                  >
                    <Label
                      position="top"
                      content={({ value }) => `${value}%`}
                      fill={theme.textColor}
                      style={{
                        filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))',
                        paintOrder: 'stroke',
                        stroke: 'rgba(0,0,0,0.75)',
                        strokeWidth: '2px',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round'
                      }}
                    />
                  </Cell>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height={500}>
            <Treemap
              data={data}
              dataKey="value"
              aspectRatio={4/3}
              stroke={theme.gridColor}
              content={({ root, depth, x, y, width, height, index, name, value }) => (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={theme.colors[index % theme.colors.length]}
                  />
                  {width > 30 && height > 30 && (
                    <>
                      <text
                        x={x + width / 2}
                        y={y + height / 2 - 8}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        className="font-medium"
                        style={{
                          filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))',
                          paintOrder: 'stroke',
                          stroke: 'rgba(0,0,0,0.75)',
                          strokeWidth: '2px',
                          strokeLinecap: 'round',
                          strokeLinejoin: 'round'
                        }}
                      >
                        {name}
                      </text>
                      <text
                        x={x + width / 2}
                        y={y + height / 2 + 8}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        className="font-medium"
                        style={{
                          filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))',
                          paintOrder: 'stroke',
                          stroke: 'rgba(0,0,0,0.75)',
                          strokeWidth: '2px',
                          strokeLinecap: 'round',
                          strokeLinejoin: 'round'
                        }}
                      >
                        {value}%
                      </text>
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
      className="rounded-xl shadow-lg p-6 bg-white dark:bg-gray-800"
      ref={chartRef}
    >
      <div className="mb-6">
        <ExportControls chartRef={exportRef} data={data} currentTheme={theme} />
      </div>

      <div className="w-full h-[600px] export-wrapper" ref={exportRef}>
        <div className="h-[500px]">
          {renderChart()}
        </div>
        <CustomLegend 
          payload={data.map((item, index) => ({
            value: `${item.name} - ${item.value}%`,
            color: theme.colors[index % theme.colors.length]
          }))}
        />
      </div>
    </motion.div>
  );
}
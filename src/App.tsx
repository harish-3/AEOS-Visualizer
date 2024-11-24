import React, { useState } from 'react';
import { Header } from './components/Header';
import { DataInput } from './components/DataInput';
import { Visualization } from './components/Visualization';
import { DataInsights } from './components/DataInsights';
import { LabeledDataset } from './components/LabeledDataset';
import { ChartThemeSelector } from './components/ChartThemeSelector';
import { ChartTypeSelector } from './components/ChartTypeSelector';
import { useChartTheme } from './hooks/useChartTheme';
import { processData } from './utils/dataProcessor';
import { DataLabeler } from './utils/dataLabeler';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualData, setVisualData] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [suggestedCharts, setSuggestedCharts] = useState<string[]>([]);
  const [labeledData, setLabeledData] = useState<any>(null);
  const { currentTheme, setCurrentTheme } = useChartTheme();
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'treemap'>('pie');

  const handleDataSubmit = async (input: string) => {
    setIsProcessing(true);
    try {
      const result = processData(input);
      setVisualData(result.data);
      setInsights(result.insights);
      setSuggestedCharts(result.suggestedCharts);
      setChartType(result.suggestedCharts[0] as 'pie' | 'bar' | 'treemap');
      
      // Process labeled dataset
      const labeledResult = DataLabeler.labelDataset(result.data);
      setLabeledData(labeledResult);
    } catch (error) {
      console.error('Error processing data:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-200">
      <Toaster position="top-right" />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Transform Your Data into Beautiful Infographics
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simply input your data and let AI create engaging animated visualizations in seconds.
          </p>
        </motion.div>

        <DataInput onSubmit={handleDataSubmit} isProcessing={isProcessing} />
        
        {visualData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <ChartTypeSelector 
                currentType={chartType} 
                onTypeChange={setChartType}
              />
              <ChartThemeSelector 
                currentTheme={currentTheme} 
                onThemeChange={setCurrentTheme} 
              />
            </div>
            
            <Visualization 
              data={visualData} 
              theme={currentTheme} 
              chartType={chartType}
            />
            
            <DataInsights 
              insights={insights}
              suggestedCharts={suggestedCharts}
            />

            {labeledData && (
              <LabeledDataset
                labeledData={labeledData.labeledData}
                stats={labeledData.stats}
              />
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;
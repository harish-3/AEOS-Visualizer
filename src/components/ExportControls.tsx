import React, { useState } from 'react';
import { Download, Camera, Video, Settings, X, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { exportToVideo } from '../utils/videoExporter';
import { ChartTheme, AnimationType } from '../types';
import { VideoExportControls } from './VideoExportControls';

interface ExportControlsProps {
  chartRef: React.RefObject<HTMLDivElement>;
  data: any;
  currentTheme: ChartTheme;
}

export function ExportControls({ chartRef, data, currentTheme }: ExportControlsProps) {
  const [showSettings, setShowSettings] = useState(false);

  const exportAsImage = async () => {
    if (!chartRef.current) return;
    
    try {
      toast.loading('Generating image...');
      const dataUrl = await toPng(chartRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: currentTheme.background
      });
      saveAs(dataUrl, 'chart.png');
      toast.dismiss();
      toast.success('Chart exported successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export chart');
    }
  };

  const exportAsJson = () => {
    try {
      const exportData = {
        data,
        theme: currentTheme.name,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      saveAs(blob, 'chart-data.json');
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportAsImage}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Camera className="h-4 w-4" />
          <span>Export Image</span>
        </motion.button>

        <VideoExportControls chartRef={chartRef} />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportAsJson}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FileJson className="h-4 w-4" />
          <span>Export JSON</span>
        </motion.button>
      </div>
    </div>
  );
}
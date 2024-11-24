import React, { useState } from 'react';
import { Download, Camera, Video, Settings, X, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { exportToVideo } from '../utils/videoExporter';
import { ChartTheme } from '../types';

interface ExportControlsProps {
  chartRef: React.RefObject<HTMLDivElement>;
  data: any;
  currentTheme: ChartTheme;
}

const QUALITY_PRESETS = [
  { label: '4K', width: 3840, height: 2160 },
  { label: '2K', width: 2560, height: 1440 },
  { label: '1080p', width: 1920, height: 1080 },
  { label: '720p', width: 1280, height: 720 }
];

const ANIMATION_TYPES = [
  { label: 'Scale', value: 'scale' },
  { label: 'Rotate', value: 'rotate' },
  { label: 'Fade', value: 'fade' },
  { label: 'Bounce', value: 'bounce' },
  { label: 'Wave', value: 'wave' },
  { label: 'Pulse', value: 'pulse' },
  { label: 'Spiral', value: 'spiral' },
  { label: 'Swing', value: 'swing' }
];

export function ExportControls({ chartRef, data, currentTheme }: ExportControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [videoSettings, setVideoSettings] = useState({
    duration: 3,
    fps: 30,
    quality: '1080p',
    animation: 'scale'
  });

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

  const exportAsVideo = async () => {
    if (!chartRef.current) return;
    setIsExporting(true);
    
    try {
      toast.loading('Generating video...');
      const preset = QUALITY_PRESETS.find(p => p.label === videoSettings.quality) || QUALITY_PRESETS[2];
      
      const videoBlob = await exportToVideo(chartRef.current, {
        duration: videoSettings.duration,
        fps: videoSettings.fps,
        width: preset.width,
        height: preset.height,
        theme: currentTheme,
        animation: {
          type: videoSettings.animation as any,
          duration: videoSettings.duration
        }
      });

      saveAs(videoBlob, `chart-${videoSettings.quality}.webm`);
      toast.dismiss();
      toast.success('Video exported successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export video');
    } finally {
      setIsExporting(false);
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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(!showSettings)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Video className="h-4 w-4" />
          <span>Export Video</span>
        </motion.button>

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

      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-30"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-40 w-80"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Video Export Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={videoSettings.duration}
                      onChange={(e) => setVideoSettings(prev => ({
                        ...prev,
                        duration: Number(e.target.value)
                      }))}
                      className="flex-1 accent-purple-600"
                    />
                    <span className="text-sm font-medium w-16">{videoSettings.duration}s</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Animation Type</label>
                  <select
                    value={videoSettings.animation}
                    onChange={(e) => setVideoSettings(prev => ({
                      ...prev,
                      animation: e.target.value
                    }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    {ANIMATION_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quality</label>
                  <select
                    value={videoSettings.quality}
                    onChange={(e) => setVideoSettings(prev => ({
                      ...prev,
                      quality: e.target.value
                    }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    {QUALITY_PRESETS.map(preset => (
                      <option key={preset.label} value={preset.label}>
                        {preset.label} ({preset.width}x{preset.height})
                      </option>
                    ))}
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportAsVideo}
                  disabled={isExporting}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2"
                >
                  <Video className="h-4 w-4" />
                  <span>{isExporting ? 'Exporting...' : 'Export Video'}</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
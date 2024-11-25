import React, { useState } from 'react';
import { Video, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { exportToVideo } from '../utils/videoExporter';
import { AnimationType } from '../types';

interface VideoExportControlsProps {
  chartRef: React.RefObject<HTMLDivElement>;
}

const ANIMATION_TYPES: Array<{ value: AnimationType; label: string; description: string }> = [
  { 
    value: 'reveal', 
    label: 'Professional Reveal', 
    description: 'Default animation with smooth reveal and staggered elements' 
  },
  { 
    value: 'fade', 
    label: 'Simple Fade', 
    description: 'Clean fade-in transition' 
  },
  { 
    value: 'scale', 
    label: 'Scale Up', 
    description: 'Elements scale up from smaller size' 
  },
  { 
    value: 'slide', 
    label: 'Slide Up', 
    description: 'Elements slide up into position' 
  }
];

const QUALITY_PRESETS = [
  { label: '4K', width: 3840, height: 2160 },
  { label: '2K', width: 2560, height: 1440 },
  { label: '1080p', width: 1920, height: 1080 },
  { label: '720p', width: 1280, height: 720 }
];

export function VideoExportControls({ chartRef }: VideoExportControlsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [videoSettings, setVideoSettings] = useState({
    duration: 3,
    fps: 30,
    quality: '1080p',
    animation: 'reveal' as AnimationType
  });

  const handleExport = async () => {
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
        animation: {
          type: videoSettings.animation,
          duration: videoSettings.duration
        }
      });

      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chart-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('Video exported successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export video');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
      setShowSettings(false);
    }
  };

  const selectedAnimationInfo = ANIMATION_TYPES.find(a => a.value === videoSettings.animation);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSettings(!showSettings)}
        className="btn btn-primary flex items-center space-x-2"
        disabled={isExporting}
      >
        <Video className="h-4 w-4" />
        <span>{isExporting ? 'Exporting...' : 'Export Video'}</span>
      </motion.button>

      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-40 w-96"
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
                  <label className="block text-sm font-medium mb-2">Animation Style</label>
                  <select
                    value={videoSettings.animation}
                    onChange={(e) => setVideoSettings(prev => ({
                      ...prev,
                      animation: e.target.value as AnimationType
                    }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  >
                    {ANIMATION_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {selectedAnimationInfo && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {selectedAnimationInfo.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={videoSettings.duration}
                    onChange={(e) => setVideoSettings(prev => ({
                      ...prev,
                      duration: Number(e.target.value)
                    }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
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
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2"
                >
                  <Video className="h-4 w-4" />
                  <span>{isExporting ? 'Exporting...' : 'Generate Video'}</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
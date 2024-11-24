import { toPng } from 'html-to-image';
import { ChartTheme } from '../types';

interface VideoExportOptions {
  duration: number;
  fps: number;
  width: number;
  height: number;
  quality?: number;
  theme: ChartTheme;
  animation?: {
    type: 'rotate' | 'scale' | 'fade' | 'bounce' | 'wave' | 'pulse' | 'spiral' | 'swing';
    duration: number;
  };
}

export async function exportToVideo(
  element: HTMLElement,
  options: VideoExportOptions
): Promise<Blob> {
  // Create a wrapper div for scaling
  const wrapper = document.createElement('div');
  wrapper.style.width = `${options.width}px`;
  wrapper.style.height = `${options.height}px`;
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '0';
  wrapper.style.zIndex = '-1000';
  wrapper.style.background = options.theme.background;
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.style.overflow = 'hidden';
  wrapper.style.padding = '2rem';
  wrapper.style.boxSizing = 'border-box';
  document.body.appendChild(wrapper);

  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Set styles for full-page display
  clone.style.width = '100%';
  clone.style.height = '100%';
  clone.style.padding = '2rem';
  clone.style.margin = '0';
  clone.style.display = 'flex';
  clone.style.flexDirection = 'column';
  clone.style.alignItems = 'center';
  clone.style.justifyContent = 'center';
  clone.style.transform = 'scale(0.95)'; // Slightly reduce size to ensure padding

  // Ensure the chart container takes full size
  const chartContainer = clone.querySelector('.chart-container') as HTMLElement;
  if (chartContainer) {
    chartContainer.style.width = '100%';
    chartContainer.style.height = '100%';
    chartContainer.style.minHeight = '100%';
    chartContainer.style.display = 'flex';
    chartContainer.style.alignItems = 'center';
    chartContainer.style.justifyContent = 'center';
  }

  // Ensure the Recharts wrapper takes full size
  const rechartsWrapper = clone.querySelector('.recharts-wrapper') as HTMLElement;
  if (rechartsWrapper) {
    rechartsWrapper.style.width = '100% !important';
    rechartsWrapper.style.height = '100% !important';
    rechartsWrapper.style.minHeight = '100% !important';
  }

  wrapper.appendChild(clone);

  const canvas = document.createElement('canvas');
  canvas.width = options.width;
  canvas.height = options.height;
  const ctx = canvas.getContext('2d')!;

  const frames: ImageData[] = [];
  const totalFrames = options.duration * options.fps;

  // Capture frames with animation
  for (let frame = 0; frame < totalFrames; frame++) {
    const progress = frame / totalFrames;
    const easeProgress = easeInOutCubic(progress);

    // Apply animations based on type
    if (options.animation) {
      switch (options.animation.type) {
        case 'rotate':
          clone.style.transform = `scale(0.95) rotate(${progress * 360}deg)`;
          break;
        case 'scale':
          const scale = 0.85 + Math.sin(progress * Math.PI) * 0.1;
          clone.style.transform = `scale(${scale})`;
          break;
        case 'fade':
          clone.style.opacity = `${progress}`;
          break;
        case 'bounce':
          const bounce = Math.sin(progress * Math.PI * 2) * 15;
          clone.style.transform = `scale(0.95) translateY(${bounce}px)`;
          break;
        case 'wave':
          const wave = Math.sin(progress * Math.PI * 4) * 8;
          clone.style.transform = `scale(0.95) translateX(${wave}px)`;
          break;
        case 'pulse':
          const pulse = 0.9 + Math.sin(progress * Math.PI * 4) * 0.05;
          clone.style.transform = `scale(${pulse})`;
          break;
        case 'spiral':
          const angle = progress * Math.PI * 4;
          const radius = 15 * (1 - progress);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          clone.style.transform = `scale(0.95) translate(${x}px, ${y}px) rotate(${angle * 57.3}deg)`;
          break;
        case 'swing':
          const swing = Math.sin(progress * Math.PI * 2) * 15;
          clone.style.transform = `scale(0.95) rotate(${swing}deg)`;
          break;
      }
    }

    // Capture frame
    try {
      const dataUrl = await toPng(wrapper, {
        quality: options.quality || 0.95,
        width: options.width,
        height: options.height,
        backgroundColor: options.theme.background,
        style: {
          transform: 'none',
          width: '100%',
          height: '100%'
        }
      });

      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = dataUrl;
      });

      ctx.fillStyle = options.theme.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    } catch (error) {
      console.error('Frame capture error:', error);
    }
  }

  // Clean up
  document.body.removeChild(wrapper);

  // Create video from frames
  const mediaRecorder = new MediaRecorder(canvas.captureStream(options.fps), {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 5000000 // 5 Mbps for good quality while maintaining reasonable file size
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

  const videoPromise = new Promise<Blob>((resolve) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };
  });

  mediaRecorder.start();

  // Draw frames with smooth transitions
  for (const frame of frames) {
    ctx.putImageData(frame, 0, 0);
    await new Promise(resolve => setTimeout(resolve, 1000 / options.fps));
  }

  mediaRecorder.stop();

  return videoPromise;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
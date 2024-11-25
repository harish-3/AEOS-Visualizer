import { toPng } from 'html-to-image';
import { AnimationType } from '../types';

interface VideoExportOptions {
  duration: number;
  fps: number;
  width: number;
  height: number;
  quality?: number;
  animation: {
    type: AnimationType;
    duration: number;
  };
}

const easings = {
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutQuart: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

function applyAnimation(progress: number, type: AnimationType, element: HTMLElement): void {
  const easeProgress = easings.easeOutExpo(progress);
  const charts = element.querySelectorAll('.recharts-wrapper, .recharts-surface');
  const paths = element.querySelectorAll('path');
  const texts = element.querySelectorAll('text');
  const legends = element.querySelectorAll('.recharts-legend-wrapper');

  // Reset any previous transformations
  element.style.transform = 'none';
  element.style.opacity = '1';

  // Ensure the chart container maintains its dimensions
  element.style.width = '100%';
  element.style.height = '100%';
  element.style.display = 'flex';
  element.style.justifyContent = 'center';
  element.style.alignItems = 'center';
  element.style.overflow = 'visible';
  element.style.position = 'relative';

  // Ensure chart wrapper maintains visibility
  charts.forEach(chart => {
    (chart as HTMLElement).style.visibility = 'visible';
    (chart as HTMLElement).style.position = 'relative';
  });

  switch (type) {
    case 'fade':
      element.style.opacity = easeProgress.toString();
      break;

    case 'scale':
      element.style.transform = `scale(${0.5 + (easeProgress * 0.5)})`;
      element.style.opacity = easeProgress.toString();
      break;

    case 'slide':
      element.style.transform = `translateY(${(1 - easeProgress) * 50}px)`;
      element.style.opacity = easeProgress.toString();
      break;

    case 'reveal':
      paths.forEach((path, index) => {
        const delay = index * 0.1;
        const pathProgress = Math.max(0, Math.min(1, (progress - delay)));
        const pathLength = path.getTotalLength?.() || 0;
        
        path.style.strokeDasharray = `${pathLength} ${pathLength}`;
        path.style.strokeDashoffset = `${pathLength * (1 - pathProgress)}`;
        path.style.opacity = pathProgress.toString();
      });

      texts.forEach((text, index) => {
        const delay = index * 0.1;
        const textProgress = Math.max(0, Math.min(1, (progress - delay)));
        text.style.opacity = textProgress.toString();
      });

      legends.forEach((legend, index) => {
        const delay = 0.3 + index * 0.1;
        const legendProgress = Math.max(0, Math.min(1, (progress - delay)));
        (legend as HTMLElement).style.opacity = legendProgress.toString();
        (legend as HTMLElement).style.transform = `translateY(${(1 - legendProgress) * 20}px)`;
      });
      break;

    // Add other animation types as needed...
  }
}

export async function exportToVideo(
  element: HTMLElement,
  options: VideoExportOptions
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Set canvas dimensions with a margin to prevent cropping
  canvas.width = options.width;
  canvas.height = options.height;

  // Create MediaRecorder
  const stream = canvas.captureStream(options.fps);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 8000000
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

  // Calculate frames
  const totalFrames = Math.round(options.duration * options.fps);
  const frameInterval = 1000 / options.fps;

  // Create a wrapper for the chart
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.style.height = '100%';
  wrapper.style.position = 'relative';
  wrapper.style.display = 'flex';
  wrapper.style.justifyContent = 'center';
  wrapper.style.alignItems = 'center';
  wrapper.style.backgroundColor = '#ffffff';
  wrapper.appendChild(element.cloneNode(true));

  // Store original styles
  const originalStyles = new Map<HTMLElement, string>();
  element.querySelectorAll('*').forEach((el) => {
    originalStyles.set(el as HTMLElement, (el as HTMLElement).style.cssText);
  });

  // Render frames
  for (let frame = 0; frame <= totalFrames; frame++) {
    const progress = frame / totalFrames;
    
    // Apply animation
    applyAnimation(progress, options.animation.type, element);

    try {
      // Capture frame with padding
      const dataUrl = await toPng(element, {
        quality: options.quality || 1.0,
        width: options.width * 0.8, // Add 20% padding
        height: options.height * 0.8,
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'center center'
        }
      });

      // Draw frame with centering
      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Calculate position to center the image
          const x = (canvas.width - img.width) / 2;
          const y = (canvas.height - img.height) / 2;
          
          ctx.drawImage(img, x, y);
          resolve();
        };
        img.src = dataUrl;
      });

      // Maintain frame rate
      await new Promise(resolve => setTimeout(resolve, frameInterval));
    } catch (error) {
      console.error('Frame rendering error:', error);
    }
  }

  // Restore original styles
  element.querySelectorAll('*').forEach((el) => {
    const originalStyle = originalStyles.get(el as HTMLElement);
    if (originalStyle !== undefined) {
      (el as HTMLElement).style.cssText = originalStyle;
    }
  });

  mediaRecorder.stop();
  return videoPromise;
}
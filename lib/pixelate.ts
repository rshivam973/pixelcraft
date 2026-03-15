export interface PixelateOptions {
  pixelSize: number;
}

export function pixelateImage(
  sourceImage: HTMLImageElement | HTMLCanvasElement,
  pixelSize: number
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D & {
    imageSmoothingEnabled: boolean;
    mozImageSmoothingEnabled?: boolean;
    webkitImageSmoothingEnabled?: boolean;
    msImageSmoothingEnabled?: boolean;
  };
  
  const width = sourceImage.width;
  const height = sourceImage.height;
  
  canvas.width = width;
  canvas.height = height;
  
  ctx.imageSmoothingEnabled = false;
  if (ctx.mozImageSmoothingEnabled) ctx.mozImageSmoothingEnabled = false;
  if (ctx.webkitImageSmoothingEnabled) ctx.webkitImageSmoothingEnabled = false;
  if (ctx.msImageSmoothingEnabled) ctx.msImageSmoothingEnabled = false;
  
  const scale = 1 / pixelSize;
  const scaledWidth = Math.max(1, Math.floor(width * scale));
  const scaledHeight = Math.max(1, Math.floor(height * scale));
  
  ctx.drawImage(sourceImage, 0, 0, scaledWidth, scaledHeight);
  ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height);
  
  return canvas.toDataURL('image/png');
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function downloadImage(dataUrl: string, filename: string = 'pixel-art.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

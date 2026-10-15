// Cheap on-device photo checks: brightness and sharpness from a downscaled frame.

export type Quality = {
  brightness: number; // 0..255 mean luminance
  sharpness: number; // mean absolute neighbour difference, higher = crisper
  light: 'dark' | 'ok' | 'bright';
  steady: boolean;
  score: number; // 0..100
  ok: boolean;
};

const W = 160;

export function measure(source: CanvasImageSource, sw: number, sh: number): Quality {
  const h = Math.max(1, Math.round((W * sh) / sw));
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(source, 0, 0, W, h);
  const { data } = ctx.getImageData(0, 0, W, h);

  const lum = new Float32Array(W * h);
  let sum = 0;
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    lum[p] = l;
    sum += l;
  }
  const brightness = sum / lum.length;

  let edge = 0;
  let n = 0;
  for (let y = 1; y < h; y++) {
    for (let x = 1; x < W; x++) {
      const p = y * W + x;
      edge += Math.abs(lum[p] - lum[p - 1]) + Math.abs(lum[p] - lum[p - W]);
      n++;
    }
  }
  const sharpness = edge / Math.max(1, n);

  const light = brightness < 60 ? 'dark' : brightness > 215 ? 'bright' : 'ok';
  const steady = sharpness > 6;
  const lightScore = light === 'ok' ? 1 : Math.max(0, 1 - Math.abs(brightness - 135) / 135);
  const sharpScore = Math.min(1, sharpness / 14);
  const score = Math.round((lightScore * 0.5 + sharpScore * 0.5) * 100);

  return { brightness, sharpness, light, steady, score, ok: light === 'ok' && steady && score >= 55 };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function fileToDataUrl(file: File, maxSide = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = async () => {
      try {
        const img = await loadImage(reader.result as string);
        const k = Math.min(1, maxSide / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.86));
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsDataURL(file);
  });
}

export const uid = () => Math.random().toString(36).slice(2, 10);

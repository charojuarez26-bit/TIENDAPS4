/**
 * Compresses an image file using an off-screen HTML5 <canvas>
 * Resizes max width to 600px and exports as JPEG quality 0.7
 * Returns Promise<{ base64: string, originalSizeKb: number, compressedSizeKb: number, width: number, height: number }>
 */
export function compressImageFile(file, maxWidth = 600, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('El archivo no es una imagen válida.'));
    }

    const originalSizeKb = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale proportionally if width exceeds maxWidth (600px)
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('No se pudo inicializar el contexto de Canvas 2D.'));
        }

        // Draw image resized
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with 0.7 quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);

        // Calculate approximate size in KB of base64
        const head = 'data:image/jpeg;base64,';
        const strLen = compressedBase64.length - head.length;
        const compressedSizeKb = Math.round((strLen * 3) / 4 / 1024);

        resolve({
          base64: compressedBase64,
          originalSizeKb,
          compressedSizeKb,
          width,
          height,
        });
      };

      img.onerror = (imgErr) => {
        reject(new Error('Error al cargar la imagen en memoria.'));
      };

      img.src = readerEvent.target.result;
    };

    reader.onerror = (readerErr) => {
      reject(new Error('Error al leer el archivo desde el dispositivo.'));
    };

    reader.readAsDataURL(file);
  });
}

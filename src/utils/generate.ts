import { loadHtml2Canvas } from './html2canvas-loader';
import { jsPDF } from 'jspdf';
import { PaperSizes } from '../types';

/**
 * Shows a user-friendly error message.
 */
const showErrorMessage = (message: string): void => {
  console.error(message);
  if (typeof window !== 'undefined') {
    alert(`Error: ${message}`);
  }
};

/**
 * Applies contrast to image data for the scanner effect.
 */
const contrastImage = (imageData: ImageData, contrast: number): void => {
  const data = imageData.data;
  contrast *= 255;
  const factor = (contrast + 255) / (255.01 - contrast);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }
};

/**
 * Converts a DOM element to a canvas using html2canvas.
 * This is a private utility for the generateImages function.
 */
const convertElementToCanvas = async (
  element: HTMLElement,
  resolution: number,
  pageEffect: string
): Promise<HTMLCanvasElement> => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot generate image on the server side');
  }
  
  const html2canvas = await loadHtml2Canvas();
  if (!html2canvas) {
    throw new Error('Failed to load html2canvas library');
  }

  const canvas = await html2canvas(element, {
    scrollX: 0,
    scrollY: -window.scrollY,
    scale: resolution,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  if (pageEffect === 'scanner') {
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (context) {
      try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        contrastImage(imageData, 0.55);
        context.putImageData(imageData, 0, 0);
      } catch (error) {
        console.warn('Failed to apply scanner effect:', error);
      }
    }
  }

  return canvas;
};

/**
 * Generates an array of canvas elements from a paper preview element.
 * This function is now pure: it takes an element and settings, and returns data.
 * It creates a temporary clone to avoid side effects on the visible DOM.
 */
export const generateCanvases = async (
  originalPaperEl: HTMLElement,
  settings: {
    resolution: number;
    pageEffect: string;
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    wordSpacing: string;
    inkColor: string;
  }
): Promise<HTMLCanvasElement[]> => {
  if (!originalPaperEl) {
    showErrorMessage('Paper element not found');
    return [];
  }

  // Clone the element to work on a temporary, off-screen version
  const paperEl = originalPaperEl.cloneNode(true) as HTMLElement;
  document.body.appendChild(paperEl); // Append to body to get computed styles
  paperEl.style.position = 'absolute';
  paperEl.style.left = '-9999px'; // Move it off-screen
  paperEl.style.top = '-9999px';

  const paperContentEl = paperEl.querySelector('.paper-content') as HTMLElement;
  if (!paperContentEl) {
    document.body.removeChild(paperEl);
    showErrorMessage('Paper content element not found in clone');
    return [];
  }

  const canvases: HTMLCanvasElement[] = [];

  try {
    // Apply styles directly to the clone for rendering
    paperContentEl.style.color = settings.inkColor;
    paperContentEl.style.fontFamily = settings.fontFamily;
    paperContentEl.style.fontSize = settings.fontSize;
    paperContentEl.style.lineHeight = settings.lineHeight;
    paperContentEl.style.letterSpacing = settings.letterSpacing;
    paperContentEl.style.wordSpacing = settings.wordSpacing;

    // Simplified effect application
    if (settings.pageEffect === 'shadows') {
      paperEl.style.boxShadow = '12px 12px 24px 0 rgba(0,0,0,0.2)';
    }

    paperEl.scrollTo(0, 0);

    const pageHeight = paperContentEl.clientHeight;
    const scrollHeight = paperContentEl.scrollHeight;
    const tolerance = 10; // 10px tolerance
    const totalPages = scrollHeight > pageHeight + tolerance ? Math.ceil(scrollHeight / pageHeight) : 1;

    const maxPages = 50;
    if (totalPages > maxPages) {
      showErrorMessage(`Too many pages (${totalPages}). Maximum allowed is ${maxPages}.`);
      return [];
    }

    for (let i = 0; i < totalPages; i++) {
      paperContentEl.scrollTop = i * pageHeight;
      const canvas = await convertElementToCanvas(paperEl, settings.resolution, settings.pageEffect);
      canvases.push(canvas);
    }

    return canvases;
  } catch (error) {
    console.error('Error in image generation process:', error);
    showErrorMessage(`Image generation failed: ${(error as Error).message}`);
    return [];
  } finally {
    // IMPORTANT: Clean up the cloned element from the DOM
    if (paperEl.parentNode === document.body) {
      document.body.removeChild(paperEl);
    }
  }
};

/**
 * Downloads an array of generated images as a single PDF.
 * This function is pure; it takes image data and settings and produces a download.
 */
export const downloadAsPDF = (
  images: string[], // Expects an array of base64 data URLs
  paperSize: { width: number; height: number }
): void => {
  if (images.length === 0) {
    showErrorMessage('No images to download');
    return;
  }

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [paperSize.width, paperSize.height],
    });

    images.forEach((imgData, index) => {
      if (index > 0) {
        pdf.addPage([paperSize.width, paperSize.height]);
      }
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    });

    pdf.save('handwriting.pdf');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    showErrorMessage(`Failed to generate PDF: ${(error as Error).message}`);
  }
};

/**
 * Downloads a single canvas image as a PNG file.
 * This function is pure; it takes image data and a filename.
 */
export const downloadImageAsPNG = (image: string, filename: string): void => {
  if (!image) {
    showErrorMessage('No image to download');
    return;
  }
  try {
    const link = document.createElement('a');
    link.href = image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading PNG:', error);
    showErrorMessage(`Failed to download image: ${(error as Error).message}`);
  }
};
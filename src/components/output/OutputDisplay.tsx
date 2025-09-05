'use client';

import React from 'react';
import Image from 'next/image';
import useStore from '../../store/useStore';
import { downloadAsPDF, downloadImageAsPNG } from '../../utils/generate';
import { PaperSizes } from '../../types';

const PAPER_SIZES: PaperSizes = {
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  LETTER: { width: 216, height: 279 },
  LEGAL: { width: 216, height: 356 },
};

const OutputDisplay = () => {
  const { outputImages, deleteAllImages, deleteImage, paperSize } = useStore();

  const handleDownloadPDF = () => {
    if (outputImages.length === 0) {
      alert('Please generate images first.');
      return;
    }
    const size = PAPER_SIZES[paperSize as keyof typeof PAPER_SIZES] || PAPER_SIZES.A4;
    downloadAsPDF(outputImages, size);
  };

  return (
    <div className="w-full p-4 bg-[var(--elevation-background)] rounded-lg shadow-inner">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Generated Output</h3>
        {outputImages.length > 0 && (
          <div className="flex gap-2">
            <button onClick={deleteAllImages} className="text-sm bg-red-500/20 text-red-500 hover:bg-red-500/30 px-3 py-1 rounded-md">Delete All</button>
            <button onClick={handleDownloadPDF} className="text-sm bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 px-3 py-1 rounded-md">Download as PDF</button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {outputImages.map((image, index) => (
          <div key={index} className="relative group border-2 border-transparent hover:border-[var(--primary-color)] rounded-md overflow-hidden">
            <Image
              src={image}
              alt={`Generated page ${index + 1}`}
              width={200}
              height={282}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <button
                onClick={() => downloadImageAsPNG(image, `page-${index + 1}.png`)}
                className="text-white text-xs bg-gray-700/80 hover:bg-gray-600/80 rounded-full px-3 py-1 w-full"
              >
                PNG
              </button>
              <button
                onClick={() => deleteImage(index)}
                className="text-white text-xs bg-red-700/80 hover:bg-red-600/80 rounded-full px-3 py-1 w-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {outputImages.length === 0 && (
        <div className="text-center py-10 text-[var(--font-color-secondary)]">
          <p>Click &quot;Generate Image&quot; to see your output here.</p>
        </div>
      )}
    </div>
  );
};

export default OutputDisplay;

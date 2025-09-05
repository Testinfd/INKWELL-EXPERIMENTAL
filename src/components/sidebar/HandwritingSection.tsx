'use client';

import React from 'react';
import useStore from '../../store/useStore';
import { HandwritingFont } from '../../types';

interface HandwritingSectionProps {
  handwritingFonts: HandwritingFont[];
  expanded: boolean;
  onToggle: () => void;
}

const HandwritingSection: React.FC<HandwritingSectionProps> = ({ handwritingFonts, expanded, onToggle }) => {
  const {
    fontFamily,
    setFontFamily,
    randomizeHandwriting,
    setRandomizeHandwriting,
  } = useStore();

  const handleFontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;

      const fontName = `CustomFont-${Date.now()}`;
      const fontFace = new FontFace(fontName, `url(${e.target.result as string})`);
      document.fonts.add(fontFace);
      setFontFamily(fontName);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border border-[var(--field-borders)] rounded-lg">
      <button
        className="w-full flex justify-between items-center p-3 font-medium text-left"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span>Handwriting Style</span>
        <span className={`transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="p-4 border-t border-[var(--field-borders)] space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--font-color-secondary)] block mb-2" htmlFor="handwriting-font">
              Font Style
            </label>
            <select
              id="handwriting-font"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 bg-[var(--background-primary)] border border-[var(--field-borders)] rounded-md focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              {handwritingFonts.map((font) => (
                <option
                  key={font.value}
                  value={font.value}
                  style={font.style}
                >
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--font-color-secondary)] block mb-2" htmlFor="font-file">
              Upload Font <span className="text-xs bg-[var(--primary-color)] text-white rounded-full px-2 py-1">Beta</span>
            </label>
            <input
              accept=".ttf, .otf"
              type="file"
              id="font-file"
              onChange={handleFontFileChange}
              className="w-full text-sm text-[var(--font-color-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary-color)] file:text-white hover:file:bg-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="randomize-toggle" className="text-sm font-medium text-[var(--font-color-secondary)]">
                Randomize Handwriting
              </label>
              <label className="switch-toggle outer">
                <input
                  aria-checked={randomizeHandwriting}
                  checked={randomizeHandwriting}
                  onChange={() => setRandomizeHandwriting(!randomizeHandwriting)}
                  aria-label="Handwriting Randomization Button"
                  id="randomize-toggle"
                  type="checkbox"
                />
                <div></div>
              </label>
            </div>
            <p className="text-xs text-[var(--font-color-secondary)] italic mt-1">
              Adds subtle variations to letters and spacing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandwritingSection;

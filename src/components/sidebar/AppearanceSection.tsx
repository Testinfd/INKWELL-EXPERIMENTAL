'use client';

import React from 'react';
import useStore from '../../store/useStore';

interface AppearanceSectionProps {
  expanded: boolean;
  onToggle: () => void;
}

const inkColorPresets = [
  { color: "#000f55", name: "Blue" },
  { color: "#000000", name: "Black" },
  { color: "#ba3807", name: "Red" },
  { color: "#0b5394", name: "Navy Blue" },
  { color: "#38761d", name: "Green" },
  { color: "#351c75", name: "Purple" },
  { color: "#741b47", name: "Burgundy" }
];

const AppearanceSection: React.FC<AppearanceSectionProps> = ({ expanded, onToggle }) => {
  const {
    inkColor,
    setInkColor,
    fontSize,
    setFontSize,
  } = useStore();

  const handleFontSizeChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (numValue > 30) {
      alert('Font-size is too big, try up to 30');
      return;
    }
    setFontSize(value);
  };

  return (
    <div className="border border-[var(--field-borders)] rounded-lg">
      <button
        className="w-full flex justify-between items-center p-3 font-medium text-left"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span>Ink & Appearance</span>
        <span className={`transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="p-4 border-t border-[var(--field-borders)] space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--font-color-secondary)] block mb-2">Ink Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={inkColor}
                onChange={(e) => setInkColor(e.target.value)}
                className="p-1 h-10 w-10 rounded-md cursor-pointer"
                aria-label="Select ink color"
              />
              <input
                type="text"
                value={inkColor}
                onChange={(e) => setInkColor(e.target.value)}
                className="w-full p-2 bg-[var(--background-primary)] border border-[var(--field-borders)] rounded-md focus:ring-2 focus:ring-[var(--primary-color)]"
                aria-label="Ink color hex value"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {inkColorPresets.map(preset => (
                <button
                  key={preset.color}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 ${inkColor === preset.color ? 'border-[var(--primary-color)]' : 'border-transparent'}`}
                  style={{ backgroundColor: preset.color }}
                  onClick={() => setInkColor(preset.color)}
                  title={preset.name}
                  aria-label={`Set ink color to ${preset.name}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="font-size" className="text-sm font-medium text-[var(--font-color-secondary)] block mb-2">Font Size (pt)</label>
            <input
              id="font-size"
              min="1"
              step="0.5"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              type="number"
              className="w-full p-2 bg-[var(--background-primary)] border border-[var(--field-borders)] rounded-md focus:ring-2 focus:ring-[var(--primary-color)]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppearanceSection;

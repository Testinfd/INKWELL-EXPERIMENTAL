'use client';

import React from 'react';
import useStore from '../../store/useStore';

interface SpacingSectionProps {
  expanded: boolean;
  onToggle: () => void;
}

const SpacingSection: React.FC<SpacingSectionProps> = ({ expanded, onToggle }) => {
  const {
    topPadding,
    setTopPadding,
    wordSpacing,
    setWordSpacing,
    letterSpacing,
    setLetterSpacing,
  } = useStore();

  const handleLetterSpacingChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (numValue > 40) {
      alert('Letter-spacing is too big, try up to 40');
      return;
    }
    setLetterSpacing(value);
  };

  const handleWordSpacingChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (numValue > 100) {
      alert('Word-spacing is too big, try up to 100');
      return;
    }
    setWordSpacing(value);
  };

  return (
    <div className="border border-[var(--field-borders)] rounded-lg">
      <button
        className="w-full flex justify-between items-center p-3 font-medium text-left"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span>Spacing & Layout</span>
        <span className={`transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="p-4 border-t border-[var(--field-borders)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="top-padding" className="text-sm font-medium text-[var(--font-color-secondary)] block mb-2">Vertical Position</label>
              <input
                id="top-padding"
                min="0"
                value={topPadding}
                onChange={(e) => setTopPadding(e.target.value)}
                type="number"
                className="w-full p-2 bg-[var(--background-primary)] border border-[var(--field-borders)] rounded-md focus:ring-2 focus:ring-[var(--primary-color)]"
              />
            </div>
            <div>
              <label htmlFor="word-spacing" className="text-sm font-medium text-[var(--font-color-secondary)] block mb-2">Word Spacing</label>
              <input
                id="word-spacing"
                min="0"
                max="100"
                value={wordSpacing}
                onChange={(e) => handleWordSpacingChange(e.target.value)}
                type="number"
                className="w-full p-2 bg-[var(--background-primary)] border border-[var(--field-borders)] rounded-md focus:ring-2 focus:ring-[var(--primary-color)]"
              />
            </div>
          </div>
          <div>
            <label htmlFor="letter-spacing" className="text-sm font-medium text-[var(--font-color-secondary)] block mb-2">Letter Spacing</label>
            <input
              id="letter-spacing"
              min="-5"
              max="40"
              value={letterSpacing}
              onChange={(e) => handleLetterSpacingChange(e.target.value)}
              type="number"
              className="w-full p-2 bg-[var(--background-primary)] border border-[var(--field-borders)] rounded-md focus:ring-2 focus:ring-[var(--primary-color)]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpacingSection;

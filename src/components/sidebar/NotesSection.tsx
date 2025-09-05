'use client';

import React from 'react';
import useStore from '../../store/useStore';

interface NotesSectionProps {
  expanded: boolean;
  onToggle: () => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ expanded, onToggle }) => {
  const {
    hasMargins,
    setHasMargins,
    showExternalText,
    setShowExternalText,
    hasLines,
    setHasLines,
  } = useStore();

  return (
    <div className="border border-[var(--field-borders)] rounded-lg">
      <button
        className="w-full flex justify-between items-center p-3 font-medium text-left"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span>Notes & Margins</span>
        <span className={`transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="p-4 border-t border-[var(--field-borders)] space-y-4">
          <div className="flex justify-between items-center">
            <label htmlFor="paper-margin-toggle" className="text-sm font-medium text-[var(--font-color-secondary)]">
              Paper Margins
            </label>
            <label className="switch-toggle outer">
              <input
                aria-checked={hasMargins}
                checked={hasMargins}
                onChange={(e) => setHasMargins(e.target.checked)}
                aria-label="Paper Margin Button"
                id="paper-margin-toggle"
                type="checkbox"
              />
              <div></div>
            </label>
          </div>

          <div className="flex justify-between items-center">
            <label htmlFor="side-notes-toggle" className={`text-sm font-medium ${hasMargins ? 'text-[var(--font-color-secondary)]' : 'text-gray-500'}`}>
              Show Side & Top Notes
            </label>
            <label className="switch-toggle outer">
              <input
                disabled={!hasMargins}
                aria-checked={showExternalText}
                checked={showExternalText}
                onChange={() => setShowExternalText(!showExternalText)}
                aria-label="Side Notes Toggle Button"
                id="side-notes-toggle"
                type="checkbox"
              />
              <div></div>
            </label>
          </div>
          {!hasMargins && (
            <p className="text-xs text-[var(--accent-color)] italic mt-1">
              Enable margins to use notes
            </p>
          )}

          <div className="flex justify-between items-center">
            <label htmlFor="paper-line-toggle" className="text-sm font-medium text-[var(--font-color-secondary)]">
              Paper Lines
            </label>
            <label className="switch-toggle outer">
              <input
                aria-checked={hasLines}
                checked={hasLines}
                onChange={(e) => setHasLines(e.target.checked)}
                aria-label="Paper Line Button"
                id="paper-line-toggle"
                type="checkbox"
              />
              <div></div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesSection;

'use client';

import React from 'react';
import useStore from '../../store/useStore';
import { PageEffects } from '../../types';

interface PageSettingsSectionProps {
  pageEffects: PageEffects[];
  expanded: boolean;
  onToggle: () => void;
}

const PageSettingsSection: React.FC<PageSettingsSectionProps> = ({ pageEffects, expanded, onToggle }) => {
  const {
    paperSize,
    setPaperSize,
    pageEffect,
    setPageEffect,
    resolution,
    setResolution,
  } = useStore();

  const handlePaperFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      document.documentElement.style.setProperty(
        '--paper-bg-image',
        `url(${e.target.result as string})`
      );
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
        <span>Page Settings</span>
        <span className={`transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="p-4 border-t border-[var(--field-borders)] space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--font-color-secondary)] block mb-2" htmlFor="page-size">Page Size</label>
            <select
              id="page-size"
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
              className="w-full p-2 bg-[var(--background-primary)] border border-[var(--field-borders)] rounded-md focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              <option value="A4">A4</option>
              <option value="A5">A5</option>
              <option value="LETTER">Letter</option>
              <option value="LEGAL">Legal</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--font-color-secondary)] block mb-2" htmlFor="page-effects">Effects</label>
            <select
              id="page-effects"
              value={pageEffect}
              onChange={(e) => setPageEffect(e.target.value)}
              className="w-full p-2 bg-[var(--background-primary)] border border-[var(--field-borders)] rounded-md focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              {pageEffects.map((effect) => (
                <option key={effect.value} value={effect.value}>
                  {effect.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--font-color-secondary)] block mb-2" htmlFor="resolution">Resolution</label>
            <select
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full p-2 bg-[var(--background-primary)] border border-[var(--field-borders)] rounded-md focus:ring-2 focus:ring-[var(--primary-color)]"
            >
              <option value="0.8">Very Low</option>
              <option value="1">Low</option>
              <option value="2">Normal</option>
              <option value="3">High</option>
              <option value="4">Very High</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--font-color-secondary)] block mb-2" htmlFor="paper-file">
              Custom Paper Background
            </label>
            <input
              accept=".jpg, .jpeg, .png"
              type="file"
              id="paper-file"
              onChange={handlePaperFileChange}
              className="w-full text-sm text-[var(--font-color-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary-color)] file:text-white hover:file:bg-blue-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSettingsSection;

'use client';

import React, { useState } from 'react';
import { HandwritingFont, PageEffects } from '../../types';
import HandwritingSection from './HandwritingSection';
import AppearanceSection from './AppearanceSection';
import PageSettingsSection from './PageSettingsSection';
import SpacingSection from './SpacingSection';
import NotesSection from './NotesSection';

interface SidebarProps {
  handwritingFonts: HandwritingFont[];
  pageEffects: PageEffects[];
  generateImages: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handwritingFonts, pageEffects, generateImages }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('handwriting');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-[var(--elevation-background)] rounded-lg shadow-lg h-full flex flex-col">
      <div className="p-4 border-b border-[var(--field-borders)]">
        <h2 className="text-xl font-semibold text-center">Customizations</h2>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-2">
        <HandwritingSection
          handwritingFonts={handwritingFonts}
          expanded={expandedSection === 'handwriting'}
          onToggle={() => toggleSection('handwriting')}
        />
        <AppearanceSection
          expanded={expandedSection === 'appearance'}
          onToggle={() => toggleSection('appearance')}
        />
        <PageSettingsSection
          pageEffects={pageEffects}
          expanded={expandedSection === 'page'}
          onToggle={() => toggleSection('page')}
        />
        <SpacingSection
          expanded={expandedSection === 'spacing'}
          onToggle={() => toggleSection('spacing')}
        />
        <NotesSection
          expanded={expandedSection === 'notes'}
          onToggle={() => toggleSection('notes')}
        />
      </div>

      <div className="p-4 border-t border-[var(--field-borders)]">
        <button
          type="button"
          className="w-full bg-[var(--primary-color)] text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          onClick={generateImages}
        >
          Generate Image
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
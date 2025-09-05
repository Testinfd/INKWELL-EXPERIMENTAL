'use client';

import React, { useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import RichTextEditor from './RichTextEditor';
import PlaceholderOverlay from './PlaceholderOverlay';
import { htmlToSlateValue, slateValueToHtml } from '../utils/slate-serializer';
import 'katex/dist/katex.min.css';
import { Descendant } from 'slate';

const EXAMPLE_MAIN_TEXT = `<p>The laws of physics help us understand the natural world. For example, Newton's Second Law of Motion can be expressed as:</p>
<div>$$F = m \\cdot a$$</div>
<p>Where <em>F</em> is the net force applied, <em>m</em> is the mass of the object, and <em>a</em> is the acceleration.</p>`;

interface EnhancedPaperProps {
  paperRef: React.RefObject<HTMLDivElement | null>;
}

const EnhancedPaper: React.FC<EnhancedPaperProps> = ({ paperRef }) => {
  const {
    // State from store
    text,
    sideText,
    topText,
    inkColor,
    hasLines,
    hasMargins,
    fontFamily,
    fontSize,
    letterSpacing,
    wordSpacing,
    isExampleVisible,
    // Actions from store
    setText,
    setSideText,
    setTopText,
    toggleExampleText,
  } = useStore();

  const mainContent = React.useMemo(() => htmlToSlateValue(text), [text]);
  const sideContent = React.useMemo(() => htmlToSlateValue(sideText), [sideText]);
  const topContent = React.useMemo(() => htmlToSlateValue(topText), [topText]);

  const handleMainContentChange = (newValue: Descendant[]) => {
    setText(slateValueToHtml(newValue));
  };
  
  const handleSideContentChange = (newValue: Descendant[]) => {
    setSideText(slateValueToHtml(newValue));
  };

  const handleTopContentChange = (newValue: Descendant[]) => {
    setTopText(slateValueToHtml(newValue));
  };

  const getPaperClasses = () => {
    let classes = 'page-a enhanced-paper';
    if (hasLines) classes += ' lines';
    if (hasMargins) classes += ' margined';
    return classes;
  };

  return (
    <div ref={paperRef} className={getPaperClasses()} style={{ overflow: 'hidden', position: 'relative' }}>
        <div className="paper-content" style={{ position: 'relative' }}>
            <RichTextEditor
              value={mainContent}
              onChange={handleMainContentChange}
              inkColor={inkColor}
              fontFamily={fontFamily}
              fontSize={fontSize}
              letterSpacing={letterSpacing}
              wordSpacing={wordSpacing}
            />
            {isExampleVisible && (
              <PlaceholderOverlay
                exampleText={EXAMPLE_MAIN_TEXT}
                isActive={isExampleVisible}
                onDismiss={toggleExampleText}
                type="main"
              />
            )}
        </div>
        {hasMargins && (
          <>
            <div className="top-margin">
                <RichTextEditor
                value={topContent}
                onChange={handleTopContentChange}
                inkColor={inkColor}
                fontFamily={fontFamily}
                fontSize={fontSize}
                letterSpacing={letterSpacing}
                wordSpacing={wordSpacing}
                className="top-note-editor"
                />
            </div>
            <div className="left-margin">
                <RichTextEditor
                value={sideContent}
                onChange={handleSideContentChange}
                inkColor={inkColor}
                fontFamily={fontFamily}
                fontSize={fontSize}
                letterSpacing={letterSpacing}
                wordSpacing={wordSpacing}
                className="side-note-editor"
                />
            </div>
          </>
        )}
    </div>
  );
};

export default EnhancedPaper;

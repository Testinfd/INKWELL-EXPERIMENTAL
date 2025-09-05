'use client';

import React, { useRef, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import DrawingCanvas from '../components/DrawingCanvas';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateCanvases } from '../utils/generate';
import { sanitizeRichTextContent } from '../utils/sanitize';
import { PaperSizes } from '../types';
import 'katex/dist/katex.min.css';
import RichTextEditor from '../components/RichTextEditor';
import { slateValueToHtml, htmlToSlateValue } from '../utils/slate-serializer';
import ErrorBoundary from '../components/ErrorBoundary';
import useStore from '../store/useStore';
import OutputDisplay from '../components/output/OutputDisplay';
import PaperPreview from '../components/paper/PaperPreview';

const PAPER_SIZES: PaperSizes = {
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  LETTER: { width: 216, height: 279 },
  LEGAL: { width: 216, height: 356 },
};

const HANDWRITING_FONTS = [
  { 
    value: "'Homemade Apple', cursive", 
    label: "Homemade Apple",
    style: { fontFamily: 'Homemade Apple' }
  },
  { 
    value: "Hindi_Font", 
    label: "Kruti-dev(Hindi)" 
  },
  { 
    value: "'Caveat', cursive", 
    label: "Caveat",
    style: { fontFamily: 'Caveat', fontSize: '13pt' } 
  },
  { 
    value: "'Liu Jian Mao Cao', cursive", 
    label: "Liu Jian Mao Cao",
    style: { fontFamily: 'Liu Jian Mao Cao', fontSize: '13pt' } 
  }
];

const PAGE_EFFECTS = [
  { value: "shadows", label: "Shadows" },
  { value: "scanner", label: "Scanner" },
  { value: "no-effect", label: "No Effect" }
];

export default function Home() {
  // Destructure only the state and actions needed in this component
  const {
    text,
    sideText,
    topText,
    showExternalText,
    inkColor,
    fontSize,
    letterSpacing,
    wordSpacing,
    fontFamily,
    isDark,
    drawingCanvasVisible,
    isGenerating,
    pageEffect,
    resolution,
    paperSize,
    setText,
    setSideText,
    setTopText,
    setIsDark,
    setDrawingCanvasVisible,
    setIsGenerating,
    setOutputImages,
  } = useStore();

  // Constants
  const lineHeight = '1.5';
  
  // Refs
  const paperRef = useRef<HTMLDivElement>(null);
  const sideTextRef = useRef<HTMLDivElement>(null);
  const topTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, [setIsDark]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    if (paperRef.current) {
      const size = PAPER_SIZES[paperSize as keyof typeof PAPER_SIZES] || PAPER_SIZES.A4;
      const aspectRatio = size.height / size.width;
      
      const width = 400; 
      const height = width * aspectRatio;
      
      paperRef.current.style.width = `${width}px`;
      paperRef.current.style.height = `${height}px`;
    }
  }, [paperSize, paperRef]);

  const handleGenerateImages = async () => {
    const paperEl = paperRef.current;
    if (!paperEl) return;

    setIsGenerating(true);
    try {
      const canvases = await generateCanvases(paperEl, {
        resolution: parseFloat(resolution),
        pageEffect,
        fontFamily,
        fontSize: `${fontSize}pt`,
        lineHeight,
        letterSpacing: `${letterSpacing}px`,
        wordSpacing: `${wordSpacing}px`,
        inkColor,
      });
      const imageUrls = canvases.map((canvas) => canvas.toDataURL('image/jpeg'));
      setOutputImages(imageUrls);
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToPaper = (dataUrl: string) => {
    const imgTag = `<img src="${dataUrl}" style="max-width: 100%;" />`;
    setText(text + imgTag);
    setDrawingCanvasVisible(false);
  };

  const handleSideTextChange = (newHtml: string) => {
    setSideText(sanitizeRichTextContent(newHtml, true));
  };

  const handleTopTextChange = (newHtml: string) => {
    setTopText(sanitizeRichTextContent(newHtml, true));
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-[var(--background-primary)] text-[var(--font-color-primary)] p-4 lg:p-8">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-center text-3xl lg:text-4xl font-bold mb-6">
            Text to Handwriting
          </h1>

          {isGenerating && <LoadingSpinner />}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
            <div className="flex flex-col items-center gap-6">
              <PaperPreview paperRef={paperRef} />
              <OutputDisplay />
            </div>
                
            <div className="space-y-6">
              <Sidebar
                handwritingFonts={HANDWRITING_FONTS}
                pageEffects={PAGE_EFFECTS}
                generateImages={handleGenerateImages}
              />

              {/* External Text Editors */}
              {showExternalText && (
                <div className="notes-editor-container">
                  <fieldset>
                    <legend>Notes Configuration</legend>
                    <p>Add content to the side and top margins. These will appear in the margins when you have margins enabled.</p>
                    
                    <div className="side-text-area">
                      <label className="block">Side Notes:</label>
                      <div ref={sideTextRef} className="editor-area">
                        <RichTextEditor
                          value={htmlToSlateValue(sideText)}
                          onChange={(newValue) => {
                            const html = slateValueToHtml(newValue);
                            handleSideTextChange(html);
                          }}
                          inkColor={inkColor}
                          fontFamily={fontFamily}
                          fontSize={fontSize}
                          letterSpacing={letterSpacing}
                          wordSpacing={wordSpacing}
                          className="side-note-preview"
                        />
                      </div>
                    </div>
                    
                    <div className="top-text-area">
                      <label className="block">Top Notes:</label>
                      <div ref={topTextRef} className="editor-area">
                        <RichTextEditor
                          value={htmlToSlateValue(topText)}
                          onChange={(newValue) => {
                            const html = slateValueToHtml(newValue);
                            handleTopTextChange(html);
                          }}
                          inkColor={inkColor}
                          fontFamily={fontFamily}
                          fontSize={fontSize}
                          letterSpacing={letterSpacing}
                          wordSpacing={wordSpacing}
                          className="top-note-preview"
                        />
                      </div>
                    </div>
                  </fieldset>
                </div>
              )}

              {/* Font upload is now handled within the HandwritingSection of the sidebar */}
            </div>
          </div>
        </div>

        {drawingCanvasVisible && (
          <DrawingCanvas
            onClose={() => setDrawingCanvasVisible(false)}
            onAddToPaper={handleAddToPaper}
            inkColor={inkColor}
            visible={drawingCanvasVisible}
          />
        )}
        
        <button 
          type="button" 
          className="theme-toggle-button" 
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span className="fade-in-light" style={{ opacity: isDark ? 0 : 1 }}>☀️</span>
          <span className="fade-in-dark" style={{ opacity: isDark ? 1 : 0 }}>🌙</span>
        </button>
      </main>
    </ErrorBoundary>
  );
}
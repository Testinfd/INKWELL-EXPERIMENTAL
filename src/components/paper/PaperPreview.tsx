'use client';

import React from 'react';
import useStore from '../../store/useStore';
import EnhancedPaper from '../EnhancedPaper';

interface PaperPreviewProps {
  paperRef: React.RefObject<HTMLDivElement>;
}

const PaperPreview: React.FC<PaperPreviewProps> = ({ paperRef }) => {
  const {
    isExampleVisible,
    toggleExampleText,
    setDrawingCanvasVisible
  } = useStore();

  return (
    <div className="paper-wrapper">
      <EnhancedPaper paperRef={paperRef} />

      <div className="paper-actions">
        <button
          type="button"
          className="example-button"
          onClick={toggleExampleText}
          title="Toggle example text"
        >
          {isExampleVisible ? "Hide Example" : "Show Example"}
        </button>

        <button
          type="button"
          className="draw-button"
          onClick={() => setDrawingCanvasVisible(true)}
        >
          Add Drawing
        </button>
      </div>
    </div>
  );
};

export default PaperPreview;

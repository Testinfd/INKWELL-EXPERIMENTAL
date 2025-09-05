import { create } from 'zustand';
import { Descendant } from 'slate';
import { slateValueToHtml } from '../utils/slate-serializer';

// Hardcoded data that might be moved to a config file later
const EXAMPLE_MAIN_TEXT = `<p>The laws of physics help us understand the natural world. For example, Newton's Second Law of Motion can be expressed as:</p>
<div>$$F = m \\\\cdot a$$</div>
<p>Where <em>F</em> is the net force applied, <em>m</em> is the mass of the object, and <em>a</em> is the acceleration.</p>
<p>Another important equation in physics is Einstein's mass-energy equivalence:</p>
<div>$$E = mc^2$$</div>
<p>Where <em>E</em> represents energy, <em>m</em> represents mass, and <em>c</em> represents the speed of light in a vacuum.</p>
<p>The quadratic formula gives us the solution to equations in the form $ax^2 + bx + c = 0$:</p>
<div>$$x = \\\\frac{-b \\\\pm \\\\sqrt{b^2 - 4ac}}{2a}$$</div>`;

const EXAMPLE_SIDE_NOTE = `<p>Key formulas:</p>
<p>Velocity: $v = \\\\frac{d}{t}$</p>
<p>Acceleration: $a = \\\\frac{\\\\Delta v}{\\\\Delta t}$</p>
<p>Work: $W = F \\\\cdot d$</p>
<p>Kinetic Energy: $E_k = \\\\frac{1}{2}mv^2$</p>`;

const EXAMPLE_TOP_NOTE = `<p>Physics Notes - Chapter 4: Forces and Motion</p>`;

// State Interface
interface AppState {
  // Content State
  text: string;
  sideText: string;
  topText: string;
  isExampleVisible: boolean;

  // UI State
  showExternalText: boolean;
  isDark: boolean;
  drawingCanvasVisible: boolean;
  isGenerating: boolean;

  // Paper Styling State
  inkColor: string;
  fontSize: string;
  letterSpacing: string;
  wordSpacing: string;
  topPadding: string;
  fontFamily: string;
  hasLines: boolean;
  hasMargins: boolean;

  // Generation Settings
  pageEffect: string;
  resolution: string;
  paperSize: string;
  randomizeHandwriting: boolean;
  realisticEffects: boolean;
  selectedPaperTexture: string;
  customPaperTexture: string | null;

  // Output State
  outputImages: string[];
}

// Actions Interface
interface AppActions {
  // Content Actions
  setText: (text: string) => void;
  setSideText: (sideText: string) => void;
  setTopText: (topText: string) => void;
  toggleExampleText: () => void;

  // UI Actions
  setShowExternalText: (show: boolean) => void;
  setIsDark: (isDark: boolean) => void;
  setDrawingCanvasVisible: (visible: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;

  // Paper Styling Actions
  setInkColor: (color: string) => void;
  setFontSize: (size: string) => void;
  setLetterSpacing: (spacing: string) => void;
  setWordSpacing: (spacing: string) => void;
  setTopPadding: (padding: string) => void;
  setFontFamily: (font: string) => void;
  setHasLines: (hasLines: boolean) => void;
  setHasMargins: (hasMargins: boolean) => void;

  // Generation Settings Actions
  setPageEffect: (effect: string) => void;
  setResolution: (resolution: string) => void;
  setPaperSize: (size: string) => void;
  setRandomizeHandwriting: (randomize: boolean) => void;
  setRealisticEffects: (realistic: boolean) => void;
  setSelectedPaperTexture: (texture: string) => void;
  setCustomPaperTexture: (texture: string | null) => void;

  // Output Actions
  setOutputImages: (images: string[]) => void;
  deleteAllImages: () => void;
  deleteImage: (index: number) => void;
}

// Zustand Store
const useStore = create<AppState & AppActions>((set, get) => ({
  // Initial State
  text: '',
  sideText: '',
  topText: '',
  isExampleVisible: false,
  showExternalText: false,
  inkColor: '#000f55',
  fontSize: '10',
  letterSpacing: '0',
  wordSpacing: '0',
  topPadding: '5',
  fontFamily: "'Homemade Apple', cursive",
  isDark: false,
  hasLines: true,
  hasMargins: true,
  drawingCanvasVisible: false,
  isGenerating: false,
  pageEffect: 'shadows',
  resolution: '2',
  paperSize: 'A4',
  randomizeHandwriting: true,
  realisticEffects: true,
  selectedPaperTexture: "",
  customPaperTexture: null,
  outputImages: [],

  // Actions
  setText: (text) => set({ text }),
  setSideText: (sideText) => set({ sideText }),
  setTopText: (topText) => set({ topText }),
  toggleExampleText: () => {
    const isVisible = !get().isExampleVisible;
    set({
      isExampleVisible: isVisible,
      text: isVisible ? EXAMPLE_MAIN_TEXT : '',
      sideText: isVisible ? EXAMPLE_SIDE_NOTE : '',
      topText: isVisible ? EXAMPLE_TOP_NOTE : '',
    });
  },
  setShowExternalText: (show) => set({ showExternalText: show }),
  setIsDark: (isDark) => set({ isDark }),
  setDrawingCanvasVisible: (visible) => set({ drawingCanvasVisible: visible }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setInkColor: (color) => set({ inkColor: color }),
  setFontSize: (size) => set({ fontSize: size }),
  setLetterSpacing: (spacing) => set({ letterSpacing: spacing }),
  setWordSpacing: (spacing) => set({ wordSpacing: spacing }),
  setTopPadding: (padding) => set({ topPadding: padding }),
  setFontFamily: (font) => set({ fontFamily: font }),
  setHasLines: (hasLines) => set({ hasLines }),
  setHasMargins: (hasMargins) => set({ hasMargins }),
  setPageEffect: (effect) => set({ pageEffect: effect }),
  setResolution: (resolution) => set({ resolution }),
  setPaperSize: (size) => set({ paperSize: size }),
  setRandomizeHandwriting: (randomize) => set({ randomizeHandwriting: randomize }),
  setRealisticEffects: (realistic) => set({ realisticEffects: realistic }),
  setSelectedPaperTexture: (texture) => set({ selectedPaperTexture: texture }),
  setCustomPaperTexture: (texture) => set({ customPaperTexture: texture }),

  // Output Action Implementations
  setOutputImages: (images) => set({ outputImages: images }),
  deleteAllImages: () => set({ outputImages: [] }),
  deleteImage: (index) => {
    set((state) => ({
      outputImages: state.outputImages.filter((_, i) => i !== index),
    }));
  },
}));

export default useStore;

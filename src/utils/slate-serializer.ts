import { Descendant, Text, Element } from 'slate';

// Default Slate value when html is empty or during SSR
export const DEFAULT_SLATE_VALUE: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

type SlateNode = Descendant | Descendant[] | string | null;

// More modern approach to HTML conversion using the DOM
export const deserialize = (el: globalThis.Node): SlateNode => {
  if (el.nodeType === 3) {
    return { text: el.textContent || '' };
  } else if (el.nodeType !== 1) {
    return null;
  }

  const children: Descendant[] = Array.from(el.childNodes)
    .map((node) => deserialize(node))
    .flat()
    .filter((node): node is Descendant => node !== null && typeof node !== 'string');

  if (children.length === 0) {
    children.push({ text: '' });
  }

  const element = el as HTMLElement;
  
  switch (element.nodeName.toLowerCase()) {
    case 'body':
      return children;
    case 'br':
      return '\n';
    case 'p':
      return { type: 'paragraph', children };
    case 'strong':
    case 'b':
      return children.map((child) => ({ ...child, bold: true }));
    case 'em':
    case 'i':
      return children.map((child) => ({ ...child, italic: true }));
    case 'u':
      return children.map((child) => ({ ...child, underline: true }));
    case 'div':
    case 'span':
      if (element.classList.contains('math-formula')) {
        return {
          type: 'math',
          formula: element.dataset.formula || '',
          inline: element.dataset.inline === 'true',
          children: [{ text: '' }],
        };
      }
      if (element.nodeName.toLowerCase() === 'div') {
        return { type: 'paragraph', children };
      }
      return children;
    default:
      return children;
  }
};

// Helper function to convert KaTeX-style math to HTML Slate can understand
const convertMathToHtml = (html: string): string => {
  // Process block math formulas ($$...$$)
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    const encodedFormula = formula.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<div class="math-formula" data-formula="${encodedFormula}" data-inline="false">
      <span class="katex-formula">${encodedFormula}</span>
    </div>`;
  });

  // Process inline math formulas ($...$)
  html = html.replace(/\$([^$]+?)\$/g, (match, formula) => {
    const encodedFormula = formula.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<span class="math-formula" data-formula="${encodedFormula}" data-inline="true">
      <span class="katex-formula">${encodedFormula}</span>
    </span>`;
  });

  return html;
};

// Convert HTML to Slate's initial value format
export const htmlToSlateValue = (html: string): Descendant[] => {
  if (!html) {
    return DEFAULT_SLATE_VALUE;
  }

  // Return default value during server-side rendering
  if (typeof window === 'undefined') {
    return DEFAULT_SLATE_VALUE;
  }

  try {
    const processedHtml = convertMathToHtml(html);
    const doc = new DOMParser().parseFromString(processedHtml, 'text/html');
    const slateContent = deserialize(doc.body);
    return slateContent.length > 0 ? slateContent : DEFAULT_SLATE_VALUE;
  } catch (error) {
    console.error('Error parsing HTML to Slate value:', error);
    return DEFAULT_SLATE_VALUE;
  }
};

// Modern approach to serialize Slate nodes to HTML
export const serialize = (node: Descendant): string => {
  if (Text.isText(node)) {
    let string = node.text;
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    return string;
  }

  const children = node.children.map(n => serialize(n)).join('');

  if (Element.isElement(node)) {
    switch (node.type) {
      case 'paragraph':
        return `<p>${children}</p>`;
      case 'math':
        const isInline = node.inline;
        const tag = isInline ? 'span' : 'div';
        return `<${tag} class="math-formula" data-formula="${node.formula || ''}" data-inline="${isInline}">
          <span class="katex-formula">${node.formula || ''}</span>
        </${tag}>`;
      default:
        return children;
    }
  }

  return children;
};

// Convert Slate's value to HTML
export const slateValueToHtml = (value: Descendant[]): string => {
  return value.map(node => serialize(node)).join('');
}; 
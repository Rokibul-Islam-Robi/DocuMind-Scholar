import React, { useMemo } from 'react';
import katex from 'katex';

interface KaTeXRendererProps {
  content: string;
  className?: string;
  block?: boolean;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ content, className = '', block = false }) => {
  const renderedHTML = useMemo(() => {
    if (!content) return '';

    // If explicit block mode requested for pure LaTeX equation
    if (block) {
      const cleanLatex = content.replace(/^\$\$|\$\$$/g, '').trim();
      try {
        return katex.renderToString(cleanLatex, {
          displayMode: true,
          throwOnError: false,
        });
      } catch (e) {
        return `<pre class="text-xs text-rose-400 font-mono my-2">${cleanLatex}</pre>`;
      }
    }

    // --- STEP 1: Protect Math Expressions with Unique Placeholders ---
    const mathPlaceholders: { [key: string]: string } = {};
    let mathIndex = 0;

    // A. Block math $$...$$
    let protectedText = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      const key = `__MATH_BLOCK_${mathIndex++}__`;
      try {
        mathPlaceholders[key] = katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
        });
      } catch (e) {
        mathPlaceholders[key] = `<div class="katex-error text-xs text-amber-500 font-mono my-2">${math}</div>`;
      }
      return `\n\n${key}\n\n`;
    });

    // B. Inline math $...$
    protectedText = protectedText.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      const key = `__MATH_INLINE_${mathIndex++}__`;
      try {
        mathPlaceholders[key] = katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
        });
      } catch (e) {
        mathPlaceholders[key] = `<span class="katex-error text-xs text-amber-500 font-mono">${math}</span>`;
      }
      return key;
    });

    // --- STEP 2: Markdown Parsing ---
    // Helper to format inline elements (bold, italic, code, citations)
    const formatInline = (text: string): string => {
      let res = text;

      // Citations: `[Page X, Section: Y]` or `[Page X]`
      res = res.replace(/`(\[Page\s+[^\]]+\])`/g, '<span class="inline-flex items-center px-2 py-0.5 mx-1 rounded-md bg-indigo-50 border border-indigo-200 text-[#5442be] font-mono text-[11px] font-bold shadow-2xs">$1</span>');

      // Inline code `code`
      res = res.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[11px]">$1</code>');

      // Bold **text** or __text__
      res = res.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-black text-slate-900">$1</strong>');
      res = res.replace(/__([^_]+)__/g, '<strong class="font-black text-slate-900">$1</strong>');

      // Italic *text* or _text_
      res = res.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em class="italic text-slate-700">$2</em>$3');
      res = res.replace(/(^|[^_])_([^_]+)_([^_]|$)/g, '$1<em class="italic text-slate-700">$2</em>$3');

      return res;
    };

    // Split text into line chunks and process block structure
    const lines = protectedText.split(/\r?\n/);
    const htmlBlocks: string[] = [];
    let inList = false;
    let listType: 'ul' | 'ol' = 'ul';
    let currentParagraph: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const pText = currentParagraph.join('<br />');
        htmlBlocks.push(`<p class="my-2.5 leading-relaxed text-slate-700 font-normal">${formatInline(pText)}</p>`);
        currentParagraph = [];
      }
    };

    const closeList = () => {
      if (inList) {
        htmlBlocks.push(listType === 'ul' ? '</ul>' : '</ol>');
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Empty line
      if (!line) {
        flushParagraph();
        closeList();
        continue;
      }

      // Math block placeholder on its own
      if (/^__MATH_BLOCK_\d+__$/.test(line)) {
        flushParagraph();
        closeList();
        htmlBlocks.push(`<div class="my-3 overflow-x-auto text-center">${line}</div>`);
        continue;
      }

      // Headers
      if (line.startsWith('#### ')) {
        flushParagraph();
        closeList();
        htmlBlocks.push(`<h4 class="text-xs font-black text-slate-900 mt-3.5 mb-1.5 tracking-tight flex items-center space-x-1.5">${formatInline(line.slice(5))}</h4>`);
        continue;
      }
      if (line.startsWith('### ')) {
        flushParagraph();
        closeList();
        htmlBlocks.push(`<h3 class="text-sm font-black text-slate-900 mt-4 mb-2 tracking-tight flex items-center space-x-2 border-b border-slate-100 pb-1">${formatInline(line.slice(4))}</h3>`);
        continue;
      }
      if (line.startsWith('## ')) {
        flushParagraph();
        closeList();
        htmlBlocks.push(`<h2 class="text-base font-black text-slate-900 mt-4.5 mb-2 tracking-tight">${formatInline(line.slice(3))}</h2>`);
        continue;
      }
      if (line.startsWith('# ')) {
        flushParagraph();
        closeList();
        htmlBlocks.push(`<h1 class="text-lg font-black text-slate-900 mt-5 mb-2.5 tracking-tight">${formatInline(line.slice(2))}</h1>`);
        continue;
      }

      // Horizontal Rule
      if (/^(\-{3,}|\*{3,}|_{3,})$/.test(line)) {
        flushParagraph();
        closeList();
        htmlBlocks.push('<hr class="my-4 border-slate-200" />');
        continue;
      }

      // Bullet List (- item, * item, • item)
      const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
      if (bulletMatch) {
        flushParagraph();
        if (!inList || listType !== 'ul') {
          closeList();
          htmlBlocks.push('<ul class="my-2 space-y-1.5 pl-4 list-disc marker:text-[#6351d8]">');
          inList = true;
          listType = 'ul';
        }
        htmlBlocks.push(`<li class="text-slate-700 leading-relaxed pl-1">${formatInline(bulletMatch[1])}</li>`);
        continue;
      }

      // Numbered List (1. item, 2. item)
      const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (numberMatch) {
        flushParagraph();
        if (!inList || listType !== 'ol') {
          closeList();
          htmlBlocks.push('<ol class="my-2 space-y-1.5 pl-4 list-decimal marker:font-bold marker:text-[#6351d8]">');
          inList = true;
          listType = 'ol';
        }
        htmlBlocks.push(`<li class="text-slate-700 leading-relaxed pl-1">${formatInline(numberMatch[2])}</li>`);
        continue;
      }

      // Regular text line inside paragraph
      closeList();
      currentParagraph.push(line);
    }

    flushParagraph();
    closeList();

    let fullHTML = htmlBlocks.join('\n');

    // --- STEP 3: Restore Math Placeholders ---
    for (const [key, mathHTML] of Object.entries(mathPlaceholders)) {
      fullHTML = fullHTML.split(key).join(mathHTML);
    }

    return fullHTML;
  }, [content, block]);

  return (
    <div
      className={`katex-wrapper leading-relaxed text-slate-800 ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHTML }}
    />
  );
};

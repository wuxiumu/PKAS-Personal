import { useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const html = md.render(content);
      containerRef.current.innerHTML = html;
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`markdown-content ${className}`}
    />
  );
};


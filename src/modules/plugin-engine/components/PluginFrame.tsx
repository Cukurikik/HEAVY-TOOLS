import React, { useRef, useEffect } from 'react';

interface PluginFrameProps {
  htmlContent: string;
  cssContent?: string;
  jsContent?: string;
  className?: string;
}

export const PluginFrame: React.FC<PluginFrameProps> = ({ htmlContent, cssContent, jsContent, className }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          ${cssContent ? `<style>${cssContent}</style>` : ''}
        </head>
        <body>
          ${htmlContent}
          ${jsContent ? `<script>${jsContent}</script>` : ''}
        </body>
      </html>
    `);
    doc.close();
  }, [htmlContent, cssContent, jsContent]);

  return (
    <iframe
      ref={iframeRef}
      className={className}
      sandbox="allow-scripts" // Strict sandbox preventing top navigation, form submission, etc.
      style={{ border: 'none', width: '100%', height: '100%' }}
      title="Plugin Sandbox"
    />
  );
};

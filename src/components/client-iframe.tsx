// src/components/client-iframe.tsx
"use client";

interface ClientIframeProps {
  src: string;
  style?: React.CSSProperties;
  frameBorder?: string;
  allow?: string;
  title?: string;
}

const ClientIframe: React.FC<ClientIframeProps> = ({ src, style, frameBorder, allow, title }) => {
  return (
    <iframe
      src={src}
      style={style || { width: '100%', height: '100%', border: 'none' }}
      frameBorder={frameBorder}
      allow={allow}
      title={title || "Client Content"}
    />
  );
};

export default ClientIframe;

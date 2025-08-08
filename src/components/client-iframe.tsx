// src/components/client-iframe.tsx
"use client";

interface ClientIframeProps {
  src: string;
  // Add other potential props here
}

const ClientIframe: React.FC<ClientIframeProps> = ({ src }) => {
  return (
    <iframe
      src={src}
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="Client Content"
    />
  );
};

export default ClientIframe;

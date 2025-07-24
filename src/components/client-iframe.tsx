// src/components/client-iframe.tsx
"use client";

import React, { useEffect, useState } from 'react';

interface ClientIframeProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  // No specific props beyond standard iframe attributes for now
}

const ClientIframe: React.FC<ClientIframeProps> = ({ src, ...props }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // You can render a placeholder or null on the server/initial client render
    // to avoid hydration mismatch if src is dynamic or depends on client state.
    // For fixed src, this might not be strictly necessary but is good practice.
    return <div style={{ width: props.width || '100%', height: props.height || '400px' }} className="animate-pulse bg-muted rounded-md"></div>;
  }

  // Render the iframe only on the client after mount
  return <iframe src={src} {...props} />;
};

export default ClientIframe;

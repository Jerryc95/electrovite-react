import React from 'react';

interface BlurredOverlayProps {
  children: React.ReactNode;
  blur: number;
  allowed: boolean;
  text: string;
}

const BlurredOverlay: React.FC<BlurredOverlayProps> = ({
  children,
  blur,
  allowed,
  text,
}) => {
  return (
    <div>
      <div
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          filter: `blur(${blur}px)`,
          pointerEvents: allowed ? 'auto' : 'none',
        }}
      >
        {children}
      </div>
      {!allowed && (
        <div
          style={{
            position: 'absolute',
            top: '75%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'black',
            filter: 'none',
            font: 'bold 15px Arial, sans-serif',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default BlurredOverlay;

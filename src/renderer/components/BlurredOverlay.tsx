import React from 'react';

/**
 * Props for the BlurredOverlay component.
 * 
 * @property {React.ReactNode} children - The content to be displayed inside the overlay.
 * @property {number} blur - The amount of blur to apply to the content.
 * @property {boolean} allowed - Whether interaction with the content is allowed.
 * @property {string} text - The text to display when interaction is not allowed.
 */

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
    <div  style={{ position: 'relative' }}>
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
            textAlign: 'center',
            top: '50%',
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

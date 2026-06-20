import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// =========================================================================
// 1. TYPE DEFINITIONS
// =========================================================================
export type KioskOrientation = 'vertical' | 'horizontal';

export interface KioskOrientationContextValue {
  isVertical: boolean;
  orientation: KioskOrientation;
  toggleOrientation: () => void;
  setOrientation: (orientation: KioskOrientation) => void;
}

// =========================================================================
// 2. REACT CONTEXT
// =========================================================================
const KioskOrientationContext = createContext<KioskOrientationContextValue>({
  isVertical: true,
  orientation: 'vertical',
  toggleOrientation: () => {},
  setOrientation: () => {},
});

// =========================================================================
// 3. STANDALONE CSS TEMPLATE (Self-Injecting on Mount)
// =========================================================================
const KIOSK_STYLES = `
  /* --- Smooth Layout Transitions --- */
  .kiosk-transition-layout,
  .kiosk-transition-layout * {
    transition-property: width, height, flex-direction, padding, margin, font-size, border-radius;
    transition-duration: 300ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* --- Portrait Kiosk Mode Styles (data-orientation="vertical") --- */
  [data-orientation="vertical"] {
    font-size: 18px; /* Slightly larger base font for kiosk displays */
  }

  [data-orientation="vertical"] body,
  [data-orientation="vertical"] #root {
    height: 100dvh;
    overflow: hidden;
    max-width: 100vw;
    overflow-x: hidden;
  }

  /* Touch-friendly sizing */
  [data-orientation="vertical"] button,
  [data-orientation="vertical"] [role="button"] {
    min-height: 56px;
  }

  [data-orientation="vertical"] input,
  [data-orientation="vertical"] select,
  [data-orientation="vertical"] textarea {
    min-height: 60px;
    font-size: 1.1rem;
  }

  /* Natural stacking in Portrait grid */
  [data-orientation="vertical"] .kiosk-grid {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)) !important;
  }

  /* --- 4K Screen Adaptive Scaling (~55 inch terminals) --- */
  @media (min-width: 3000px) {
    [data-orientation="vertical"] {
      font-size: 28px;
    }
    [data-orientation="vertical"] button,
    [data-orientation="vertical"] [role="button"] {
      min-height: 96px;
    }
  }

  /* --- Idle Breathing Background Pulse --- */
  @keyframes kiosk-idle-pulse {
    0%, 100% { background-color: #f8fafc; }
    50%       { background-color: #f0f4ff; }
  }
  [data-orientation="vertical"] .kiosk-idle-bg {
    animation: kiosk-idle-pulse 6s ease-in-out infinite;
  }
`;

// =========================================================================
// 4. PROVIDER COMPONENT
// =========================================================================
export const KioskOrientationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial value from localStorage, default to vertical (Portrait kiosk)
  const [orientation, setOrientationState] = useState<KioskOrientation>(() => {
    if (typeof window === 'undefined') return 'vertical';
    const stored = localStorage.getItem('kiosk_orientation');
    return (stored === 'horizontal' || stored === 'vertical') ? stored : 'vertical';
  });

  const isVertical = orientation === 'vertical';

  const setOrientation = useCallback((newOrientation: KioskOrientation) => {
    setOrientationState(newOrientation);
    localStorage.setItem('kiosk_orientation', newOrientation);
    
    // Dispatch resize event so third-party components (maps, charts) auto-readjust
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }, []);

  const toggleOrientation = useCallback(() => {
    setOrientation(orientation === 'vertical' ? 'horizontal' : 'vertical');
  }, [orientation, setOrientation]);

  // Sync state to body element attribute
  useEffect(() => {
    document.body.setAttribute('data-orientation', orientation);
  }, [orientation]);

  // Inject standalone CSS styles automatically on mount
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const styleId = 'kiosk-standalone-orientation-styles';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.setAttribute('id', styleId);
      styleElement.innerHTML = KIOSK_STYLES;
      document.head.appendChild(styleElement);
    }

    return () => {
      // Cleanup styles on unmount
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  return (
    <KioskOrientationContext.Provider value={{ isVertical, orientation, toggleOrientation, setOrientation }}>
      {children}
    </KioskOrientationContext.Provider>
  );
};

// =========================================================================
// 5. CUSTOM HOOK
// =========================================================================
export const useKioskOrientation = () => useContext(KioskOrientationContext);

// =========================================================================
// 6. TOGGLE COMPONENT (Fully Styled, Responsive)
// =========================================================================
export const KioskOrientationToggleButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isVertical, toggleOrientation } = useKioskOrientation();

  return (
    <button
      onClick={toggleOrientation}
      className={`kiosk-toggle-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 16px',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1.5px solid #e2e8f0',
        borderRadius: '14px',
        fontWeight: 800,
        fontSize: '11px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        color: '#1e293b',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
      title={isVertical ? 'Switch to Landscape/Desktop Mode' : 'Switch to Kiosk/Portrait Mode'}
    >
      {/* Dynamic Icon */}
      {isVertical ? (
        // Monitor Icon
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ) : (
        // Smartphone Icon
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
        </svg>
      )}
      <span>{isVertical ? 'Landscape Mode' : 'Kiosk Mode'}</span>
    </button>
  );
};

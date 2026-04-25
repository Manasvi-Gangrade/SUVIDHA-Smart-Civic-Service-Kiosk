import { useEffect } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export const ScreenMagnifier = () => {
    const { magnifierEnabled } = useAccessibility();

    useEffect(() => {
        const rootElement = document.getElementById('root');
        if (!rootElement) return;

        if (!magnifierEnabled) {
            rootElement.style.transform = '';
            rootElement.style.transformOrigin = '';
            rootElement.style.transition = '';
            return;
        }

        let ticking = false;

        const handlePointerMove = (e: MouseEvent | TouchEvent) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    let clientX, clientY;
                    
                    if (e instanceof MouseEvent) {
                        clientX = e.clientX;
                        clientY = e.clientY;
                    } else if (e.touches && e.touches.length > 0) {
                        clientX = e.touches[0].clientX;
                        clientY = e.touches[0].clientY;
                    } else {
                        return;
                    }

                    rootElement.style.transformOrigin = `${clientX}px ${clientY}px`;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('touchmove', handlePointerMove, { passive: true });
        
        // Initial setup
        rootElement.style.transition = 'transform 0.2s ease-out';
        rootElement.style.transform = 'scale(1.4)';
        rootElement.style.transformOrigin = '50% 50%';
        rootElement.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('touchmove', handlePointerMove);
            rootElement.style.transform = '';
            rootElement.style.transformOrigin = '';
            rootElement.style.transition = '';
            rootElement.style.overflow = '';
        };
    }, [magnifierEnabled]);

    return null;
};

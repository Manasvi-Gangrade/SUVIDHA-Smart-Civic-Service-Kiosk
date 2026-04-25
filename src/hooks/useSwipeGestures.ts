import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useSwipeGestures = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      // Ensure it's a mostly horizontal swipe (min 80px distance, max 50px vertical drift)
      if (Math.abs(deltaX) > 80 && Math.abs(deltaY) < 50) {
        if (deltaX > 0) {
          // Swipe Right -> Go Back
          if (location.pathname !== '/' && location.pathname !== '/home') {
            navigate(-1);
            // Vibrate for physical feedback if supported
            if (navigator.vibrate) navigator.vibrate(50);
          }
        } else {
          // Swipe Left -> Try to find a "submit" or "next" button and click it
          const nextBtn = document.querySelector('button[type="submit"], .swipe-next') as HTMLButtonElement;
          if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
            if (navigator.vibrate) navigator.vibrate(50);
          }
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate, location.pathname]);
};

export const GlobalSwipeGestures = () => {
  useSwipeGestures();
  return null;
};

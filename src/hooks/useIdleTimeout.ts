import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const IDLE_TIMEOUT_MS = 60000; // 60 seconds

export const useIdleTimeout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const resetIdleTimer = () => {
            clearTimeout(timeout);

            // If we are not on the home page, start the timer
            if (location.pathname !== '/') {
                timeout = setTimeout(() => {
                    // Time's up! Reset the kiosk.
                    navigate('/');
                }, IDLE_TIMEOUT_MS);
            }
        };

        // Listen to user interactions
        window.addEventListener('mousemove', resetIdleTimer);
        window.addEventListener('mousedown', resetIdleTimer);
        window.addEventListener('keypress', resetIdleTimer);
        window.addEventListener('touchstart', resetIdleTimer);
        window.addEventListener('scroll', resetIdleTimer, true);

        resetIdleTimer(); // Init

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('mousemove', resetIdleTimer);
            window.removeEventListener('mousedown', resetIdleTimer);
            window.removeEventListener('keypress', resetIdleTimer);
            window.removeEventListener('touchstart', resetIdleTimer);
            window.removeEventListener('scroll', resetIdleTimer, true);
        };
    }, [navigate, location.pathname]);
};

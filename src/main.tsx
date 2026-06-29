import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n"; // Import i18n configuration

// Check for hardware rotation overrides in URL (e.g., ?rotate=left)
const urlParams = new URLSearchParams(window.location.search);
const rotateParam = urlParams.get('rotate');
if (rotateParam) {
    if (rotateParam === 'none') {
        localStorage.removeItem('kiosk_hardware_rotate');
    } else {
        localStorage.setItem('kiosk_hardware_rotate', rotateParam);
    }
    // Remove it from URL to keep it clean
    window.history.replaceState({}, '', window.location.pathname);
}

const hardwareRotate = localStorage.getItem('kiosk_hardware_rotate');
const rootElement = document.getElementById("root");

if (rootElement) {
    if (hardwareRotate === 'left') {
        rootElement.classList.add("hardware-rotate-left");
    } else if (hardwareRotate === 'right') {
        rootElement.classList.add("hardware-rotate-right");
    }
    
    createRoot(rootElement).render(
        <Suspense fallback="Loading Translations...">
            <App />
        </Suspense>
    );
}

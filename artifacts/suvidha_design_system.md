# Design System & Style Guide: SUVIDHA Smart Civic Service Kiosk
> **Ecosystem:** SUVIDHA Unified Civic Kiosk  
> **Target Display:** 55" Vertical Touch Display (16:9 Aspect Ratio / 4K UHD)  
> **Aesthetic Theme:** Modern Civic Premium (Trust, Accessibility, and Security)

---

## 1. Visual Design Philosophy

The design system of SUVIDHA is engineered to evoke **trust, stability, and high-tech utility**. Civic portals often look bureaucratic and intimidating; SUVIDHA transforms this experience using a curated visual framework:
* **Trust & Authority:** Grounded in a deep, premium navy blue.
* **National Dignity:** Energetic saffron accents representing the spirit of civic service.
* **Modernity:** Smooth glassmorphic components, floating gradient aurora blobs, and clean card-based layouts.

---

## 2. Core Color Palette & Design Tokens

The SUVIDHA kiosk uses a structured system of CSS-variables defined in `src/index.css` that maps to specific HEX, RGB, and HSL codes to handle light, dark, and high-contrast themes natively.

### 2.1 Brand & Semantic Palette

| Color Token | Visual Preview | HEX Code | RGB Code | HSL Code | Semantic Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Navy** | 🟦 | `#162D5A` | `rgb(22, 45, 90)` | `hsl(220, 60%, 22%)` | Brand identity, headers, primary buttons, deep panels. |
| **Secondary Saffron** | 🟧 | `#FF8000` | `rgb(255, 128, 0)` | `hsl(33, 100%, 50%)` | Alerts, high-priority highlights, active tabs, floating actions. |
| **Teal Secondary** | 🟩 | `#389494` | `rgb(56, 148, 148)` | `hsl(180, 45%, 40%)` | Navigation grids, secondary department cards, utility badges. |
| **Success Green** | 🟢 | `#30A675` | `rgb(48, 166, 117)` | `hsl(145, 55%, 42%)` | Success alerts, verification ticks, approved bills, paid states. |
| **Destructive Red** | 🔴 | `#E62E2E` | `rgb(230, 46, 46)` | `hsl(0, 72%, 51%)` | Error flags, disconnection notices, cancel buttons, warnings. |
| **Kiosk Surface** | ⬜ | `#F6F7F9` | `rgb(246, 247, 249)` | `hsl(220, 20%, 97%)` | Kiosk panel backgrounds, content layout backgrounds. |

---

### 2.2 Contrast Theme Mappings

When the user toggles a different screen contrast option (such as High Contrast Mode for low-vision users or Dark Mode for energy saving/night setups), the variables map as follows:

#### A. Standard Light Mode (Default Kiosk Interface)
* **`--background`**: `#F6F7F9` | `rgb(246, 247, 249)` | `hsl(220, 20%, 97%)`
* **`--foreground`**: `#141F33` | `rgb(20, 31, 51)` | `hsl(220, 40%, 13%)`
* **`--card`**: `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)`
* **`--border`**: `#DEE2E8` | `rgb(222, 226, 232)` | `hsl(220, 15%, 88%)`
* **`--primary`**: `#162D5A` | `rgb(22, 45, 90)` | `hsl(220, 60%, 22%)`
* **`--secondary`**: `#FF8000` | `rgb(255, 128, 0)` | `hsl(33, 100%, 50%)`

#### B. Dark Mode Theme (Night / Low Emission Mode)
* **`--background`**: `#0C111C` | `rgb(12, 17, 28)` | `hsl(220, 40%, 8%)`
* **`--foreground`**: `#E9ECEF` | `rgb(233, 236, 239)` | `hsl(220, 15%, 92%)`
* **`--card`**: `#141B29` | `rgb(20, 27, 41)` | `hsl(220, 35%, 12%)`
* **`--border`**: `#263248` | `rgb(38, 50, 72)` | `hsl(220, 30%, 20%)`
* **`--primary`**: `#FF8000` | `rgb(255, 128, 0)` | `hsl(33, 100%, 50%)` (Saffron primary focus in Dark mode)
* **`--secondary`**: `#2A3A54` | `rgb(42, 58, 84)` | `hsl(220, 50%, 25%)`

#### C. High Contrast Mode (Accessibility Focus)
* **`--background`**: `#000000` | `rgb(0, 0, 0)` | `hsl(0, 0%, 0%)` (Pure Black)
* **`--foreground`**: `#FFFF00` | `rgb(255, 255, 0)` | `hsl(60, 100%, 50%)` (Glowing Neon Yellow)
* **`--card`**: `#0D0D0D` | `rgb(13, 13, 13)` | `hsl(0, 0%, 5%)` (Off-black border boundary)
* **`--border`**: `#FFFF00` | `rgb(255, 255, 0)` | `hsl(60, 100%, 50%)`
* **`--primary`**: `#FFFF00` | `rgb(255, 255, 0)` | `hsl(60, 100%, 50%)`
* **`--secondary`**: `#333333` | `rgb(51, 51, 51)` | `hsl(0, 0%, 20%)`

---

## 3. Typography & Scaling System

### Proportional Kiosk Scaling (Critical Innovation)
Since Kiosk terminals are displayed on standard 21.5" desktop screens or massive 55" vertical displays, the UI uses **dynamic viewport-based rem sizing** to scale seamlessly like a vector image.

```css
html, body {
  /* Locks the base font-size (and rem multipliers) strictly to 16:9 dimensions */
  font-size: min(0.8333vw, 1.481vh); 
}
```
* **Result:** The layouts never break, wrap awkwardly, or overflow. It maintains structural symmetry on any display size.

### Typefaces
* **Display Font (Headings, Titles):** `Plus Jakarta Sans` — bold, modern, geometric curves for quick readability.
* **Body Font (Labels, Instructions):** `Inter` — hyper-legible, high x-height sans-serif suited for touch operations.
* **Dyslexic Assist Font:** `OpenDyslexic` (Switches the font family site-wide via user settings to assist reading).

---

## 4. Layout & UI Component Architecture

All UI components are built around **touch safety guidelines** with an active bounding box of at least **`48px x 48px`** (often scaled to `64px` for primary actions) to support motor-impaired and elderly citizens.

### Cards & Shading
* **Standard Card:** Smooth white card with `1rem` rounded corners (`border-radius: 16px`) and subtle drop-shadows.
* **Active State:** Border glows with the saffron hue and floats upwards by `-8px` using transition animations.
* **Glassmorphism (`.glass-card`):**
  ```css
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  ```

---

## 5. Accessibility Specific UI Rules

### 1. High Contrast Neon Scheme
Designed for low-vision users. Employs a pure black background (`#000000`) and glowing neon-yellow indicators (`#ffff00`). Colors like red and green are translated to dual shapes and check-mark symbols to prevent reliance on color perception alone.

### 2. Privacy Shielding
* **Objective:** Prevents "shoulder surfing" (strangers reading Aadhaar numbers or phone entries).
* **Implementation:** Inputs are automatically blurred by 5px when out of focus.
  ```css
  .privacy-mode input {
    filter: blur(5px);
    transition: filter 0.2s ease;
  }
  .privacy-mode input:focus {
    filter: blur(0px);
  }
  ```

### 3. Audio & Voice Prompts
* Synthesized speech using the browser’s Web Speech API reads labels, actions, and confirmations out loud.

---

## 6. Micro-Animations & Dynamic Feedback

* **Floating Hero Blobs:** Ambient background gradients slide organically using CSS keyframes:
  ```css
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  ```
* **Success Checkmark:** Animated vector line drawers render when application transactions complete, providing visual satisfaction.

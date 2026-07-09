import React, { useState, useEffect } from "react";
import { Eye, Type, Sun, Moon } from "lucide-react";

export default function AccessibilityBar() {
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeFont) {
      document.body.classList.add("large-font");
    } else {
      document.body.classList.remove("large-font");
    }
  }, [largeFont]);

  useEffect(() => {
    if (lightTheme) {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [lightTheme]);

  return (
    <nav className="accessibility-bar" aria-label="Accessibility controls">
      <button
        type="button"
        className={`acc-button ${highContrast ? "active" : ""}`}
        onClick={() => setHighContrast(!highContrast)}
        aria-pressed={highContrast}
        title="Toggle High Contrast Mode"
      >
        <Eye size={16} />
        <span>High Contrast</span>
      </button>

      <button
        type="button"
        className={`acc-button ${largeFont ? "active" : ""}`}
        onClick={() => setLargeFont(!largeFont)}
        aria-pressed={largeFont}
        title="Toggle Large Font Mode"
      >
        <Type size={16} />
        <span>Large Font</span>
      </button>

      <button
        type="button"
        className={`acc-button ${lightTheme ? "active" : ""}`}
        onClick={() => setLightTheme(!lightTheme)}
        aria-pressed={lightTheme}
        title="Toggle Theme"
      >
        {lightTheme ? <Moon size={16} /> : <Sun size={16} />}
        <span>{lightTheme ? "Dark Mode" : "Light Mode"}</span>
      </button>
    </nav>
  );
}

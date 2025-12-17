// useIsMobile.js
import { useState, useEffect } from "react";

export const useIsMobile = () => {
  const mediaQuery = "(max-width: 768px)";

  // Initialize state based on the current match
  const [isMobileDevice, setIsMobileDevice] = useState(() =>
    window.matchMedia(mediaQuery).matches
  );

  useEffect(() => {
    const mediaObject = window.matchMedia(mediaQuery);

    // Runs only when the media query match changes
    const handleChange = (event) => {
      setIsMobileDevice(event.matches);
    };

    // Listen for changes
    mediaObject.addEventListener("change", handleChange);

    // Cleanup: remove the listener on unmount
    return () => {
      mediaObject.removeEventListener("change", handleChange);
    };
  }, []);

  return { isMobileDevice };
};

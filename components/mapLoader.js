import { useEffect, useState } from 'react';

const MapLoader = ({ apiKey, children }) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMapsScript = async () => {
      if (typeof google === 'undefined') {
        try {
          const googleMapsScript = document.createElement('script');
          googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          googleMapsScript.async = true;

          const scriptLoaded = new Promise((resolve, reject) => {
            googleMapsScript.onload = resolve;
            googleMapsScript.onerror = reject;
          });

          document.head.appendChild(googleMapsScript);

          await scriptLoaded;

          setScriptLoaded(true);
        } catch (error) {
          console.error('Error loading Google Maps API:', error);
        }
      } else {
        setScriptLoaded(true);
      }
    };

    loadGoogleMapsScript();

    return () => {
      const googleMapsScript = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (googleMapsScript) {
        googleMapsScript.remove();
      }
    };
  }, [apiKey]);

  return scriptLoaded ? children : null;
};

export default MapLoader;

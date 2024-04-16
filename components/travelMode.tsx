import React, { useState } from 'react';
import carIcon from '../public/car.png';
import bikeIcon from '../public/bike.png';
import transitIcon from '../public/transit.png';
import walkingIcon from '../public/walking.png';


type TravelModeSelectorProps = {
  setTravelMode: (mode: google.maps.TravelMode) => void;
  currentMode: google.maps.TravelMode;
};



const TravelModeSelector: React.FC<TravelModeSelectorProps> = ({ setTravelMode, currentMode  }) => {
const [selectedMode, setSelectedMode] = useState(currentMode); // Default to DRIVING
  const handleModeChange = (mode: google.maps.TravelMode) => {
    console.log(`Changing mode to: ${mode}`);
    setTravelMode(mode);
    setSelectedMode(mode);
  };
  
  // Function to determine the style based on the selected mode
  const getStyle = (mode: google.maps.TravelMode) => ({
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    borderRadius: '50%',  // Makes the border circular
    backgroundColor: mode === selectedMode ? 'lightblue' : 'transparent',  // Applies a light blue background if selected
    border: mode === selectedMode ? '0px solid blue' : 'none',  // Keeps the border blue and solid when selected
    display: 'flex',  // Ensures content (icon) is centered
    alignItems: 'center',  // Aligns icon vertically
    justifyContent: 'center',  // Aligns icon horizontally
    padding: '5px'  // Optional: adds some spacing inside the circle
});

  

  return (
    <div key={selectedMode} style={{ display: 'flex', justifyContent: 'space-around' }}>
        
      <img 
        src={carIcon.src} 
        alt="Car" 
        style={getStyle(google.maps.TravelMode.DRIVING)} 
        onClick={() => handleModeChange(google.maps.TravelMode.DRIVING)}
      />
      <img 
        src={bikeIcon.src} 
        alt="Bike" 
        style={getStyle(google.maps.TravelMode.BICYCLING)} 
        onClick={() => handleModeChange(google.maps.TravelMode.BICYCLING)}
      />
      <img 
        src={transitIcon.src} 
        alt="Transit" 
        style={getStyle(google.maps.TravelMode.TRANSIT)} 
        onClick={() => handleModeChange(google.maps.TravelMode.TRANSIT)}
      />
      <img 
        src={walkingIcon.src} 
        alt="Walking" 
        style={getStyle(google.maps.TravelMode.WALKING)} 
        onClick={() => handleModeChange(google.maps.TravelMode.WALKING)}
      />
    </div>
  );
};

export default TravelModeSelector;

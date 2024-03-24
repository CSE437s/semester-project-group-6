import { React, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  Button,
  InputLabel,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers-pro";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { ref, getDatabase, push } from "firebase/database";
import { auth } from "../firebase/firebase";
import { useAuth } from "../firebase/auth";
import stockPhoto from "../public/f1.png";
import usePlacesAutocomplete from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxPopover, ComboboxList } from "@reach/combobox";
import { useLoadScript } from "@react-google-maps/api";



export default function Trips() {
  const [tripTitle, setTripTitle] = useState("");
  const [tripDestination, setTripDestination] = useState("");
  const [isTripModalOpen, setTripModal] = useState(false);
  const [startDate, setstartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selected, setSelected] = useState(null);

  const { authUser } = useAuth();
  const db = getDatabase();
  const tripDatabaseRef = ref(db, "trips/");
  const openTripModal = () => {
    setTripModal(!isTripModalOpen);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBffWM5IfZJ35qk-UNXUydS8RQTJpeM9x0',
    libraries: ["places"],
  })


  const handleAddTrip = () => {
    if (!tripTitle.trim()) {
      alert("Please enter a valid trip title");
      return;
    }

    const startDateObj = startDate.format("YYYY-MM-DD");
    const endDateObj = startDate.format("YYYY-MM-DD");

    console.log(startDateObj);
    console.log(tripDestination);

    // Use the push method to generate a unique key for the new trip
    const newTripRef = push(tripDatabaseRef, {
      trip_name: tripTitle,
      trip_owner: authUser.uid,
      start_date: startDateObj,
      end_date: endDateObj,
      trip_dest: tripDestination,
      participants: [{
        id: authUser.uid,
        ImageURL: stockPhoto.src
      }],
      activities: []
    });

    setTripTitle("");
    setTripModal(false);
    setstartDate(null)
    setEndDate(null)
  };


  const PlacesAutocomplete = ({ setSelected , setTripDestination }) => {
    const {
      ready,
      value,
      setValue,
      suggestions: {status, data},
      clearSuggestions,
    } = usePlacesAutocomplete();
  
    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();
    
      try {
        // Use the selected address to get the placeId
        const results = await geocodeByAddress(address);
        const placeId = results[0].place_id;
    
        // Then use the placeId to get more details including the state
        const moreResults = await geocodeByPlaceId(placeId);
        const addressComponents = moreResults[0].address_components;
        const stateComponent = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
        
        if (stateComponent) {
          const state = stateComponent.short_name;
          setTripDestination(state); // Set the state abbreviation as trip destination
          setSelected({ address, placeId }); // Now storing both address and placeId
        }
      } catch (error) {
        console.error("Error getting place details: ", error);
      }
    };



  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Button variant="outlined" onClick={openTripModal}>
          Add Trip
        </Button>

        <Dialog open={isTripModalOpen} onClose={openTripModal}>
          <DialogTitle> Create New Trip</DialogTitle>
          <div className="Trip-Container">
            <input
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              placeholder="Trip Title"
              className="trip-title-input"
            />
            <DatePicker
              value={startDate}
              closeOnSelect={true}
              label="Start Date"
              onChange={(newValue) => {
                setstartDate(newValue);
              }}
            />
            <DatePicker
              value={endDate}
              closeOnSelect={true}
              label="End Date"
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
            />
            
            <Combobox onSelect={handleSelect} aria-labelledby="Destination">
              <ComboboxInput 
                value = {value} 
                onChange={ e=> setValue(e.target.value)}
                disabled={!ready}
                className="combobox-input"
                placeholder=" Destination *"
                />
                <ComboboxPopover className="combobox-popover">
                  <ComboboxList>
                    {status === "OK" && 
                      data.map(({place_id, description}) => (
                      <ComboboxOption className="combobox-option" key = {place_id} value={description} onClick={() => handleSelect(description, place_id)}/>
                      ))}  
                  </ComboboxList>
                </ComboboxPopover>
            </Combobox>

            <Button variant="contained" size="large" onClick={handleAddTrip}>
              Add Trip
            </Button>
          </div>
        </Dialog>
      </LocalizationProvider>
    </>
  );
}

}
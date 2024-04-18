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
import { ref, getDatabase, push, set } from "firebase/database";
import { auth } from "../firebase/firebase";
import { useAuth } from "../firebase/auth";
import stockPhoto from "../public/f1.png";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";
import PlacesAutocomplete from "./placesAutocomplete"
const stockProfile = "https://firebasestorage.googleapis.com/v0/b/tripify-93d9a.appspot.com/o/images%2FBeautiful%20China%205k.jpg-3f9b964c-ff0a-48fb-a910-6b64820df9e7?alt=media&token=5edab783-615c-4838-9d8d-c4ca91b39e1c";



export default function Trips({setUserTrips}) {
  const [tripTitle, setTripTitle] = useState("");
  const [tripDestination, setTripDestination] = useState("");
  const [isTripModalOpen, setTripModal] = useState(false);
  const [startDate, setstartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [placeID, setPlaceID] = useState("");
  const [tripNotes, setTripNotes] = useState("");
  const [tempNotes, setTempNotes] = useState("");


  const { authUser } = useAuth();
  const db = getDatabase();
  const tripDatabaseRef = ref(db, "trips/");

  const openTripModal = () => {
    setTripModal(!isTripModalOpen);
  };

  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: 'AIzaSyBffWM5IfZJ35qk-UNXUydS8RQTJpeM9x0',
  //   libraries: ["places"],
  // })

  const handleSaveNotes = () => {
      setTripNotes(tempNotes);  // Save the temporary notes to the main state
      alert('Notes saved successfully!');
  };

  const handleAddTrip = () => {
    if (!tripTitle.trim()) {
      alert("Please enter a valid trip title");
      return;
      
    }
    if (!startDate || !endDate) {
      alert("Please select start and end dates");
      return;
    }
  
    if (endDate.isBefore(startDate)) {
      alert("End date must be after start date");
      return;
    }

    const startDateObj = startDate.format("YYYY-MM-DD");
    const endDateObj = endDate.format("YYYY-MM-DD");


    const userProfile = {
      uid: authUser.uid,
      email: authUser.email || 'No email provided',
      profilePicURL: authUser.photoURL || stockProfile,
      firstName: authUser.firstName || 'Unknown',
      lastName: authUser.lastName || 'User',
      // Include any other necessary properties
    };
  
    const newTrip = {
      trip_name: tripTitle,
      trip_owner: authUser.uid,
      start_date: startDateObj,
      end_date: endDateObj,
      trip_dest: tripDestination,
      place_id: placeID,
      participants: [userProfile], // Use the userProfile object
      activities: [],
      trip_notes: tripNotes
    }

    const newTripRef = push(tripDatabaseRef, newTrip)
   .then(() => {
      // Handle success, reset form, close modal, etc.
      setTripTitle("");
      setTripModal(false);
      setStartDate(null);
      setEndDate(null);
      setUserTrips((prev)=> [...prev, newTrip]);
      setTripNotes("");
    }).catch((error) => {
      // Handle any errors here
      console.error("Error adding new trip: ", error);
    });
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}> 
      <div className="AddTrip-Button">
        <Button 
          variant="contained" 
          onClick={openTripModal} 
          size="large"
        >
          Add Trip
        </Button>
      </div>
        <Dialog open={isTripModalOpen} onClose={openTripModal}>
          <DialogTitle> Create New Trip</DialogTitle>
          <div className="Trip-Container">
            <TextField
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              placeholder="Trip Title"
              className="trip-title-input"
              required
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

            <PlacesAutocomplete placeID={placeID} setPlaceID={setPlaceID} tripDestination={tripDestination} setTripDestination={setTripDestination}></PlacesAutocomplete>
            
            <TextField
              multiline
              rows={4}
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}  // Update temporary notes
              placeholder="Enter your notes here..."
              variant="outlined"
              fullWidth
            />
            <Button onClick={handleSaveNotes} variant="contained" color="primary">
              Save Notes
            </Button>

            <Button variant= "contained" size="large" onClick={handleAddTrip}>
              Add Trip
            </Button>

            

          </div>
        </Dialog>
      </LocalizationProvider>
    </>
  );
}


import React, { useState, useEffect, useRef, memo, FC } from "react";
import TripCard from "../../components/TripCard";
import ActivityCard from "../../components/ActivityCard";
import { useRouter } from "next/router";
import styles from "../ActivityList.module.css";
import { ref, get, set, remove } from "firebase/database";
import { db } from "../../firebase/firebase";
import { TripCardData , ActivityInfo} from "../../CustomTypes";
import NavBar from "../../components/AppAppBar";
import Map from "../../pages/map";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Distance from "../../components/distance";
import { geocode } from "react-geocode";
import MapLoader from "../../components/mapLoader";
import Image from "next/image";
import trashIcon from "../../public/trashIcon.png";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { useAuth } from "../../firebase/auth";
import mapIcon from '../../public/mapIcon.png';
import listIcon from '../../public/listIcon.png';
import TravelModeSelector from '../../components/travelMode';
import TextField from '@mui/material/TextField';

interface NotesInputProps {
  editNotes: string;
  setEditNotes: React.Dispatch<React.SetStateAction<string>>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;

type User = {
  email: string;
  uid: string;
};


export const ActivityList: React.FC = () => {
  const { authUser } = useAuth();

  const router = useRouter();
  const { tripId } = router.query as { tripId: string };
  const [curTripData, setTripData] = useState<TripCardData>();
  const [deleteModal, openDelete] = useState(false);
  const [tripNotes, setTripNotes] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [office, setOffice] = useState<LatLngLiteral | null>(
    {} as LatLngLiteral
  );
  const [directions, setDirections] = useState<DirectionsResult | null>(
    {} as DirectionsResult
  );
  const [travelMode, setTravelMode] = React.useState<google.maps.TravelMode>(google.maps.TravelMode.DRIVING);

  useEffect(() => {
    if (tripId) {
      fetchTripData();
    }
    console.log(curTripData);
  }, [tripId]);
  
  useEffect(() => {
    setEditNotes(tripNotes);
  }, [tripNotes]);

  const fetchTripData = async () => {
    try {
      const tripDatabaseRef = ref(db, "trips/" + tripId);
      const tripSnapshot = await get(tripDatabaseRef);
      if (tripSnapshot.exists()) {
        const data = tripSnapshot.val();
        setTripData(data);
        setTripNotes(data.trip_notes || "");
      } else {
        console.error(`Trip with ID ${tripId} not found.`);
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
    }
  };

  const deleteTrip = () => {
    const tripDatabaseRef = ref(db, "trips/" + tripId);
    const deleteTripRef = remove(tripDatabaseRef);
    alert("Trip Deleted");
    router.push("/dashboard");
  };

  
  const handleSaveNotes = async () => {
    if (!tripId) {
      console.error("No trip ID provided");
      alert("Error: No trip ID found.");
      return;
    }
    setTripNotes(editNotes);
    const tripNotesRef = ref(db, `trips/${tripId}/trip_notes`);
    try {
      await set(tripNotesRef, editNotes);
      alert('Notes updated successfully!');
    } catch (error) {
      console.error('Failed to save notes:', error);
      alert('Error saving notes.');
    }
  };

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  const [value, setValue] = React.useState(0);
  const activitiesArray = Object.values(curTripData?.activities || {});
  const numberOfActivities = activitiesArray.length;
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [isMapExpanded, setMapExpanded] = useState(false);
  
  const toggleButton = () => {
    setMapExpanded(!isMapExpanded);
  };
  

  return (
    <>
      <NavBar
        fetchTripData={fetchTripData}
        curTripData={curTripData}
        setTripData={setTripData}
        mode="light"
        toggleColorMode={() => {}}
      />

      <div className={styles.Container}>
        <div className={styles.sidebar}>
          <div className={styles.tripCard}>
            {curTripData && (
              <TripCard
                key={tripId?.toString()}
                {...curTripData}
                trip_id={tripId}
              />
            )}
          </div>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Favorites" />
                <Tab label="Directions" />
                <Tab label="Notes"/>
                <Tab label="Members" />
                {curTripData?.trip_owner ===
                  (authUser as unknown as User)?.uid && (
                  <Image
                    src={trashIcon}
                    onClick={() => {
                      openDelete(!deleteModal);
                    }}
                    alt={"delete trip"}
                    width={30}
                    height={30}
                    style={{ marginTop: 10 }}
                  />
                )}
              </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
              {/* {numberOfActivities} item */}
              <div className={styles.activities}>
                {curTripData?.activities &&
                  Object.entries(curTripData.activities).map(
                    ([activityId, activity]) => (
                      <ActivityCard
                        trip_id={tripId}
                        key={activityId}
                        activity_id={activityId}
                        {...activity}
                      />
                    )
                  )}
              </div>
            </TabPanel>



            <TabPanel value={value} index={1}>
              <div>
                <TravelModeSelector setTravelMode={setTravelMode} currentMode={travelMode}/>
              </div>
              {!office}
              {directions && directions.routes && (
                <Distance leg={directions.routes[0].legs[0]}/>
              )}
            </TabPanel>



            <TabPanel value={value} index={3}>
              {curTripData?.participants &&
                Object.values(curTripData.participants).map((participant, index) => (
                  <div className={styles.participantContainer} key={participant.uid}>
                    <Image
                      src={participant.profilePicURL} // Assuming imageURL is the property you want to use
                      alt={participant.uid}
                      className={styles.participantImage}
                      width={70}
                      height={70}
                    />
                    <h1 className={styles.participantEmail}>{participant.email}</h1>
                  </div>
                ))}
            </TabPanel>

            <TabPanel value={value} index={2}>
              <TextField
                multiline
                fullWidth
                rows={4}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)} 
                placeholder="Edit trip notes here..."
                variant="outlined"
              />
              <Button 
                onClick={() => {
                  setTripNotes(editNotes);
                  handleSaveNotes(); 
                }}
                variant="contained" 
                color="primary"
                style={{ marginTop: '10px' }}
              >
                Save Notes
              </Button>
            </TabPanel>


          </Box>
        </div>
        <div className={`${styles.mainContent} ${isMapExpanded ? styles.mainContentVisible : styles.mainContentHidden}`}>
          <div style={{ display: isMapExpanded ? 'block' : 'block' }} className={styles.map}>
              
              <Map
                tripDest={curTripData ? curTripData.trip_dest : "New York"}
                setOffice={setOffice}
                office={office}
                directions={directions}
                setDirections={setDirections}
                travelMode={travelMode}
              />
           </div>
          </div>
          
        

        <Dialog onClose={() => openDelete(!deleteModal)} open={deleteModal}>
          <div className="deleteModal">
            <DialogTitle>
              {" "}
              Delete &quot;{curTripData?.trip_name}&quot; ?{" "}
            </DialogTitle>
            <Button color="primary" variant="contained" onClick={deleteTrip}>
              Yes
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                openDelete(false);
              }}
            >
              No
            </Button>
          </div>
        </Dialog>

        <Button onClick={toggleButton} className={styles.mapButton}>
          <img src={isMapExpanded ? listIcon.src : mapIcon.src} alt={isMapExpanded ? "List" : "Map"} width={20} height={20} />
          ‎ ‎ {isMapExpanded ? 'List' : 'Map'}
        </Button>

        
      </div>
    </>
  );
};

export default ActivityList;

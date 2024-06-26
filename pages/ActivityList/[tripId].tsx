import React, { useState, useEffect, useRef, memo, FC, Suspense } from "react";
import TripCard from "../../components/TripCard";
import ActivityCard from "../../components/ActivityCard";
import { useRouter } from "next/router";
import styles from "../ActivityList.module.css";
import { ref, get, set, remove } from "firebase/database";
import { db } from "../../firebase/firebase";
import { TripCardData, ActivityInfo } from "../../CustomTypes";
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
import mapIcon from "../../public/mapIcon.png";
import listIcon from "../../public/listicon.png";
import TravelModeSelector from "../../components/travelMode";
import TextField from "@mui/material/TextField";
import { Data } from "@react-google-maps/api";
import Planner from "../planner";
import TabPanel from "../../components/TabPanel";

interface NotesInputProps {
  editNotes: string;
  setEditNotes: React.Dispatch<React.SetStateAction<string>>;
}

interface UpdatedItinerary {
  [activityId: string]: ActivityInfo;
}
type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;

type User = {
  email: string;
  uid: string;
};

export const ActivityList: React.FC = () => {
  const { authUser, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/");
    }
  }, [authUser, isLoading]);

  const router = useRouter();
  const { tripId } = router.query as { tripId: string };
  const [curTripData, setTripData] = useState<TripCardData>({} as TripCardData);
  const [deleteModal, openDelete] = useState(false);
  const [tripNotes, setTripNotes] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [dates, setDates] = useState<Date[]>([]);
  const [itinDate, setItinDate] = useState<Date>({} as Date);
  // const [itinerary, setItinerary] = useState<UpdatedItinerary>({});




  const [office, setOffice] = useState<LatLngLiteral | null>(
    {} as LatLngLiteral
  );
  const [directions, setDirections] = useState<DirectionsResult | null>(
    {} as DirectionsResult
  );
  const [travelMode, setTravelMode] = React.useState<google.maps.TravelMode>(
    google.maps.TravelMode.DRIVING
  );

  useEffect(() => {
    if (tripId) {
      fetchTripData();
      console.log("refresh")
    }
  }, [tripId]); 


  useEffect(() => {
    const startDate = new Date(curTripData.start_date);
    const endDate = new Date(curTripData.end_date);
    const newDates = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      newDates.push(new Date(d));
    }
    setDates(newDates);
    //if date is not set
    // if (Object.entries(itinDate).length === 0) {

    // }
    setItinDate(startDate)
  }, [curTripData.start_date, curTripData.end_date]);

  useEffect(() => {
    setEditNotes(tripNotes);
  }, [tripNotes]);

  const fetchTripData = async () => {
    try {
      const tripDatabaseRef = ref(db, "trips/" + tripId);
      const tripSnapshot = await get(tripDatabaseRef);
      if (tripSnapshot.exists()) {
        const data = tripSnapshot.val();
        setTripData((prevData) => ({ ...prevData, ...data })); // Use functional update to ensure latest state
        setTripNotes(data.trip_notes || "");

        console.log(curTripData);
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
      alert("Notes updated successfully!");
    } catch (error) {
      console.error("Failed to save notes:", error);
      alert("Error saving notes.");
    }
  };

  // function TabPanel(props: TabPanelProps) {
  //   const { children, value, index, ...other } = props;

  //   return (
  //     <div
  //       role="tabpanel"
  //       hidden={value !== index}
  //       id={`simple-tabpanel-${index}`}
  //       aria-labelledby={`simple-tab-${index}`}
  //       {...other}
  //     >
  //       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  //     </div>
  //   );
  // }

  const [value, setValue] = React.useState(0);
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
                <Tab label="Itinerary" />
                <Tab label="Directions" />
                <Tab label="Notes" />
                <Tab label="Members" />
                {curTripData?.trip_owner === (authUser as unknown as User)?.uid && (
                  <div 
                    style={{
                      cursor: 'pointer',
                      position: 'relative',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '20%',
                      backgroundColor: 'rgba(218, 212, 212, 0.7)',
                      transition: 'background-color 0.3s, transform 0.3s, box-shadow 0.3s',
                      marginTop: '2px',
                    }}
                    onClick={() => {
                      openDelete(!deleteModal);
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.8)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(218, 212, 212, 0.7)'}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'scale(1.0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={trashIcon.src}
                      alt="Delete trip"
                      width={30}
                      height={30}
                    />
                  </div>
                )}

              </Tabs>
            </Box>
            {/* favorites */}
            <TabPanel value={value} index={0}>
              {/* {numberOfActivities} item */}
              <div className={styles.activities}>
                {curTripData?.activities &&
                  Object.entries(curTripData.activities).map(
                    ([activityId, activity]) => (
                      <ActivityCard
                        trip_id={tripId}
                        key={activityId}
                        fetchTripData={fetchTripData}
                        activity_id={activityId}
                        {...activity}
                      />
                    )
                  )}
              </div>
            </TabPanel>

            {/* Itin */}
            <TabPanel value={value} index={1}>

              <div className={styles.itinContainer}>
                {dates.length != 0 &&
                  dates.map((date, index) => (
                    <div key={index}>
                      <div
                        className={`${styles.dateButton} ${date.toDateString() === itinDate.toDateString() ? styles.selectedDate : ''}`}
                        onClick={() => {
                          setItinDate(date);
                        }}
                      >
                        <p>Day {index + 1}</p>
                        {/* <p>{date.toDateString()}</p> */}
                      </div>
                    </div>
                  ))}
              </div>
              
            
            <Planner trip_id = {tripId} fetchTripData={fetchTripData} curDate={itinDate} curTripData={curTripData} ></Planner> 
            
            </TabPanel>

            <TabPanel value={value} index={2}>
              <div>
                <TravelModeSelector
                  setTravelMode={setTravelMode}
                  currentMode={travelMode}
                />
              </div>
              {!office}
              {directions && directions.routes && (
                <Distance leg={directions.routes[0].legs[0]} />
              )}
            </TabPanel>

            <TabPanel value={value} index={3}>
              <TextField
                key={"notesInput"}
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
                style={{ marginTop: "10px" }}
              >
                Save Notes
              </Button>
            </TabPanel>
            {/*  members   */}
            <TabPanel value={value} index={4}>
              {curTripData?.participants &&
                Object.values(curTripData.participants).map(
                  (participant, index) => (
                    <div
                      className={styles.participantContainer}
                      key={participant.uid}
                    >
                      <Image
                        src={participant.profilePicURL} // Assuming imageURL is the property you want to use
                        alt={participant.uid}
                        className={styles.participantImage}
                        width={70}
                        height={70}
                      />
                      <h1 className={styles.participantEmail}>
                        {participant.email}
                      </h1>
                    </div>
                  )
                )}
            </TabPanel>
          </Box>
        </div>
        <div
          className={`${styles.mainContent} ${
            isMapExpanded ? styles.mainContentVisible : styles.mainContentHidden
          }`}
        >
          <div
            style={{ display: isMapExpanded ? "block" : "block" }}
            className={styles.map}
          >
            {/* {value === 2 ? <ItinMap
            tripDest={curTripData ? curTripData.trip_dest : "New York"}
            setOffice={setOffice}
            office={office}
            directions={directions}
            setDirections={setDirections}
            travelMode={travelMode}/> :  */}

            <Map
              tripDest={curTripData ? curTripData.trip_dest : "New York"}
              setOffice={setOffice}
              office={office}
              directions={directions}
              setDirections={setDirections}
              travelMode={travelMode}
              curTripData = {curTripData}
            />
            {/* } */}
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
          <img
            src={isMapExpanded ? listIcon.src : mapIcon.src}
            alt={isMapExpanded ? "List" : "Map"}
            width={20}
            height={20}
          />
          ‎ ‎ {isMapExpanded ? "List" : "Map"}
        </Button>
      </div>
    </>
  );
};

export default ActivityList;

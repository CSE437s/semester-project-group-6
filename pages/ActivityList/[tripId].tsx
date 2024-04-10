import React, { useState, useEffect } from "react";
import TripCard from "../../components/TripCard";
import ActivityCard from "../../components/ActivityCard";
import { useRouter } from "next/router";
import styles from "../ActivityList.module.css";
import { ref, get, getDatabase, remove } from "firebase/database";
import { db } from "../../firebase/firebase";
import SearchBar from "../../components/SearchBarYelp";
import { TripCardData, ActivityInfo } from "../../CustomTypes";
import Link from "next/link";
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
import { width } from "@mui/system";
import { Modal } from "@mui/material";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { useAuth } from "../../firebase/auth";
import { Label } from "@mui/icons-material";
import mapIcon from '../../public/mapIcon.png';
import listIcon from '../../public/listIcon.png';

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
  const [office, setOffice] = useState<LatLngLiteral | null>(
    {} as LatLngLiteral
  );
  const [directions, setDirections] = useState<DirectionsResult | null>(
    {} as DirectionsResult
  );

  useEffect(() => {
    if (tripId) {
      fetchTripData();
    }
    console.log(curTripData);
  }, [tripId]);

  const fetchTripData = async () => {
    try {
      const tripDatabaseRef = ref(db, "trips/" + tripId);
      const tripSnapshot = await get(tripDatabaseRef);
      if (tripSnapshot.exists()) {
        setTripData(tripSnapshot.val());
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


  const goToMap = () => {
    router.push('/map'); // Change '/map' to the path of your map.tsx page
  };


  const goToList = () => {
    router.push('/map'); // Change '/map' to the path of your map.tsx page
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
  const toggleMapSize = () => {
    if (window.innerWidth < 1020) { // Only allow toggle if the window is narrow
      setMapExpanded(!isMapExpanded);
    }
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
                <Tab label="Activity Info" />
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
              {!office}
              {directions && directions.routes && (
                <Distance leg={directions.routes[0].legs[0]} />
              )}
            </TabPanel>

            <TabPanel value={value} index={2}>
              {curTripData?.participants &&
                Object.values(curTripData.participants).map(
                  (participant, index) => (
                    <>
                    <Image
                      key={participant.uid}
                      src={participant.profilePicURL} // Assuming imageURL is the property you want to use
                      alt={participant.uid}
                      className={styles.participant}
                      width={70}
                      height={70}
                    />
                    <h1> {participant.email}</h1>
                    </>
                  )
                )}

            </TabPanel>
          </Box>
        </div>
        <div className={`${styles.mainContent} ${isMapExpanded ? styles.mainContentVisible : styles.mainContentHidden}`}>
          <div className={`${styles.mapContainer} ${isMapExpanded ? styles.mapContainerExpanded : ''}`}>
          <div style={{ display: isMapExpanded ? 'block' : 'block' }} className={styles.mainContent}>
              <Map
                tripDest={curTripData ? curTripData.trip_dest : "New York"}
                setOffice={setOffice}
                office={office}
                directions={directions}
                setDirections={setDirections}
              />
           </div>
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
        
        <Button onClick={toggleMapSize} className={styles.mapButton}>
          <img src={isMapExpanded ? listIcon.src : mapIcon.src} alt={isMapExpanded ? "List" : "Map"} width={20} height={20} />
          ‎ ‎ {isMapExpanded ? 'List' : 'Map'}
        </Button>
              



      </div>
    </>
  );
};

export default ActivityList;

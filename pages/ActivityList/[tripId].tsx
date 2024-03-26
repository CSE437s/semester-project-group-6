import React, { useState, useEffect } from "react";
import TripCard from "../../components/TripCard";
import ActivityCard from "../../components/ActivityCard";
import { useRouter } from "next/router";
import styles from "../ActivityList.module.css";
import { ref, get } from "firebase/database";
import { db } from "../../firebase/firebase";
import SearchBar from "../../components/SearchBarYelp";
import { TripCardData, ActivityInfo } from "../../CustomTypes";
import Link from 'next/link';
import NavBar from '../../components/AppAppBar';
import Map from '../../pages/map';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Distance from "../../components/distance";
import { geocode } from "react-geocode";
import MapLoader from "../../components/mapLoader"

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;

export const ActivityList: React.FC = () => {
  const router = useRouter();
  const { tripId } = router.query as { tripId: string };
  const [curTripData, setTripData] = useState<TripCardData>();
  
  useEffect(() => {
    if (tripId) {
      
      fetchTripData();
    }
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

        

  return (
    <>
      <NavBar fetchTripData={fetchTripData} curTripData={curTripData} setTripData={setTripData} mode="light" toggleColorMode={() => {}} />

      <div className={styles.Container}>
        <div className={styles.sidebar}>
          <div className={styles.tripCard}>
            {curTripData && <TripCard key={tripId?.toString()} {...curTripData} trip_id={tripId} />}
          </div>
            <Box sx={{ width: '100%'}}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Favorites" />
                  <Tab label="Activity Info" />
                  <Tab label="Members" />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                {/* {numberOfActivities} item */}
                <div className={styles.activities}>  
                {curTripData?.activities && Object.entries(curTripData.activities).map(([activityId, activity]) => (
                  <ActivityCard trip_id={tripId} key={activityId} activity_id={activityId} {...activity} />
                ))}
                </div>
              
              </TabPanel>

              {/* <TabPanel value={value} index={1}>
                 {!office}
                 {directions && <Distance leg={directions.routes[0].legs[0]} />}
              </TabPanel> */}


              <TabPanel value={value} index={2}>
                You have {curTripData?.participants.length} members in your current trip
                
              </TabPanel>
            </Box>
          

        </div>

        <div className={styles.mainContent}>
          <div className={styles.mapContainer}>
            <MapLoader apiKey ={"AIzaSyBffWM5IfZJ35qk-UNXUydS8RQTJpeM9x0"}>
              <Map 
                tripDest = {curTripData ? curTripData.trip_dest: "New York"}
                // setOffice={setOffice} 
                // office={office} 
                // directions = {directions}
                // setDirections={setDirections}
              />
            </MapLoader>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityList;

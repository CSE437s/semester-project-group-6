import React, { useState, useEffect } from "react";
import TripCard from "../../components/TripCard";
import ActivityCard from "../../components/ActivityCard";
import { useRouter } from "next/router";
import styles from "../ActivityList.module.css";
import {
  ref,
  get,
} from "firebase/database";
import { db } from "../../firebase/firebase";
import SearchBar from "../../components/SearchBarYelp";
import { TripCardData, ActivityInfo } from "../../CustomTypes";
import Link from 'next/link';
import NavBar from '../../components/AppAppBar';
import Map from '../../pages/map';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const ActivityList: React.FC = () => {
  const router = useRouter();
  const { tripId } = router.query as { tripId: string };
  const [curTripData, setTripData] = useState<TripCardData>();
  
  useEffect(() => {
    if (tripId) {
      const tripDatabaseRef = ref(db, "trips/" + tripId);
      const fetchTripData = async () => {
        try {
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

      fetchTripData();
    }
  }, [tripId]);

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
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
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
      <NavBar mode="light" toggleColorMode={() => {}} />
      
      <div className={styles.Container}>
        <div className={styles.sidebar}>
          {curTripData && <TripCard key={tripId?.toString()} {...curTripData} trip_id={tripId} />}
          
          <div className={styles.activities}>
            <Box sx={{ width: '100%'}}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Favorites" />
                  <Tab label="For you" />
                  <Tab label="Members" />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                {numberOfActivities} item
              </TabPanel>
              <TabPanel value={value} index={1}>
                {numberOfActivities} item
              </TabPanel>
              <TabPanel value={value} index={2}>
                {numberOfActivities} item
              </TabPanel>
            </Box>
          </div>

          {curTripData?.activities && Object.values(curTripData.activities).map((activity, index) => (
            <ActivityCard key={index} {...activity} />
          ))}

        </div>
        
        <div className={styles.mainContent}>
          <div className={styles.mapContainer}>
            <Map />
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityList;



import StockPhoto from "../public/bike.png";
import { ActivityInfo } from "../CustomTypes";
import React, { useEffect, useState } from "react";
import ItineraryCard from "../components/ItineraryCard";
import plannerstyles from "../components/planner.module.css";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { ref, push, get, remove } from "firebase/database";
import { TripCardData } from "../CustomTypes";
import { useAuth } from "../firebase/auth";
import { User } from "firebase/auth";
import { db } from "../firebase/firebase";
import { Reorder } from "framer-motion";
interface PlannerProps {
  fetchTripData: () => Promise<void>;
  curTripData: TripCardData;
  curDate: Date;
  trip_id: string;
}

interface UpdatedItinerary {
  [activityId: string]: ActivityInfo;
}

export default function Planner(props: PlannerProps) {
  const { fetchTripData, curDate, curTripData, trip_id } = props;
  const [ordering, setOrdering] = useState<number[]>([]);
  const [activityModal, setActivityModal] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<UpdatedItinerary>({});


  const { authUser } = useAuth() as { authUser: User | null };

 
  const fetchItineraryData = async() => {
  if (curTripData.itinerary) {
    const updatedItinerary: UpdatedItinerary = {};
    if (curTripData.itinerary) {
      for (const [date, itineraryItems] of Object.entries(
        curTripData.itinerary
      )) {
        if (date === curDate.toISOString().split('T')[0]) {
          const promises = Object.entries(itineraryItems).map(
            async ([itinKey, activityKey]) => {
              try {
                const activityData = await fetchActivityData(activityKey);
                if (activityData === null)  {
                  await remove(ref(db,`trips/${trip_id}/itinerary/${curDate.toISOString().split('T')[0]}/${itinKey}`));
                  return;
                }  
                updatedItinerary[activityKey] = activityData;
                const newOrderingNumber = ordering.length;
                setOrdering(prevOrdering => [...prevOrdering, newOrderingNumber]);
              } catch (error) {
                console.error('Error fetching activity data:', error);
              }
            }
          );
          await Promise.all(promises);
        }
      }
    }
    setItinerary(updatedItinerary);
  }
}
  useEffect(() => {
    fetchItineraryData();
  }, [curDate, curTripData]);

  const fetchActivityData = async (
    activityId: string
  ): Promise<ActivityInfo> => {
    const tripDatabaseRef = ref(
      db,
      `trips/${trip_id}/activities/${activityId}`
    );
    const tripSnapshot = await get(tripDatabaseRef);
    return tripSnapshot.val();
  };
  
  const addSelected = async () => {
    const promises = selected.map(async selectedItem => {
      const newActivityRef = await push(
        ref(db, `trips/${trip_id}/itinerary/${curDate.toISOString().split('T')[0]}`),
        selectedItem
      );
      return newActivityRef;
    });
    
    await Promise.all(promises);
    fetchTripData();
  };
  

  return (
    <>
      <div
        className={plannerstyles.addButton}
        onClick={() => {
          setActivityModal(true);
        }}
      >
        <p className={plannerstyles.plus}>+</p>
      </div>

      <Dialog
        open={activityModal}
        onClose={() => setActivityModal(!activityModal)}
      >
        <DialogTitle className={plannerstyles.dialogTitle}>Plan your activities</DialogTitle>

        <div className={plannerstyles.activitySelection}>
          {curTripData?.activities &&
            Object.entries(curTripData.activities).map(
              ([activityId, activity]) => (
                <ItineraryCard
                  setSelected={setSelected}
                  selected={selected}
                  trip_id={trip_id}
                  key={activityId}
                  activity_id={activityId}
                  activityinfo={activity}
                  isDeletable={false}
                  curDate = {curDate}
                  fetchTripData ={fetchTripData}
                  setItinerary = {setItinerary}

                />
              )
            )}
        </div>
        <Button variant="outlined" onClick={addSelected} className={plannerstyles.button}>
          {" "}
          add
        </Button>
      </Dialog>
      
      
      
      <div className={plannerstyles.activityFlex}>
        <Reorder.Group values={ordering} onReorder ={setOrdering}>
        {Object.entries(itinerary).map(([activityId, activity], index) => (
          <Reorder.Item value = {ordering}>
            <ItineraryCard
              trip_id={trip_id}
              key={activityId} 
              activity_id={activityId}
              activityinfo={activity} 
              isDeletable={true}
              curDate = {curDate}
              fetchTripData={fetchTripData}
              setItinerary = {setItinerary}
            />
          
        </Reorder.Item>
        ))}
        </Reorder.Group>

      </div>
    
    </>
  );
}

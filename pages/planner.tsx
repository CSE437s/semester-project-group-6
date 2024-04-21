import StockPhoto from "../public/bike.png";
import { ActivityInfo } from "../CustomTypes";
import React, { useEffect, useState } from "react";
import ItineraryCard from "../components/ItineraryCard";
import styles from "../components/planner.module.css";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { ref, push, get } from "firebase/database";
import { TripCardData } from "../CustomTypes";
import { useAuth } from "../firebase/auth";
import { User } from "firebase/auth";
import { db } from "../firebase/firebase";

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
  const [ordering, setOrdering] = useState<number[]>([0, 1, 2, 3]);
  const [activityModal, setActivityModal] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<UpdatedItinerary>({});

  const { authUser } = useAuth() as { authUser: User | null };
  const Dummy: ActivityInfo = {
    name: "activity",
    image_url: StockPhoto.src,
    rating: 5.0,
    review_count: 3500,
    url: "https://mui.com/material-ui/react-card/",
    location: {},
    likes: { fdadsa: true },
  };

  useEffect(() => {
    const fetchItineraryData = async () => {
      const updatedItinerary: UpdatedItinerary = {};
      if (curTripData.itinerary) {
        for (const [date, itineraryItems] of Object.entries(
          curTripData.itinerary
        )) {
          console.log("curdate" + curDate.toString());
          console.log(date);
          if (date === curDate.toString()) {
            for (const [itinKey, activityKey] of Object.entries(
              itineraryItems
            )) {
              const activityData = await fetchActivityData(activityKey);
              updatedItinerary[activityKey] = activityData;
            }
          }
        }
      }
      setItinerary(updatedItinerary);
    };
    fetchItineraryData();
    console.log(curTripData);
    console.log(itinerary);
  }, [curDate]);

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
    const promises = selected.map(async (selectedItem) => {
      const newActivityRef = await push(
        ref(db, `trips/${trip_id}/itinerary/${curDate.toString()}`),
        selectedItem
      );
      return newActivityRef;
    });

    await Promise.all(promises);
    fetchTripData();
  };

  const dummies = [Dummy, Dummy, Dummy, Dummy];
  return (
    <>
      <div
        className={styles.addButton}
        onClick={() => {
          setActivityModal(true);
        }}
      >
        <p className={styles.plus}>+</p>
      </div>
      <Dialog
        open={activityModal}
        onClose={() => setActivityModal(!activityModal)}
      >
        <DialogTitle className={styles.dialogTitle}>Plan your activities</DialogTitle>

        <div className={styles.activitySelection}>
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
                />
              )
            )}
        </div>
        <Button variant="outlined" onClick={addSelected} className={styles.button}>
          {" "}
          add
        </Button>
      </Dialog>
      
      
      {/* <Reorder.Group axis="y" values={ordering} onReorder={setOrdering}> */}
      <div className={styles.activityFlex}>
        {Object.entries(itinerary).map(([activityId, activity], index) => (
          <ItineraryCard
            trip_id={trip_id}
            key={activityId}
            activity_id={activityId}
            activityinfo={activity} 
          />
        ))}
      </div>
    
    </>
  );
}

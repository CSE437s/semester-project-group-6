import StockPhoto from "../public/bike.png";
import { ActivityInfo } from "../CustomTypes";
import { Reorder } from "framer-motion";
import React, { useState } from "react";
import ItineraryCard from "../components/ItineraryCard";
import styles from "../components/planner.module.css";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { ref, push, set } from "firebase/database";
import { TripCardData } from "../CustomTypes";
import { useAuth } from "../firebase/auth";
import {User} from "firebase/auth"
import { db } from "../firebase/firebase";


interface PlannerProps {
  fetchTripData: () => Promise<void>;
  curTripData: TripCardData;
  curDate: Date;
  trip_id: string;
}

export default function Planner(props: PlannerProps) {
  const { fetchTripData, curDate, curTripData, trip_id } = props;
  const [ordering, setOrdering] = useState([0, 1, 2, 3]);
  const [activityModal, setActivityModal] = useState(false);
  const [selected, setSelected] = useState<String[]>([]);

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
    
  
  const addSelected = async() => {
    const promises = selected.map(async (selectedItem) => {
        const newActivityRef = await push(
          ref(db, "trips/" + trip_id + "/itinerary/" + curDate),
          selectedItem
        );
        return newActivityRef;
      });
    
      await Promise.all(promises);
  }

  const dummies = [Dummy, Dummy, Dummy, Dummy];
  return (
    <>
      <div
        className={styles.button}
        onClick={() => {
          setActivityModal(true);
        }}
      >
        <p>+</p>
      </div>

      <Dialog
        open={activityModal}
        onClose={() => setActivityModal(!activityModal)}
      >
        <DialogTitle> Add an Activity</DialogTitle>

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
        <Button variant="outlined" onClick={addSelected}> add</Button>
      </Dialog>

      <Reorder.Group axis="y" values={ordering} onReorder={setOrdering}>
        {ordering.map((index) => (
          <Reorder.Item value={index} key={index}>
            {/* <ItineraryCard
              trip_id={"adjskf"}
              activity_id={"" + index}
              {...dummies[index]}
            ></ItineraryCard> */}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </>
  );
}

import React from "react";
import styles from "./ActivityCard.module.css";
import Image from "next/image";
import { ActivityInfo } from "../CustomTypes";
import emptyFav from "../public/favorite.png"
import filledFav from "../public/favorite1.png";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { db } from "../firebase/firebase";
import { onValue, set, push, ref, remove, get } from "firebase/database";
import { useAuth } from "../firebase/auth";
import { User } from "firebase/auth";
import trashIcon from "../public/trashIcon.png";

interface ItinProps {
  trip_id: string;
  activity_id: string;
  activityinfo: ActivityInfo;
  setSelected?: React.Dispatch<React.SetStateAction<string[]>>;
  selected?: string[];
  isDeletable: boolean;
  curDate: Date;
  fetchTripData: () => Promise<void>;
  setItinerary: React.Dispatch<React.SetStateAction<UpdatedItinerary>>;
}
interface UpdatedItinerary {
  [activityId: string]: ActivityInfo;
}

const ItineraryCard = (props: ItinProps) => {
  const {
    setItinerary,
    fetchTripData,
    activity_id,
    trip_id,
    activityinfo,
    setSelected,
    selected,
    isDeletable,
    curDate,
  } = props;

  const { name, image_url, rating, review_count, url, location, likes } =
    activityinfo;
  const { authUser } = useAuth() as { authUser: User | null };
  // Use a simple boolean to track favorite status.
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    // On mount, check if the activity is favorited.
   const checkFav = async() => {
    const favoriteRef = ref(
      db,
      `trips/${trip_id}/activities/${activity_id}/likes/${authUser?.uid}`
    );
    const snapshot = await get(favoriteRef);
    if(snapshot.exists()) {
      setIsFavorite(true);
    }
   }
   checkFav();
  }, [trip_id]);

  const renderStars = (rating: number) => {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += "★"; // Full star
      } else if (i - 0.5 === rating) {
        stars += "☆"; // Half star - you may want to use a half-star character or icon
      } else {
        stars += "☆"; // Empty star
      }
    }
    return <>{stars}</>;
  };

  const handleSelectItineraryCard = () => {
    if (setSelected && selected) {
      setIsSelected(!isSelected);

      if (selected.includes(activity_id)) {
        setSelected(selected.filter((id) => id !== activity_id));
      } else {
        setSelected([...selected, activity_id]);
      }
    }
  };
  const toggleFavorite = async () => {
    const favoriteRef = ref(db, `trips/${trip_id}/activities/${activity_id}/likes/${authUser?.uid}`);
  
    
    if (isFavorite) {
      // If already favorited, remove from Firebase.
      if (Object.keys(likes).length == 1) {
        await remove(ref(db, `trips/${trip_id}/activities/${activity_id}`));
      }
      await remove(favoriteRef);
      
      setIsFavorite(false); // Update local state
    } else {
      // If not favorited, add to Firebase under the specified path.
      await set(favoriteRef, true);
      setIsFavorite(true); // Update local state
    }
  };
  const deleteCard = async () => {
    const tripDatabaseRef = ref(
      db,
      "trips/" + trip_id + "/itinerary/" + curDate.toISOString().split("T")[0]
    );
    const tripSnapshot = await get(tripDatabaseRef);
    const itineraryData = tripSnapshot.val();

    if (itineraryData) {
      Object.entries(itineraryData).forEach(async ([key, value]) => {
        if (value === activity_id) {
          await remove(
            ref(
              db,
              "trips/" +
                trip_id +
                "/itinerary/" +
                curDate.toISOString().split("T")[0] +
                `/${key}`
            )
          );
          fetchTripData();
          return;
        }
      });
    }
  };

  return (
    <div
      className={`${styles.activityCard2} ${isSelected ? styles.selected : ""}`}
      onClick={() => handleSelectItineraryCard()}
    >
      <img
        src={image_url}
        alt="Activity Location"
        className={styles.activityImage}
      />
      <div className={styles.activityInfo}>
        <h2 className={styles.activityTitle}>
          {name}
          <img
            src="/yelp.svg"
            alt="Yelp"
            style={{
              position: "absolute",
              width: "40px",
              height: "auto",
              marginLeft: "0px",
              top: "150px",
              right: "10px",
            }}
          />
        </h2>
        <div className={styles.rating}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{ color: "#ffbf00", display: "flex" }}
            >
              {renderStars(rating)}
            </Typography>
          </Box>
          <span className={styles.reviewCount}>{review_count} reviews <span className={styles.likes}>❤ {likes ? Object.keys(likes).length : 0}</span></span>
        </div>
        <div className={styles.details}></div>
      </div>
      {isDeletable && (
        <div className={styles.deleteIcon}>
          <Image
            src={trashIcon}
            alt={"delete item"}
            width={30}
            height={30}
            onClick={deleteCard}
          />
        </div>
      )}
      
    </div>
  );
};

export default ItineraryCard;

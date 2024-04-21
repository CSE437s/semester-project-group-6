import React from "react";
import styles from "./ActivityCard.module.css";
import Image from "next/image";
import { ActivityInfo } from "../CustomTypes";
import emptyFav from "../public/favorite.png";
import filledFav from "../public/favorite1.png";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { db } from "../firebase/firebase";
import { onValue, set, push, ref, remove } from "firebase/database";
import { useAuth } from "../firebase/auth";
import { User } from "firebase/auth";

interface ItinProps {
  trip_id: string;
  activity_id: string;
  activityinfo: ActivityInfo;
  setSelected?: React.Dispatch<React.SetStateAction<string[]>>;
  selected?: string[];
}

const ItineraryCard = (props: ItinProps) => {
  const { activity_id, trip_id, activityinfo, setSelected, selected } = props;
  const { name, image_url, rating, review_count, url, location, likes } =
    activityinfo;
  const { authUser } = useAuth() as { authUser: User | null };
  // Use a simple boolean to track favorite status.
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    // On mount, check if the activity is favorited.
    const favoriteRef = ref(
      db,
      `trips/${trip_id}/activities/${activity_id}/likes/${authUser?.uid}`
    );
    const unsubscribe = onValue(favoriteRef, (snapshot) => {
      setIsFavorite(snapshot.exists());
    });
  }, [name, trip_id]);

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

  return (
    <div
      className={`${styles.activityCard} ${isSelected ? styles.selected : ""}`}
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
          <span className={styles.reviewCount}>{review_count} reviews</span>
        </div>
        <div className={styles.details}></div>
      </div>
      <div className={styles.favoriteIcon}>
        <Button className={styles.favorite}>
          <label> {Object.keys(likes).length} </label>
          <img src={isFavorite ? filledFav.src : emptyFav.src} alt="Favorite" />
        </Button>
      </div>
    </div>
  );
};

export default ItineraryCard;

import React, { useState } from "react";
import styles from "./Review.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "@mui/base";
import { push, set, ref } from "firebase/database";
import { ActivityInfo } from "../CustomTypes";
import { db } from "../firebase/firebase";

type Props = {
  activity: ActivityInfo;
  tripId: string;
};
export const Review: React.FC<Props> = ({ activity, tripId }) => {
  const [isVisible, setIsVisible] = useState(true); // State to control visibility
  const activitiesRef = ref(db, "trips/" + tripId + "/activities");

  const openLinkInNewTab = (url: string) => {
    const newTab = window.open(url, "_blank");
    if (newTab) {
      newTab.focus();
    }
  };

  const addActivity = () => {
    push(activitiesRef, activity)
      .then((newActivityRef) => {
        console.log("New activity added with key:", newActivityRef.key);
        setIsVisible(false); // Set isVisible to false to hide the component
      })
      .catch((error) => {
        console.error("Error adding new activity:", error);
      });
  };

  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={index < activity.rating ? styles.filledStar : styles.emptyStar}
    >
      ★
    </span>
  ));

  return isVisible ? (
    <div
      className={styles.container}
      onClick={() => openLinkInNewTab(activity.url)}
    >
      <img
        src={activity.image_url}
        alt={activity.name}
        className={styles.image}
      />
      <div className={styles.content}>
        <h2 className={styles.title}>{activity.name}</h2>
        <div className={styles.rating}>
          <div className={styles.stars}>{stars}</div>
          <img src="/yelp.svg" alt="Yelp" className={styles.yelpIcon} />
        </div>
        <div className={styles.reviewCount}>
          Based on {activity.review_count} reviews
        </div>
      </div>
      <Button onClick={addActivity} className={styles.button}>
        +
      </Button>
    </div>
  ) : null;
};

export default Review;


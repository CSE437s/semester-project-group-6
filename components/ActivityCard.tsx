import React from 'react';
import styles from './ActivityCard.module.css';
import Image from 'next/image';
import { ActivityInfo } from '../CustomTypes';
import emptyFav from '../public/favorite.png';
import filledFav from '../public/favorite1.png';
import { useState } from "react";
import { Button } from "@mui/material";

const ActivityCard: React.FC<ActivityInfo> = (activity) => {
  console.log(activity);
  const openLinkInNewTab = (url: string) => {
    const newTab = window.open(url, "_blank");
    if (newTab) {
      newTab.focus();
    }
  };

  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={index < activity.rating ? styles.filledStar : styles.emptyStar}
    >
      ★
    </span>
  ));
  
  const [currentImage, setCurrentImage] = useState(emptyFav);
  const toggleImage = () => {
    setCurrentImage(currentImage === emptyFav ? filledFav : emptyFav);
  }

  return (
    <div className={styles.activityCard}>
      <img src={activity.image_url} alt="Activity Location" className={styles.activityImage} width={500}
      height={300}
       />
      <div className={styles.activityInfo} onClick={() => openLinkInNewTab(activity.url)}>
        <h2 className={styles.activityTitle} >{activity.name}</h2>
        <div className={styles.rating}>
          {stars}
          <span className={styles.reviewCount}>{activity.review_count}</span>
        </div>
          <div className={styles.details}>
            {/* details */}   
          </div>
        </div>
        <div className={styles.favoriteIcon}>
          <Button onClick={toggleImage} className={styles.favorite}> 
            <img src={currentImage.src}/>
          </Button>
        </div>
    </div>
  );
};

export default ActivityCard;

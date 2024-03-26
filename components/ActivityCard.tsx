import React from 'react';
import styles from './ActivityCard.module.css';
import Image from 'next/image';
import { ActivityInfo } from '../CustomTypes';
import emptyFav from '../public/favorite.png';
import filledFav from '../public/favorite1.png';
import { useState , useEffect } from "react";
import { Button } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { db } from "../firebase/firebase";
import { onValue, set, push, ref, remove } from "firebase/database";

const ActivityCard: React.FC<ActivityInfo & { trip_id: string } & {activity_id: string} > = (props) => {
  
  const { name, image_url, rating, review_count, url, location, activity_id, trip_id } = props;

  // Use a simple boolean to track favorite status.
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // On mount, check if the activity is favorited.
    const favoriteRef = ref(db, `trips/${trip_id}/activities/${activity_id}`);
    console.log(favoriteRef);
    const unsubscribe = onValue(favoriteRef, (snapshot) => {
      setIsFavorite(snapshot.exists());
    });

    // Cleanup on component unmount
    return () => unsubscribe();
  }, [name, trip_id]);

  const toggleFavorite = async () => {
    const favoriteRef = ref(db, `trips/${trip_id}/activities/${activity_id}`);
  
    if (isFavorite) {
      // If already favorited, remove from Firebase.
      await remove(favoriteRef);
      setIsFavorite(false); // Update local state
    } else {
      // If not favorited, add to Firebase under the specified path.
      await set(favoriteRef, { name, image_url, rating, review_count, url, location });
      setIsFavorite(true); // Update local state
    }
  };

  const renderStars = (rating:number) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '★'; // Full star
      } else if (i - 0.5 === rating) {
        stars += '☆'; // Half star - you may want to use a half-star character or icon
      } else {
        stars += '☆'; // Empty star
      }
    }
    return <>{stars}</>;
  };
  




  return (
    
    <div className={styles.activityCard}>
      <img src={image_url} alt="Activity Location" className={styles.activityImage} />
      <div className={styles.activityInfo} onClick={() => window.open(props.url, "_blank")}>
        <h2 className={styles.activityTitle}>{name}
              <img src="/yelp.svg" alt="Yelp" style={{ position: 'absolute', width: '40px', height: 'auto', 
              marginLeft: '0px', top:'150px', right:'10px' }} />
            </h2>
        <div className={styles.rating}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#ffbf00', display: 'flex' }}>
              {renderStars(rating)}
            </Typography>
          </Box>
          <span className={styles.reviewCount}>{review_count} reviews</span>
        </div>
          <div className={styles.details}>
    
          </div>
        </div>
        <div className={styles.favoriteIcon}>
        <Button onClick={(e) => {
          e.stopPropagation(); // Prevent other handlers
          toggleFavorite();
        }} className={styles.favorite}>
          <img src={isFavorite ?  filledFav.src : emptyFav.src } alt="Favorite" />
        </Button>
      </div>
    </div>
  );
};

export default ActivityCard;

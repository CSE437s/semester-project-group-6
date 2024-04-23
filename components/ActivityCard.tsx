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
import { onValue, set, push, ref, remove, get } from "firebase/database";
import { useAuth } from '../firebase/auth';
import { User } from 'firebase/auth';

const ActivityCard: React.FC<ActivityInfo & { trip_id: string } & { activity_id: string } & { fetchTripData?: () => Promise<void> }> = (props) => {

  
  const { name, image_url, rating, review_count, url, location, activity_id, trip_id, likes, fetchTripData } = props;
  const { authUser } = useAuth() as { authUser: User | null };
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
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
  }, [name, trip_id]);

  const toggleFavorite = async () => {
    const favoriteRef = ref(db, `trips/${trip_id}/activities/${activity_id}/likes/${authUser?.uid}`);
  
    if (isFavorite) {
      // If already favorited, remove from Firebase.
      if (Object.keys(likes).length == 1) {
        await remove(ref(db, `trips/${trip_id}/activities/${activity_id}`));
        if(fetchTripData) fetchTripData();
      } else {
        await remove(favoriteRef);
      }
      
      setIsFavorite(false); // Update local state
    } else {
      // If not favorited, add to Firebase under the specified path.
      await set(favoriteRef, true);
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
          <span className={styles.reviewCount}>{review_count} reviews<span className={styles.likes}>❤ {likes ? Object.keys(likes).length : 0}</span></span>
        </div>
          <div className={styles.details}>
    
          </div>
        </div>
        <div className={styles.favoriteIcon}>
        <Button onClick={(e) => {
          e.stopPropagation(); // Prevent other handlers
          toggleFavorite();
          if (fetchTripData) {
            fetchTripData();
          }
        }} className={styles.favorite}>
          <img src={isFavorite ?  filledFav.src : emptyFav.src } alt="Favorite" />
        </Button>
      </div>
    </div>
  );
};

export default ActivityCard;

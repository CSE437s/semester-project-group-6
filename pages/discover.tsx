import React, { useState, useEffect } from "react";
import AppAppBar from '../components/AppAppBar';
import { TripCardData , ActivityInfo} from '../CustomTypes';
import Slider from "react-slick";
import styles from "./discover.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/router";
import { db } from "../firebase/firebase";
import { push, get, ref, remove } from "firebase/database";
import {
  Button,
  Box,
  Card,
  CardMedia,
  Typography,
} from "@mui/material";
import emptyFav from "../public/favorite.png";
import filledFav from "../public/favorite1.png";
import cover from "../public/travelnDiscover.jpg"


type ArrowProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function Discover() {
  const router = useRouter();
  const { trip_destination, trip_id } = router.query;
  const [hotelResults, setHotelResults] = useState<ActivityInfo[]>([]);
  const [beachResults, setBeachResults] = useState<ActivityInfo[]>([]);
  const [restaurantResults, setRestaurantResults] = useState<ActivityInfo[]>([]);
  const [curTripData, setTripData] = useState<TripCardData>();



  const [favorites, setFavorites] = useState<{ [key: string]: string }>({});
  const fetchTripData = async () => {
    try {
      const tripDatabaseRef = ref(db, "trips/" + trip_id);
      const tripSnapshot = await get(tripDatabaseRef);
      if (tripSnapshot.exists()) {
        setTripData(tripSnapshot.val());
      } else {
        console.error(`Trip with ID ${trip_id} not found.`);
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
    }
  };

  useEffect(() => {
    if (trip_id) {
      fetchTripData();
    }
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

  const addActivity = async (activity: ActivityInfo): Promise<string> => {
    const newActivityRef = await push(
      ref(db, "trips/" + trip_id + "/activities"),
      activity
    );
    return newActivityRef.key as string;
  };

  const deleteActivity = async (key: string) => {
    await remove(ref(db, "trips/" + trip_id + "/activities/" + key));
  };


  const toggleFavorite = async (activity: ActivityInfo) => {
    // Check if the activity is already favorited
    if (favorites[activity.name]) {
      // Activity is favorited, delete it
      await deleteActivity(favorites[activity.name]);
      setFavorites((prev) => {
        const updated = { ...prev };
        delete updated[activity.name]; // Remove from favorites
        return updated;
      });
    } else {
      // Activity is not favorited, add it
      const key = await addActivity(activity);
      setFavorites((prev) => ({ ...prev, [activity.name]: key })); // Add to favorites
    }
  };

  // Placeholder for toggleColorMode function
  const toggleColorMode = () => {
      // Implementation logic for toggling color mode
  };

  const fetchActivities = async (category: string, setState: React.Dispatch<React.SetStateAction<ActivityInfo[]>>) => {
    try {
      const response = await fetch(`http://localhost:3001/yelp/search-yelp?term=${category}&location=${trip_destination}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setState(data.businesses || []);
    } catch (error) {
      console.error(`Error fetching ${category} activities:`, error);
    }
  };
  useEffect(() => {
    if (trip_destination) {
      fetchActivities('hotels', setHotelResults);
      fetchActivities('beaches', setBeachResults);
      fetchActivities('restaurants', setRestaurantResults);
    }
  }, [trip_destination]);

  const openLinkInNewTab = (url: string) => {
    const newTab = window.open(url, "_blank");
    if (newTab) {
      newTab.focus();
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const SampleNextArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <button
      className="slick-next"
      onClick={onClick}
      style={{
        position: 'absolute',
        right: '-25px',
        top: '50%',
        zIndex: 2,
        background: '#ddd',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translateY(-50%)'
      }}
    >
      &gt;
    </button>
  );
  
  
  const SamplePrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <button
      className="slick-prev"
      onClick={onClick}
      style={{
        position: 'absolute',
        left: '-25px',
        top: '50%',
        zIndex: 2,
        background: '#ddd',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translateY(-50%)'
      }}
    >
      &lt;
    </button>
  );

  return (
    <>
      <AppAppBar 
        fetchTripData={fetchTripData}
        setTripData={setTripData}
        curTripData={curTripData}
        mode="light"
        toggleColorMode={toggleColorMode}
      />
      <div className={styles.coverImgcontainer}>
        <img src = {cover.src} className={styles.coverImg}/>
      </div>



      <div className={styles.discoverContainer}>
        <h2 className ={styles.title}>Hotels</h2>
        <p className ={styles.subtitle}>Efficiency and Comfort at City Center Executive Suites.</p>
        
        <Slider {...settings}>
          {hotelResults.slice(0, 8).map((activity, index) => (
            <div key={index} className={styles.sliderItem}>
              <Card className={styles.cardStyle}>
                <CardMedia
                  component="img"
                  image={activity.image_url}
                  alt={activity.name}
                  className={styles.cardImage}
                  sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                />
                <Box sx={{ padding: '10px' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {activity.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffbf00' }}>
                    {renderStars(activity.rating)}
                  </Typography>
                  <Typography variant="body2">
                    {activity.review_count} reviews
                  </Typography>
                </Box>
                <Button 
                  className={styles.favButton}
                  onClick={() => toggleFavorite(activity)}
                >
                  <img src={favorites[activity.name] ? filledFav.src : emptyFav.src} alt="Favorite" />
                </Button>
              </Card>
            </div>
          ))}
        </Slider>


        <h2 className ={styles.title}>Beach & Parks</h2>
        <p className ={styles.subtitle}>From quick jaunts to full-day outings..</p>
        <Slider {...settings}>
          {beachResults.slice(0, 8).map((activity, index) => (
            <div key={index} className={styles.sliderItem}>
              <Card className={styles.cardStyle}>
                <CardMedia
                  component="img"
                  image={activity.image_url}
                  alt={activity.name}
                  className={styles.cardImage}
                  sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                />
                <Box sx={{ padding: '10px' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {activity.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffbf00' }}>
                    {renderStars(activity.rating)}
                  </Typography>
                  <Typography variant="body2">
                    {activity.review_count} reviews
                  </Typography>
                </Box>
                <Button 
                  className={styles.favButton}
                  onClick={() => toggleFavorite(activity)}
                >
                  <img src={favorites[activity.name] ? filledFav.src : emptyFav.src} alt="Favorite" />
                </Button>
              </Card>
            </div>
          ))}
        </Slider>
        
        <h2 className ={styles.title}>Resturants</h2>
        <p className ={styles.subtitle}>Nothing brings people together like good food</p>
        
        <Slider {...settings}>
          {restaurantResults.slice(0, 8).map((activity, index) => (
            <div key={index} className={styles.sliderItem}>
              <Card className={styles.cardStyle}>
                <CardMedia
                  component="img"
                  image={activity.image_url}
                  alt={activity.name}
                  className={styles.cardImage}
                  sx={{ width: '100%', height: 160, objectFit: 'cover' }}
                />
                <Box sx={{ padding: '10px' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {activity.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffbf00' }}>
                    {renderStars(activity.rating)}
                  </Typography>
                  <Typography variant="body2">
                    {activity.review_count} reviews
                  </Typography>
                </Box>
                <Button 
                  className={styles.favButton}
                  onClick={() => toggleFavorite(activity)}
                >
                  <img src={favorites[activity.name] ? filledFav.src : emptyFav.src} alt="Favorite" />
                </Button>
              </Card>
            </div>
          ))}
        </Slider>
        
        
        </div>
          
          
    </>
  );
}
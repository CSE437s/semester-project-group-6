import { Button, TextField, Box, Card, CardMedia, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { ActivityInfo } from '../CustomTypes';
import Review from "./Review";
import React from 'react';
import styles from './SearchBarYelp.module.css';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import emptyFav from '../public/favorite.png';
import filledFav from '../public/favorite1.png';
import { db } from "../firebase/firebase";
import { push, set, ref } from "firebase/database";

type Props = {
  trip_destination: string | undefined;
  trip_id: string;
  isMobile: boolean;
  sx?: SxProps<Theme>;
};

const SearchBar = ({ trip_destination, trip_id , isMobile, sx }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ActivityInfo[]>([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const addActivity = (activity: ActivityInfo) => {
    const activitiesRef = ref(db, "trips/" + trip_id + "/activities");
    push(activitiesRef, activity)
      .then((newActivityRef) => {
        console.log("New activity added with key:", newActivityRef.key);
      })
      .catch((error) => {
        console.error("Error adding new activity:", error);
      });
  };

  const mapApiResponseToSearchResults = (apiResponse: any): ActivityInfo[] => {
    return apiResponse.map((business: any) => ({
      name: business.name,
      image_url: business.image_url,
      url: business.url,
      review_count: business.review_count,
      rating: business.rating,
      location: business.location,
    }));
  };
  
  useEffect(() => {
    console.log(searchResults); // This will log when searchResults updates
  }, [searchResults]);


  const searchYelp = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/yelp/search-yelp?term=${searchTerm}&location=${trip_destination}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        console.log("Error:", response.statusText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data:", data); // Log the received JSON data
      // Make sure the structure of data matches your expectations
      if (data && data.businesses) {
        const results = mapApiResponseToSearchResults(data.businesses);
        setSearchResults(results);
        setDropdownVisible(results.length > 0); // Only show dropdown if there are results
      } else {
        setDropdownVisible(false); // Hide dropdown if there are no results
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim().length > 0) {
      searchYelp();
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  const handleBlur = () => {
    // Timeout to allow click on dropdown items before hiding
    setTimeout(() => {
      setDropdownVisible(false);
    }, 100);
  };
  const openLinkInNewTab = (url: string) => {
    const newTab = window.open(url, "_blank");
    if (newTab) {
      newTab.focus();
    }
  };
  const [currentImage, setCurrentImage] = useState(emptyFav);
  const toggleImage = () => {
    setCurrentImage(currentImage === emptyFav ? filledFav : emptyFav);
  }

  return (
    <>
      <Box sx={{ position: 'relative' , ...sx}}>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          onBlur={handleBlur}
          
          autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // prevent the default action
              searchYelp(); // call your search function
            }
          }}
          sx={{
            width: isMobile ? '120%' : '120%', // Wider search box, adjust as needed or use fixed value like '500px'
            '& .MuiOutlinedInput-root': {
              height: '40px', // Thinner search box, adjust as needed
              borderRadius: '20px', // Keep the rounded corners
              '& .MuiOutlinedInput-input': {
                padding: '10px 14px ', // Reduce vertical padding to make it thinner
              },
              '& .MuiInputLabel-outlined': {
                lineHeight: '40px', // Adjust label line height if necessary
                transform: 'translate(14px, 14px) scale(1)', // Adjust label position
              },
              '& .MuiInputLabel-shrink': {
                transform: 'translate(14px, -6px) scale(0.75)', // Adjust label position on focus
              },
            },
          }}
        />
        {isDropdownVisible && (
          <Box className={styles.autocompleteDropdownContainer}>
          {searchResults.slice(0, 5).map((activity, index) => (
            <div
              key={index}
              className={styles.container} // Use the container class from Review.module.css
              onClick={() => addActivity(activity)}
            >
              <img
                src={activity.image_url}
                alt={activity.name}
                className={styles.image} // Use the image class from Review.module.css
              />{activity.name}
              <div className={styles.content}> 
                <h2 className={styles.title}>{activity.name}</h2> 
                <div className={styles.rating}> 
                  {"fk"}
                </div>
                <img src="/yelp.svg" alt="Yelp" className={styles.yelpIcon} />
                <div className={styles.reviewCount}>
                  Based on {activity.review_count} reviews
                </div>
              </div>
            </div>
          ))}
        </Box>
        )}
      </Box>
    </>
  );
};

export default SearchBar;
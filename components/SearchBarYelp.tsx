import { Button, TextField, Box, Card, CardMedia, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { ActivityInfo } from '../CustomTypes';
import Review from "./Review";
import React from 'react';
import styles from './SearchBarYelp.module.css';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';


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
          fullWidth={isMobile}
          autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // prevent the default action
              searchYelp(); // call your search function
            }
          }}
          sx={{
            width: isMobile ? '140%' : '30vw', // Wider search box, adjust as needed or use fixed value like '500px'
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
          <Box className={styles.autocompleteDropdownContainer} sx={{ width: '100%' }}>
            {searchResults.slice(0, 5).map((activity, index) => (
              <Card key={index} className={`${styles.dropdownItem} ${index === searchResults.length - 1 ? styles.lastDropdownItem : ''}`}>
                <CardMedia
                  component="img"
                  height="100"
                  image={activity.image_url}
                  alt={activity.name}
                  className={styles.dropdownItemImage}
                />
                <Box sx={{ flexGrow: 1, m: 1 }}>
                  <Typography variant="subtitle1" component="div">
                    {activity.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {"NYC"}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default SearchBar;
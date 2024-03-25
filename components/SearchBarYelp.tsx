import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { ActivityInfo } from '../CustomTypes';
import Review from "./Review";
import React from 'react';


type Props = {
  trip_destination: string | undefined;
  trip_id: string;
};

const SearchBar = ({ trip_destination, trip_id }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ActivityInfo[]>([]);

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
        setSearchResults(mapApiResponseToSearchResults(data.businesses));
        console.log(searchResults);
      } else {
        console.error("Invalid data structure:", data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          id="outlined-basic"
          label= "Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchYelp(); // Call your search function
            }
          }}
          sx={{
            width: '25vw', // Wider search box, adjust as needed or use fixed value like '500px'
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
        {searchResults.map((activity, index) => (
        <Review
          key={index}
          activity={activity}
          tripId={trip_id}
        />
          ))}
        
      </div>
      </>
  );
};
export default SearchBar;

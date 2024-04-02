import {
  Button,
  TextField,
  Box,
  Card,
  CardMedia,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { ActivityInfo } from "../CustomTypes";
import Review from "./Review";
import React from "react";
import styles from "./SearchBarYelp.module.css";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";
import emptyFav from "../public/favorite.png";
import filledFav from "../public/favorite1.png";
import { db } from "../firebase/firebase";
import { push, set, ref, remove } from "firebase/database";
import { TripCardData } from "../CustomTypes";

type Props = {
  trip_destination: string | undefined;
  trip_id: string;
  isMobile: boolean;
  sx?: SxProps<Theme>;
  curTripData: TripCardData | undefined;
  setTripData: React.Dispatch<React.SetStateAction<TripCardData | undefined>>;
  fetchTripData: (tripId: string) => Promise<void>;
};

const SearchBar = ({ trip_destination, trip_id, isMobile, sx, curTripData, setTripData, fetchTripData }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ActivityInfo[]>([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [favorites, setFavorites] = useState<{ [key: string]: string }>({});

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

  const handleBlur = () => {};

  const openLinkInNewTab = (url: string) => {
    const newTab = window.open(url, "_blank");
    if (newTab) {
      newTab.focus();
    }
  };

  return (
    <>
      <Box sx={{ position: "relative", ...sx }}>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          onBlur={handleBlur}
          autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // prevent the default action
              searchYelp(); // call your search function
            }
          }}
          sx={{
            display: 'flex',
            flexGrow: 1,
            width: isMobile ? "100%" : "100%",
            "& .MuiOutlinedInput-root": {
              height: "40px", //
              borderRadius: "20px",
              "& .MuiOutlinedInput-input": {
                padding: "10px 14px ",
              },
              "& .MuiInputLabel-outlined": {
                lineHeight: "40px",
                transform: "translate(14px, 14px) scale(1)", // Adjust label position
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(14px, -6px) scale(0.75)", // Adjust label position on focus
              },
            },
          }}
        />
        
        {isDropdownVisible && (
          <Box
            className={styles.autocompleteDropdownContainer}
            sx={{ width: "150%" }}
          >
            {searchResults.slice(0, 5).map((activity, index) => (
              <Box
                key={index}
                className={styles.dropdownItem}
                // onClick={() => addActivity(activity)} * removing this so that it only adds if you press like
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <Card
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => openLinkInNewTab(activity.url)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={activity.image_url}
                    alt={activity.name}
                    className={styles.dropdownItemImage}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "4px",
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ marginLeft: "10px", flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {activity.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#ffbf00", display: "flex" }}
                      >
                        {renderStars(activity.rating)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ marginLeft: "5px" }}>
                      {activity.review_count} reviews
                    </Typography>
                    {/* <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                    <img src="/yelp.svg" alt="Yelp" style={{ width: '20px', height: 'auto', marginRight: '5px' }} />
                  </Box> */}
                  </Box>
                </Card>
                <div className={styles.favoriteIcon}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the addActivity from being called
                      toggleFavorite(activity);
                      fetchTripData(trip_id);
                    }}
                    className={styles.favorite}
                  >
                    <img
                      src={
                        favorites[activity.name] ? filledFav.src : emptyFav.src
                      }
                      alt="Favorite"
                    />
                  </Button>
                </div>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default SearchBar;

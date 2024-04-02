// TripCard.tsx
import React, { useEffect } from "react";
import styles from "./TripCard.module.css";
import stockImage from "../public/trip-stock-photo.jpg";
import stockImage2 from "../public/f1.png";
import Image from "next/image";
import { Button, Dialog, DialogTitle, TextField } from "@mui/material";
import { ref, getDatabase, push } from "firebase/database";
import { TripCardData } from "../CustomTypes";
import { useState } from "react";
import { auth } from "../firebase/firebase";
import { getAuth, TwitterAuthProvider } from "firebase/auth";
import addPerson from "../public/person-add.svg";
import pin from "../public/pin.svg";
import { async } from "@firebase/util";

type Participant = {
  uid: string,
  firstName: string,
  lastName: string,
  email: string,
  profilePicURL: string

  // imageURL: string;
  // id: string;
};

const TripCard: React.FC<TripCardData & { trip_id: string }> = ({
  trip_name,
  trip_owner,
  start_date,
  end_date,
  participants,
  place_id,
  trip_dest,
  trip_id,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [inviteUser, setInviteUser] = useState("");
  const [imageUrl, setImageUrl] = useState(stockImage.src);
  const service = new google.maps.places.PlacesService(
    document.createElement("div")
  );

  const addParticipant = () => {
    setOpenDialog(!openDialog);
  };

  useEffect(() => {
    const fetchImage = () => {
      const request = {
        placeId: place_id,
        fields: ["photo"],
      };

      service.getDetails(request, (placeResult, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if (placeResult?.photos && placeResult.photos.length > 0) {
            const url = placeResult.photos[0].getUrl({
              maxWidth: 400,
              maxHeight: 400,
            });
            setImageUrl(url); // Set the image URL
          } else {
            console.log("No photos found for this place.");
            setImageUrl(stockImage.src); // Set the default image URL
          }
        } else {
          console.error("Place details request failed:", status);
        }
      });
    };

    fetchImage(); // Call fetchImage function when the component mounts
  }, [place_id]);

  const sendInvite = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/firebase/addParticipant",
        {
          method: "POST",
          body: JSON.stringify({
            userEmail: inviteUser,
            trip_id: trip_id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (response.status === 404) {
        alert(data.error); // Display the error message received from the backend
      } else if (response.status === 200) {
        setInviteUser("");
        alert("New user added successfully!");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("Error sending invitation. Please try again later.");
    }
  };

  return (
    <div className={styles.tripCard}>
      <img src={imageUrl} alt= "Trip Location" className={styles.tripImage} />
      <div className={styles.tripInfo}>
        <h2 className={styles.tripTitle}>{trip_name}</h2>
        <h2 className={styles.tripDest}>📍{trip_dest}</h2>
    
        <div className={styles.participants}>
          <Button onClick={addParticipant} className={styles.invite}>
            <img src={addPerson.src} />
            lnvite
          </Button>

          <Dialog open={openDialog} onClose={addParticipant}>
            <DialogTitle> Send Invitation to User</DialogTitle>
            <TextField
              value={inviteUser}
              onChange={(e) => {
                setInviteUser(e.target.value);
              }}
              type="email"
              label="Input User Email"
              variant="filled"
              required={true}
            ></TextField>
            <Button variant="contained" onClick={sendInvite}>
              {" "}
              send invitation
            </Button>
          </Dialog>

          {/* {participants.map((participant, index) => (
            <Image
              key={index}
              src={stockImage2.src}
              alt={participant.id}
              className={styles.participant}
              width={70}
              height={70}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default TripCard;

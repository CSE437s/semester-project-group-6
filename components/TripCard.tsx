// TripCard.tsx
import React from "react";
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

type Participant = {
  imageURL: string;
  id: string;
};

const TripCard: React.FC<TripCardData & { trip_id: string }> = ({
  trip_name,
  trip_owner,
  start_date,
  end_date,
  participants,
  trip_dest,
  trip_id,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [inviteUser, setInviteUser] = useState("");

  const addParticipant = () => {
    setOpenDialog(!openDialog);
  };

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
        setInviteUser('');
        alert("New user added successfully!");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("Error sending invitation. Please try again later.");
    }
  };
  
  return (
    <div className={styles.tripCard}>
      <img
        src={stockImage.src}
        alt="Trip Location"
        className={styles.tripImage}
      />
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

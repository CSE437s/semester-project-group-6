import { useEffect, useState } from "react";
import styles from "./Trending.module.css";
import {
  ref,
  getDatabase,
  onValue,
  orderByChild,
  equalTo,
} from "firebase/database";
import { db } from "../firebase/firebase";
import { useAuth } from "../firebase/auth";
import TripStockPhoto from "../public/trip-stock-photo.jpg";
import Link from "next/link";
import Image from "next/image";
import Trips from "./trip";

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export default function Trending() {
  const { authUser } = useAuth();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    // Check if authUser is available before fetching trips
    if (authUser?.uid) {
      const tripDatabaseRef = ref(db, "trips/");
      const fetchUserTrips = () => {
        onValue(tripDatabaseRef, (snapshot) => {
          const trips = [];
          snapshot.forEach((childSnapshot) => {
            const trip = childSnapshot.val();
            // Check if the trip's participants node exists and contains the current user's uid
            if (
              trip.participants &&
              Object.values(trip.participants).some(
                (participant) => participant.id === authUser.uid
              )
            ) {
              trips.push({
                tripId: childSnapshot.key,
                ...trip,
              });
            }
          });
          setUserTrips(trips);
        });
      };
      fetchUserTrips();
    }
  }, [authUser]);

  console.log(userTrips);

  return (
      <div className={styles.wrapper}>
        {userTrips.length === 0 && (
          <div className={styles.heading}>
            
            <div>no trips yet? Start your jouney now</div>
          </div>
        )}

      
        <div className ={styles.trending}>
         {userTrips.map((trip) => (
            <div key={trip.tripId} className={styles.card}>
              
              <div className={styles.cardHeader}>
              <div className={styles.cardOverlay}></div>
              <h3 className={styles.cardTitle}>{trip.trip_name}</h3>
              <p className={styles.cardLocation}>📍 {trip.trip_dest}</p>
                <Image
                  src={TripStockPhoto}
                  alt={trip.trip_name}
                  className={styles.cardImg}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardInfo}>
                  <span>{formatDate(trip.start_date)}</span>
                  <span>to</span>
                  <span>{formatDate(trip.end_date)}</span>
                </div>
              </div>
              <Link href={`/ActivityList/${trip.tripId}`}>
                <button className={styles.cardButton}>Enter</button>
              </Link>
              
            </div>
          )
          )}
          <Trips></Trips>
          </div>
      </div>

  );
}

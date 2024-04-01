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
import Enter from "../public/enter.png";

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export default function Trending() {
  const { authUser } = useAuth();
  const [userTrips, setUserTrips] = useState([]);
  
  useEffect(() => {
    if (authUser?.uid) {
      const tripDatabaseRef = ref(db, "trips/");
      onValue(tripDatabaseRef, (snapshot) => {
        const trips = snapshot.val();
        const userTrips = [];
        for (const tripId in trips) {
          const trip = trips[tripId];
          // Assume trip.participants is always an array of objects
          if (trip.participants.some(p => p.uid === authUser.uid)) {
            userTrips.push({
              tripId,
              ...trip,
            });
          }
        }
        setUserTrips(userTrips);
      });
    }
  }, [authUser]);

  console.log(userTrips);

  return (
      <div className={styles.wrapper}>
        {userTrips.length === 0 && (
          <div className={styles.heading}>
            
            <div>No trips yet? Start your jouney now</div>
          </div>
        )}

      
        <div className ={styles.trending}>
         {userTrips.map((trip) => (
            <div key={trip.tripId} className={styles.card}>
              
              <div className={styles.cardHeader}>
              <Link href={`/ActivityList/${trip.tripId}`} className={styles.cardButtonLink}>
                <button className={styles.cardButton}>Enter</button>
              </Link>
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardMonth}>{formatDate(trip.start_date)}</div>
              <h3 className={styles.cardTitle}>{trip.trip_name}</h3>
              <p className={styles.cardLocation}>📍 {trip.trip_dest}</p>
                <Image
                  src={TripStockPhoto}
                  alt={trip.trip_name}
                  className={styles.cardImg}
                />
              </div>
            </div>
          )
          )}
          <Trips></Trips>
          </div>
      </div>

  );
}
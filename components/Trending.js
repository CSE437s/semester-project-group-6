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
    <section className={styles.trending}>
      <div className={styles.heading}>
        <h2>Trips 2024</h2>
        <p>Description</p>
      </div>
      <div className={styles.wrapper}>
        {userTrips.map((trip) => (
          <div key={trip.tripId} className={styles.card}>
            <div className={styles.cardHeader}>
              <Image
                src={TripStockPhoto}
                alt={trip.trip_name}
                className={styles.cardImg}
              />
              <h3 className={styles.cardTitle}>{trip.name}</h3>
              <p className={styles.cardLocation}>{trip.location}</p>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardInfo}>
                <span>Destination: {trip.trip_dest}</span>
                <span>Start Date: {trip.start_date}</span>
                <span>End: {trip.end_date}</span>
              </div>
            </div>
            <Link href={`/ActivityList/${trip.tripId}`}>
              <button className={styles.cardButton}>Enter</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

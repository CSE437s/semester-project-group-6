import { useEffect, useState } from "react";
import styles from "./Trending.module.css";
import {
  ref,
  getDatabase,
  onValue,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import { db } from "../firebase/firebase";
import { useAuth } from "../firebase/auth";
import TripStockPhoto from "../public/trip-stock-photo.jpg";
import Link from "next/link";
import Image from "next/image";
import Trips from "./trip";
import Enter from "../public/enter.png";
import MapLoader from "./mapLoader";
import { async } from "@firebase/util";

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

export default function Trending() {
  const { authUser } = useAuth();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const service = new google.maps.places.PlacesService(
    document.createElement("div")
  );

  useEffect(() => {
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    const fetchImage = (trip) => {
      return new Promise((resolve, reject) => {
        // Check if trip.place_id is defined and not an empty string
        if (!trip.place_id) {
          resolve("https://picsum.photos/seed/picsum/200/300"); // Resolve with the default image URL
          return; // Exit the function
        }
    
        const request = {
          placeId: trip.place_id,
          fields: ["photo"],
        };
    
        const service = new google.maps.places.PlacesService(document.createElement("div"));
        service.getDetails(request, (placeResult, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (placeResult.photos && placeResult.photos.length > 0) {
              const url = placeResult.photos[0].getUrl({
                maxWidth: 400,
                maxHeight: 400,
              });
              resolve(url); // Resolve with the image URL
            } else {
              console.log("No photos found for this place.");
              resolve(TripStockPhoto); // Resolve with the default image URL
            }
          } else {
            console.error("Place details request failed:", status);
            reject(status); // Reject with the error status
          }
        });
      });
    };
    
    
    const fetchUserTrips = async () => {
      const tripDatabaseRef = ref(db, "trips/");
      const snapshot = await get(tripDatabaseRef);
      const trips = [];
      snapshot.forEach((childSnapshot) => {
        const trip = childSnapshot.val();
        if (
          trip.participants &&
          Object.values(trip.participants).some(
            (participant) => participant.uid === authUser.uid
          )
        ) {
          trips.push({
            tripId: childSnapshot.key,
            ...trip,
          });
        }
      });

      // Fetch images for all trips
      const imagePromises = trips.map((trip) => fetchImage(trip));
      const images = await Promise.all(imagePromises);
      const tripsWithImages = trips.map((trip, index) => ({
        ...trip,
        tripImage: images[index],
      }));

      setUserTrips(tripsWithImages);
      setLoading(false);
    };

    if (authUser?.uid) {
      fetchUserTrips();
    }
  }, [authUser, userTrips]);


  
  return (
    <div className={styles.wrapper}>
      {loading && <div>Loading...</div>}
      {!loading && userTrips.length === 0 && (
        <div className={styles.heading}>
          <div>No trips yet? Start your journey now</div>
        </div>
      )}

      <div className={styles.trending}>
        {userTrips.map((trip, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardHeader}>
              <Link
                href={`/ActivityList/${trip.tripId}`}
                className={styles.cardButtonLink}
              >
                <button className={styles.cardButton}>Enter</button>
              </Link>
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardMonth}>
                {formatDate(trip.start_date)}
              </div>
              <h3 className={styles.cardTitle}>{trip.trip_name}</h3>
              <p className={styles.cardLocation}>📍 {trip.trip_dest}</p>
              <img
                src={trip.tripImage || TripStockPhoto}
                alt={trip.trip_name}
                className={styles.cardImg}
                width={400} // Set the width of the image
                height={400}
              />
            </div>
          </div>
        ))}
        <Trips setUserTrips={setUserTrips}></Trips>
      </div>
    </div>
  );
}

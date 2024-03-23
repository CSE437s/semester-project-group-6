import {
  Circle,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import Distance from "../components/distance";
import Places from "../components/places";
import {
  ref,
  get,
  child,
  getDatabase
} from "firebase/database";
import { db } from "../firebase/firebase";
import { useRouter } from 'next/router';

import {
  setKey,
  setDefaults,
  setLanguage,
  setRegion,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from "react-geocode";

import Review from '../components/Review';
import styles from './ReviewsPage.module.css';

setKey("AIzaSyBffWM5IfZJ35qk-UNXUydS8RQTJpeM9x0");
setLanguage("en");
setRegion("es");

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;


export default function Map() {
  const router = useRouter();
  const { tripId } = router.query;
  const trip_id = tripId as string; 
  const [mapCenter, setMapCenter] = useState<LatLngLiteral | null>(null);  
  



  useEffect(() => {
    console.log("Using tripId in Map:", trip_id);
     
  }, [trip_id]);

  useEffect(() => {
    const fetchMapCenter = async () => {
      const center = await getTripDestination(trip_id);
      setMapCenter(center); // This will be `null` or the {lat, lng} object
    };

    if (trip_id) {
      fetchMapCenter();
    }
  }, [trip_id]);

  
  const [office, setOffice] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const [houses, setHouses] = useState<Array<LatLngLiteral>>([]);

  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => mapCenter ?{lat: mapCenter.lat, lng: mapCenter.lng} : { lat: 38.63, lng: -90.2},
    [mapCenter]
  );
  
 
  const options = useMemo<MapOptions>(
    () => ({
      // mapId: "b181cac70f27f5e6",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map: any) => (mapRef.current = map), []);
  
  useEffect(() => {
    // Assuming generateHouses is an async function
    const fetchHouses = async () => {
      const housesData = await generateHouses(center, trip_id);
      setHouses(housesData);
    };
  
    if (trip_id) {
      fetchHouses();
    }
  }, [center]);

  const fetchDirections = (house: LatLngLiteral) => {
    if (!office) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: house,
        destination: office,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };
  
  return (
    <div className="container">
      <div className="controls">
        <h1>Where are you staying?</h1>
        <Places
          setOffice={(position) => {
            setOffice(position);
            mapRef.current?.panTo(position);
          }}
        />
        {!office && <p>Enter an address.</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}

        
        <br></br>
        List of Activities:
        
        



      </div>
      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {office && (
            <>
              <Marker
                position={office}
                icon="https://maps.google.com/mapfiles/kml/shapes/ranger_station.png"
              />

              <MarkerClusterer>
                {clusterer => (
                  <>
                    {houses.map((house, index) => (
                      <Marker
                        key={index}
                        icon = "https://maps.google.com/mapfiles/kml/paddle/red-stars.png"
                        position={house}
                        clusterer={clusterer}
                        onClick={() => fetchDirections(house)}
                      />
                    ))}
                  </>
                )}
              </MarkerClusterer>

              <Circle center={office} radius={15000} options={closeOptions} />
              <Circle center={office} radius={30000} options={middleOptions} />
              <Circle center={office} radius={45000} options={farOptions} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};


// Adjust the type for clarity and correctness
const generateHouses = async (position: LatLngLiteral, trip_id: string): Promise<Array<LatLngLiteral>> => {
  const locationRef = ref(db, "trips/" + trip_id + "/activities");
  const snapshot = await get(locationRef);

  if (snapshot.exists()) {
    const activities = snapshot.val();
    const housesPromises = Object.keys(activities).map(async (key): Promise<LatLngLiteral | null> => {
      const activityData = activities[key];
      const address = activityData.location.address1 + ", "+ activityData.location.city + ", "+ activityData.location.state + ", " + activityData.location.zip_code;
      try {
        const { results } = await fromAddress(address);
        if (results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          return { lat, lng };
        }
        return null;
      } catch (error) {
        console.error(error);
        return null; // Handle errors or invalid addresses by returning null
      }
    });

    // Filter out null values after resolving all promises
    const allHouses = await Promise.all(housesPromises);
    return allHouses.filter((house): house is LatLngLiteral => house !== null);
  } else {
    console.log("No activities found!");
    return [];
  }
};


const getTripDestination = async (trip_id: string): Promise<LatLngLiteral | null> => {
  try {
    const locationRef = ref(db, 'trips/${trip_id}/trip_dest');
    const snapshot = await get(locationRef);

    if (snapshot.exists()) {
      const tripDestinationCity = snapshot.val(); 

      const { results } = await fromAddress(tripDestinationCity);
      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        return { lat, lng };
      }
    }
    return null; // No destination found or no results
  } catch (error) {
    console.error(error);
    return null; // Handle errors by returning null
  }
};


import { ref as firebaseRef, set, push, getDatabase, update } from "firebase/database";
import {app} from "../firebase/firebase"
// import stockProfile from "../public/AnonUser.png";
import stockTrip from "../public/trip-stock-photo.jpg";
const stockProfile = "https://firebasestorage.googleapis.com/v0/b/tripify-93d9a.appspot.com/o/images%2FBeautiful%20China%205k.jpg-3f9b964c-ff0a-48fb-a910-6b64820df9e7?alt=media&token=5edab783-615c-4838-9d8d-c4ca91b39e1c";

export const createUserProfile = (userId, profileDetails) => {
  const database = getDatabase(app);
  const userProfileDatabaseRef = firebaseRef(database, `users/${userId}`);

  const userProfileData = {
    uid: userId,
    firstName: profileDetails.firstName || "New",
    lastName: profileDetails.lastName || "User",
    profilePicURL: profileDetails.profilePicURL || stockProfile, // Use photoURL and the image src
    email: profileDetails.email || "No email provided",
    friendList: [],
    userTrips: [],
    userActivities: []
  };

  set(userProfileDatabaseRef, userProfileData);
};

export const updateUserProfileImage = async (userId, profilePicURL) => {
  const database = getDatabase();

  const userProfileDatabaseRef = firebaseRef(database, `users/${userId}`);

  try {
    await update(userProfileDatabaseRef, { profilePicURL }); // Update photoURL directly
    console.log("User profile image updated in the Realtime Database.");
  } catch (uploadError) {
    console.error("Failed to update profile pic in the Realtime Database", uploadError);
  }
};


// export const addUserTrip = (userId, tripDetails) => {
//   const database = getDatabase();
//   const userTripListRef = firebaseRef(database, `users/${userId}/userTrips`);
//   const tripReference = push(userTripListRef);

//   set(tripReference, {
//     ...tripDetails,
//     tripOwner: userId,
//     participants: [{ id: userId, image: stockTrip }]
//   });
// };

export const addUserTrip = (userId, tripDetails) => {
  const database = getDatabase();
  const userTripListRef = firebaseRef(database, `users/${userId}/userTrips`);
  const tripReference = push(userTripListRef);

  const safeParticipantData = (participant) => {
    return {
      uid: participant.uid || userId,
      firstName: participant.firstName || "Unknown",
      lastName: participant.lastName || "User",
      email: participant.email || "No email provided",
      profilePicURL: participant.profilePicURL || stockProfile, // Use the public URL
    };
  };

  const fallbackParticipant = {
    uid: userId,
    firstName: "Unknown",
    lastName: "User",
    email: "No email provided",
    profilePicURL: stockProfile, // Use the public URL
  };

  const updatedTripDetails = {
    ...tripDetails,
    tripOwner: userId,
    participants: tripDetails.participants?.length
      ? tripDetails.participants.map(safeParticipantData)
      : [fallbackParticipant],
  };

  set(tripReference, updatedTripDetails);
};


export const addUserFriend = (userId, newFriendId) => {
  const database = getDatabase();
  const userFriendListRef = firebaseRef(database, `users/${userId}/friendList`);

  push(userFriendListRef, newFriendId);
};

export const addUserTripActivity = (userId, tripId, activityDetails) => {
  const database = getDatabase();
  const tripActivityListRef = firebaseRef(database, `users/${userId}/userTrips/${tripId}/userActivities`);

  const activityReference = push(tripActivityListRef);
  set(activityReference, activityDetails);
};
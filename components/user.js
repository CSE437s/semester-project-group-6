import { ref as firebaseRef, set, push, getDatabase, update } from "firebase/database";
import stockProfile from "../public/AnonUser.png";
import stockTrip from "../public/trip-stock-photo.jpg";

export const createUserProfile = (userId, profileDetails) => {
  const database = getDatabase();
  const userProfileDatabaseRef = firebaseRef(database, `users/${userId}`);

  const userProfileData = {
    uid: userId,
    firstName: profileDetails.firstName || "New",
    lastName: profileDetails.lastName || "User",
    profilePicURL: profileDetails.profilePicURL || stockProfile.src, // Use photoURL and the image src
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
  
    const participantsWithDetails = tripDetails.participants.map(participant => {
      return {
        uid: participant.uid || userId,
        firstName: participant.firstName || "Unknown",
        lastName: participant.lastName || "User",
        email: participant.email || "No email provided",
        profilePicURL: participant.profilePicURL || stockTrip.src, 
      };
    });
  
    set(tripReference, {
      ...tripDetails,
      tripOwner: userId,
      participants: participantsWithDetails,
    });
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
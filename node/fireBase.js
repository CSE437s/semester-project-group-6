const express = require("express");
const router = express.Router();

const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { ref, push } = require("firebase/database");

var admin = require("firebase-admin");

var serviceAccount = require("./tripify-93d9a-firebase-adminsdk-utxmm-d231b34b0b.json");
const { resolve } = require("path");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tripify-93d9a-default-rtdb.firebaseio.com",
});

router.post("/addParticipant", async (req, res) => {
  const { userEmail, trip_id } = req.body;

  console.log("req:" + userEmail);
  console.log(trip_id);
  admin
    .auth()
    .getUserByEmail(userEmail)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      const dbref = ref(admin.database(), `/trips/${trip_id}/participants`);
      const newUserPush = push(dbref, {
        uid: userRecord.uid,
        email: userRecord.email,
        profilePicURL: userRecord.photoURL,
        firstName: "Unkown",
        lastName: "User",
      });

      console.log(dbref);
      console.log(`Successfully fetched user data: ${userRecord.uid}`);

      res.json(userRecord);
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
    });
});

module.exports = router;

// import StockPhoto from "../public/bike.png";
// import { ActivityInfo } from "../CustomTypes";
// import { Reorder } from "framer-motion";
// import { useState } from "react";
// import ActivityCard from "../components/ActivityCard";
// import styles from "../components/planner.module.css"
// import { style } from "@mui/system";
// import { Button, Dialog, DialogTitle} from "@mui/material";

// export default function Planner() {
//   const [ordering, setOrdering] = useState([0, 1, 2, 3]);
//   const [activityModal, setActivityModal] = useState(false);
//   const Dummy: ActivityInfo = {
//     name: "activity",
//     image_url: StockPhoto.src,
//     rating: 5.0,
//     review_count: 3500,
//     url: "https://mui.com/material-ui/react-card/",
//     location: {},
//     likes: { fdadsa: true },
//   };

//   const fetchTripData = async () => {
//     try {
//       const tripDatabaseRef = ref(db, "trips/" + tripId + "/activities");
//       const tripSnapshot = await get(tripDatabaseRef);
//       if (tripSnapshot.exists()) {
//         const data = tripSnapshot.val();
//         setTripData(data);
//         setTripNotes(data.trip_notes || "");
//       } else {
//         console.error(`Trip with ID ${tripId} not found.`);
//       }
//     } catch (error) {
//       console.error("Error fetching trip data:", error);
//     }
//   };

//   const dummies = [Dummy, Dummy, Dummy, Dummy];
//   return (
//     <>
//       <div className={styles.button} onClick = {() => {setActivityModal(true)}}>
//         <p>+</p>
//       </div>

//       <Dialog open = {activityModal} onClose = {() => setActivityModal(!activityModal)}>
//         <DialogTitle> Add an Activity</DialogTitle>



//       </Dialog>

//       <Reorder.Group
//         axis="y"
//         values={ordering}
//         onReorder={setOrdering}
//       >
//         {ordering.map((index) => (
//           <Reorder.Item value={index} key={index}>
//             <ActivityCard
//               trip_id={"adjskf"}
//               activity_id={"" + index}
//               {...dummies[index]}
//             ></ActivityCard>
//           </Reorder.Item>
//         ))}
//       </Reorder.Group>
//     </>
//   );
// }

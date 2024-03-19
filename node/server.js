const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors")
const app = express();
const PORT = 3001;

app.use(cors())
app.use(express.json());


const yelpRoutes = require("./yelpAPI.js");
const fireBaseRoutes = require("./fireBase.js");

app.use("/yelp", yelpRoutes);
app.use("/firebase", fireBaseRoutes);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

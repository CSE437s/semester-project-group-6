const express = require('express');
const router = express.Router();

router.get("/search-yelp", async (req, res) => {
  const apiKey =
    "nyP-ph8WigzME5C6Yglre7YnuObZvrrTIwnnuq8elph9qYBpP-xdSRe6qxbF_GxrSYRngSJxfcnjuX1nwHQykIzgykJ5F9m8xn55qH-GjH5mnDlNp4l34UzHC1jdZXYx";
  const url = `https://api.yelp.com/v3/businesses/search?location=${req.query.location}&term=${req.query.term}&sort_by=best_match&limit=10`;
  console.log("here")

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.log("error")
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("success")
    console.log(data);
    res.json(data);
    return res;
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
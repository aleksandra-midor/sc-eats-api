const express = require("express");

const app = express();
const { connect } = require("./config/database.js");
app.use(express.json());

app.get("/", (req, res) =>
  res.json({
    message: "works",
  })
);

app.get("/api/v1/restaurants", (req, res) => {
  return res.json(data);
});

const data = {
  restaurants: [],
};
// get, delete, post, put
app.post("/api/v1/restaurants", (req, res) => {
  // console.log(req.body); // body --> sending body
  const { body } = req;
  body._id = data.restaurants.length + 1;
  data.restaurants.push(body);
  return res.json(data);
});

app.get("/api/v1/restaurants/:restaurantId", (req, res) => {
  // getting a parameter
  const { restaurantId } = req.params;
  const restaurant = data.restaurants.find(
    (aRestaurant) => aRestaurant._id === +restaurantId
  );
  return res.json(restaurant);
});
connect();
app.listen(4000, () => console.log("Running"));

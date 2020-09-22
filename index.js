const express = require("express");
const data = require("./data.json");
const fs = require("fs");
const app = express();
const { connect } = require("./config/database.js");
app.use(express.json());

console.log('---- APP START')

app.get("/", (req, res) =>
  res.json({
    message: "works",
  })
);

app.get("/api/v1/restaurants", (req, res) => {
  console.log(data.restarants);
  return res.json(data);
});

// get, delete, post, put
app.post("/api/v1/restaurants", (req, res) => {
  // console.log(req.body); // body --> sending body
  const body = req.body;
  body.id = data.restaurants.length + 1;
  data.restaurants.push(body);
  fs.writeFileSync("./data-test.json", JSON.stringify(data, null, 2));
  return res.json(data);
});

app.put("/api/v1/restaurants", (req, res) => {
  // console.log(req.body); // body --> sending body
  const body = req.body;

  const index = data.restaurants.findIndex(
    (aRestaurant) => aRestaurant.id === +body.id
  );
  console.log(index, data.restaurants.length);
  if (index > -1) {
    data.restaurants.splice(index, 1);
    data.restaurants.push(body);
  }

  fs.writeFileSync("./data-test.json", JSON.stringify(data, null, 2));
  return res.json(data);
});

app.get("/api/v1/restaurants/:restaurantId", (req, res) => {
  // getting a parameter
  const restaurantId = req.params.restaurantId;
  const restaurant = data.restaurants.find(
    (aRestaurant) => aRestaurant.id === +restaurantId
  );
  return res.json(restaurant);
});

app.delete("/api/v1/restaurants/:restaurantId", (req, res) => {
  // getting a parameter
  const restaurantId = req.params.restaurantId;
  const restaurant = data.restaurants.filter(
    (aRestaurant) => aRestaurant.id !== +restaurantId
  );

  fs.writeFileSync("./data-test.json", JSON.stringify(restaurant, null, 2));
  return res.json(restaurant);
});

connect();
app.listen(4000, () => console.log("Running"));

const express = require("express");
const data = require("./data.json");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const app = express();
const { connect } = require("./config/database.js");
app.use(express.json());

console.log("---- APP START");

// app.get("/", (req, res) =>
//   res.json({
//     message: "works",
//   })
// );

app.get("/api/posts", verifyToken, (req, res) => {

  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      res.json({
        message: "Post created..fffff",
        authDate,
      });
    }
  });
});

app.post("/api/login", (req, res) => {
  const user = {
    id: 1,
    username: "Jane",
    email: "jane@gmail.com",
  };

  jwt.sign({ user: user }, "secretkey", (err, token) => {
    res.json({
      token,
    });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  // console.log(bearerHeader);
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    console.log('--- ', req.token)
    next();
  } else {
    res.sendStatus(403);
  }
}

app.get("/api/v1/restaurants", (req, res) => {
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
app.listen(4000, () => console.log("Running on 4000"));



//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWxleCIsImlhdCI6MTYwMDgwMzI1Nn0.d4E9DvucVTfAmpcfCKOL_q3pTmdEiV0Wz74JknI2i3U
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6IkphbmUiLCJlbWFpbCI6ImphbmVAZ21haWwuY29tIn0sImlhdCI6MTYwMDk3ODI3NX0.MdHwzS8GBI5pm56bwZUluJZ9Y_9B4pYiOEqd6suRTvQ
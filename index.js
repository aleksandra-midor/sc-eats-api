const express = require("express");
const data = require("./data.json");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const app = express();
const { connect } = require("./config/database.js");
app.use(express.json());

console.log("---- APP START");

const users = [{
  username: "Mark",
  email: "mark@gmail.com",
  password: "january"
},
{
  username: "Tom",
  email: "tom@gmail.com",
  password: "december"
}]

// login
app.post("/api/v1/login", (req, res) => {
 
  const { body } = req
  const { username } = body
  const { password } = body

  console.log(body)

 const foundUser = users.find(user => {
   return user.username === username && user.password === password
 })
console.log(foundUser)
 if (foundUser) {

   jwt.sign({ user: foundUser }, "secretkey", 
  //  {expiresIn: "1h"}, 
   (err, token) => {
     res.json({
       token,
      });
    });
  } else {
    res.send( { message: 'Username or password are incorrect.'})
  }
  });

  function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];
      req.token = bearerToken;
      console.log("--- ", req.token);
      next();
    } else {
      res.sendStatus(403);
    }
  }
  
// get
app.get("/api/v1/restaurants", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      return res.json(data);
    }
  });
});

// add
app.post("/api/v1/restaurants", verifyToken, (req, res) => {
  // console.log(req.body); // body --> sending body
  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      const body = req.body;
      console.log(body)
      body.id = data.restaurants.length + 1;
      data.restaurants.push(body);

      fs.writeFileSync("./data-test.json", JSON.stringify(data, null, 2));
      return res.json(data);
    }
  });
});

// change
app.put("/api/v1/restaurants", verifyToken, (req, res) => {
  // console.log(req.body); // body --> sending body
  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
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
    }
  });
});

// getting element by a parameter
app.get("/api/v1/restaurants/:restaurantId", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      const restaurantId = req.params.restaurantId;
      const restaurant = data.restaurants.find(
        (aRestaurant) => aRestaurant.id === +restaurantId
      );
      return res.json(restaurant);
    }
  });
});

// deleting element by a parameter
app.delete("/api/v1/restaurants/:restaurantId", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      const restaurantId = req.params.restaurantId;
      const restaurant = data.restaurants.filter(
        (aRestaurant) => aRestaurant.id !== +restaurantId
      );

      fs.writeFileSync("./data-test.json", JSON.stringify(restaurant, null, 2));
      return res.json(restaurant);
    }
  });
});

connect();
app.listen(4000, () => console.log("Running on 4000"));

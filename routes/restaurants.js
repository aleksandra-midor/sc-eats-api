const express = require("express");
const Restaurant = require("../models/restaurants");
const fs = require("fs");
const router = express.Router();
const jwt = require("jsonwebtoken");

// console.log(users)

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

// // get
// router.get("/", verifyToken, (req, res) => {
//   jwt.verify(req.token, "secretkey", (err, authDate) => {
//     if (err) {
//       res.sendStatus(403); //forbidden
//     } else {
//       return res.json(data);
//     }
//   });
// });

// add
router.post("/", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
        const restaurant = new Restaurant({
          name: req.body.name,
          description: req.body.description,
        });
        restaurant.save()
        .then(data => {
          res.json(data)
        })
        .catch(err => {
          res.json({ message: err})
        })
      }
    });
});

// // change
// router.put("/", verifyToken, (req, res) => {
//   jwt.verify(req.token, "secretkey", (err, authDate) => {
//     if (err) {
//       res.sendStatus(403); //forbidden
//     } else {
//       const body = req.body;
//       const index = data.restaurants.findIndex(
//         (aRestaurant) => aRestaurant.id === +body.id
//       );
//       if (index > -1) {
//         data.restaurants.splice(index, 1);
//         data.restaurants.push(body);
//       }

//       fs.writeFileSync("./data-test.json", JSON.stringify(data, null, 2));
//       return res.json(data);
//     }
//   });
// });

// // getting element by a parameter
// router.get("/:restaurantId", verifyToken, (req, res) => {
//   jwt.verify(req.token, "secretkey", (err, authDate) => {
//     if (err) {
//       res.sendStatus(403); //forbidden
//     } else {
//       const restaurantId = req.params.restaurantId;
//       const restaurant = data.restaurants.find(
//         (aRestaurant) => aRestaurant.id === +restaurantId
//       );
//       return res.json(restaurant);
//     }
//   });
// });

// // deleting element by a parameter
// router.delete("/:restaurantId", verifyToken, (req, res) => {
//   jwt.verify(req.token, "secretkey", (err, authDate) => {
//     if (err) {
//       res.sendStatus(403); //forbidden
//     } else {
//       const restaurantId = req.params.restaurantId;
//       const restaurant = data.restaurants.filter(
//         (aRestaurant) => aRestaurant.id !== +restaurantId
//       );

//       fs.writeFileSync("./data-test.json", JSON.stringify(restaurant, null, 2));
//       return res.json(restaurant);
//     }
//   });
// });

module.exports = router;

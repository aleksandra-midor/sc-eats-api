const express = require("express");
const Restaurant = require("../models/restaurants");
const fs = require("fs");
const router = express.Router();
const jwt = require("jsonwebtoken");

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

// get all restaurants
router.get("/", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", async (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      try {
        const allRestaurants = await Restaurant.find();
        res.json(allRestaurants);
      } catch (error) {
        res.json({ message: err });
      }
    }
  });
});

// add a restaurant
router.post("/", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", async (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      const restaurant = new Restaurant({
        name: req.body.name,
        description: req.body.description,
      });
      try {
        const savedRestaurant = await restaurant.save();
        res.json(savedRestaurant);
      } catch (err) {
        res.json({ message: err });
      }
    }
  });
});

// get restaurant by a parameter
router.get("/:restaurantId", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", async (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      try {
        const foundRestaurant = await Restaurant.findById(
          req.params.restaurantId
        );
        res.json(foundRestaurant);
      } catch (error) {
        res.json({ message: error });
      }
    }
  });
});

// delete restaurant by id
router.delete("/:restaurantId", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", async (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      try {
        deletedRestaurant = await Restaurant.remove({
          _id: req.params.restaurantId,
        });
        res.json(deletedRestaurant);
      } catch (err) {
        res.json({ message: err });
      }
    }
  });
});

// change restaurant by id
router.patch("/:restaurantId", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", async (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      try {
        const changedRestaurant = await Restaurant.updateOne(
          { _id: req.params.restaurantId },
          { $set: { name: req.body.name } }
        );
        res.json(changedRestaurant);
      } catch (err) {
        res.json({ message: err });
      }
    }
  });
});

module.exports = router;

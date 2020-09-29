const express = require("express");
const Restaurant = require("../models/restaurants");
const fs = require("fs");
const router = express.Router();
const jwt = require("jsonwebtoken");


function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
    let bearerToken = ''
    if (bearerHeader) {
      bearerToken = bearerHeader.split(" ")[1];
    }
    
    req.token = bearerToken;
  
    jwt.verify(req.token, "secretkey", (err) => {
      if (err) {
        res.sendStatus(403); //forbidden
      } else {
        next();
      }
    } )

}

router.get("/", verifyToken, async (req, res) => {
      try {
        const allRestaurants = await Restaurant.find();
        res.json(allRestaurants);
      } catch (error) {
        res.json({ message: error });
      }
});

// add a restaurant
router.post("/", verifyToken, async (req, res) => {
      const restaurant = new Restaurant({
        name: req.body.name,
        description: req.body.description,
      });
      try {
        const savedRestaurant = await restaurant.save();
        res.json(savedRestaurant);
      } catch (error) {
        res.json({ message: error });
      }
});

// get restaurant by a parameter
router.get("/:restaurantId", verifyToken, async (req, res) => {
      try {
        const foundRestaurant = await Restaurant.findById(
          req.params.restaurantId
        );
        res.json(foundRestaurant);
      } catch (error) {
        res.json({ message: error });
      }
});

// delete restaurant by id
router.delete("/:restaurantId", verifyToken, async (req, res) => {
      try {
        deletedRestaurant = await Restaurant.remove({
          _id: req.params.restaurantId,
        });
        res.json(deletedRestaurant);
      } catch (error) {
        res.json({ message: error });
      }
});

// change restaurant by id
router.patch("/:restaurantId", verifyToken, async (req, res) => {
      try {
        const changedRestaurant = await Restaurant.updateOne(
          { _id: req.params.restaurantId },
          { $set: { name: req.body.name } }
        );
        res.json(changedRestaurant);
      } catch (error) {
        res.json({ message: error });
      }
});

module.exports = router;

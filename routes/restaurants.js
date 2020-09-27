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
  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      Restaurant.find()
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    }
  });
});

// add a restaurant
router.post("/", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      const restaurant = new Restaurant({
        name: req.body.name,
        description: req.body.description,
      });
      restaurant
        .save()
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    }
  });
});

// get restaurant by a parameter
router.get("/:restaurantId", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      Restaurant.findById(req.params.restaurantId)
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    }
  });
});

// delete restaurant by id
router.delete("/:restaurantId", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      Restaurant.remove({ _id: req.params.restaurantId })
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    }
  });
});

// change restaurant by id
router.patch("/:restaurantId", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authDate) => {
    if (err) {
      res.sendStatus(403); //forbidden
    } else {
      Restaurant.updateOne(
        { _id: req.params.restaurantId },
        { $set: { name: req.body.name } }
      )
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    }
  });
});

module.exports = router;

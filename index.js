const express = require("express");
// const data = require("./data.json");
const jwt = require("jsonwebtoken");
const app = express();
const restaurantsRoute = require('./routes/restaurants.js')


const { connect } = require("./config/database.js");


app.use(express.json());

app.use('/api/v1/restaurants', restaurantsRoute)

const users = [
  {
    username: "Mark",
    email: "mark@gmail.com",
    password: "january",
  },
  {
    username: "Tom",
    email: "tom@gmail.com",
    password: "december",
  },
];

// login
app.post("/api/v1/login", (req, res) => {
  const { body } = req;
  const { username } = body;
  const { password } = body;

  const foundUser = users.find((user) => {
    return user.username === username && user.password === password;
  });
  if (foundUser) {
    jwt.sign(
      { user: foundUser },
      "secretkey",
      //  {expiresIn: "1h"},
      (err, token) => {
        res.json({
          token,
        });
      }
    );
  } else {
    res.send({ message: "Username or password are incorrect." });
  }
});


connect();
app.listen(4000, () => console.log("Running on 4000"));


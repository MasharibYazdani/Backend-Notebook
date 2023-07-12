const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "iamagoodb$oy";

//Create a user using:  POST "/api/auth/createuser" - No login required
router.post(
  "/createuser",
  [
    //Using express validator to valid the details
    body("name", "Enter a valid name.").isLength({ min: 3 }),
    body("email", "Enter a valid email.").isEmail(),
    body("password", "Password must be atleast 5 characters.").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    // res.send("Hello");

    //If there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //check whether the user with this email exists already

    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      res.json({ authToken });
    } catch (err) {
      //To catch the errors
      console.error(err.message);
      res.status(500).send("Some error occured");
    }

    // .then((user) => res.json(user))
    // .catch((err) => {
    //   console.log(err);
    //   res.json({
    //     error: "Please a unique value for email",
    //     message: err.message,
    //   });
    // });
  }
);

module.exports = router;

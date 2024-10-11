const express = require("express");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const router = express.Router();

const User = require("../models/User");

router.post("/users/singup", async (req, res) => {
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "missing parameters" });
    }

    const user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if (user) {
      return res.status(409).json({ message: "email already exists" });
    }

    const salt = uid2(64);
    const hash = SHA256(req.body.password + salt).toString(encBase64);
    const token = uid2(64);
    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
        avatar: Object,
      },
      newsletter: req.body.newsletter,
      token: token,
      hash: hash,
      salt: salt,
    });
    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      token: newUser.token,
      account: {
        username: newUser.account.username,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    const hashedPassword = SHA256(req.body.password + user.salt).toString(
      encBase64
    );

    if (hashedPassword === user.hash) {
      return res.status(200).json({
        _id: user._id,
        token: user.token,
        account: user.account,
      });
    } else {
      return res.status(400).json({ message: "email or password incorrect" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

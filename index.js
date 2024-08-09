const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.json());

// Configuration de Cloudinary
mongoose.connect("mongodb://localhost:27017/vinted");

cloudinary.config({
  cloud_name: "dhdhugtxu",
  api_key: "528547696212156",
  api_secret: "dshW8dbZWNUV4b6g0YBVkcigqQk",
});

const userRoutes = require("./routes/user");
app.use(userRoutes);

const offreRoutes = require("./routes/offer");
app.use(offreRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Note Found" });
});

app.listen(3000, () => {
  console.log("Server Started🔥🔥🔥🔥🔥🔥");
});

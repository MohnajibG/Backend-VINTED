const express = require("express");
const fileupload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const Offer = require("../models/Offer");

const router = express.Router();

// import de middleware
const isAuthenticated = require("../middlewares/isAuthenticates");

// Middleware pour le téléchargement de fichiers

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post(
  "/offers/publish",
  fileupload(),
  isAuthenticated,
  async (req, res) => {
    try {
      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ÉTAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city },
        ],
        owner: req.user._id,
      });
      const photoToUplaod = req.files.picture;
      const result = await cloudinary.uploader.upload(
        convertToBase64(photoToUplaod)
      );
      newOffer.product_image = result;
      await newOffer.save();

      const response = {
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ÉTAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city },
        ],
        product_image: result,
        owner: {
          account: req.user.account,
          _id: req.user._id,
        },
      };
      return res.status(201).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/offers", async (req, res) => {
  try {
    const { title, priceMin, priceMax, sort, page } = req.query;
    const filters = {};
    if (title) {
      filters.product_name = new RegExp(title, "i");
    }
    if (priceMin) {
      filters.product_price = { $gte: Number(priceMin) };
    }

    if (priceMax) {
      filters.product_price = { $lte: Number(priceMax) };
    }

    if (sort) {
      sort.product_price = 1;
    } else if (sort === "price-asc") {
      sort.product_price = -1;
    }

    console.log(filters);

    const result = await Offer.find(filters).sort(sort).skip().limit();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

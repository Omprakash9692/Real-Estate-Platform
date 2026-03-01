import Wishlist from "../models/wishlist.model.js";

// ADD
export const addWishlist = async (req, res) => {
  await Wishlist.create({
    user: req.user._id,
    property: req.params.propertyId,
  });

  res.json({
    message: "Added to wishlist",
  });
};

// GET
export const getWishlist = async (req, res) => {
  const data = await Wishlist.find({
    user: req.user._id,
  }).populate("property");

  res.json(data);
};

// REMOVE
export const removeWishlist = async (req, res) => {
  await Wishlist.findOneAndDelete({
    user: req.user._id,
    property: req.params.propertyId,
  });

  res.json({
    message: "Removed",
  });
};

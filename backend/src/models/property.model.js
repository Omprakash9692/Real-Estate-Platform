import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      enum: [
        "flat",
        "apartment",
        "villa",
        "house",
        "studio",
        "penthouse",
        "office",
        "townhouse",
        "plot",
        "commercial",
      ],
      required: true,
    },
    bhk: {
      type: String,
    },
    areaSize: {
      type: Number,
    },
    furnishing: {
      type: String,
      enum: ["furnished", "semi-furnished", "unfurnished"],
    },
    amenities: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["sale", "rent", "sold", "rented"],
      default: "sale",
    },
    images: [{ type: String }],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    viewedBy: [{ type: String }],
    securityDeposit: {
      type: Number,
      default: 0,
    },
    maintenance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
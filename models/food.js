const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 14,
      max: 20,

    },
    price: {
      type: String,
    },
    
  },
  { timestamps: true }
  
);

module.exports = mongoose.model("FoodItem", FoodSchema);
const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      min: 15,
      max: 20,

    },
    roll: {
      type: String,
      required: true,
      max: 10,
      length: 10,
      unique: true,
    },
    age: {
      type: String,
      max: 5,
      length: 5,
    },
    class: {
      type: String,
      max: 14,
      length: 10,
    },
    hall: {
      type: String,
      max: 14,
      length: 10,
    },
    date: {
      type: String,
      max: 15,
      length: 15,
    },
    shift: {
      type: String,
      max: 15,
      length: 15,
    },
    foodItemList:[
      String
    ],
    status: {
      type: String,
      max: 14,
      length: 10,
    },
  },
  { timestamps: true }
  
);

module.exports = mongoose.model("Students", StudentSchema);
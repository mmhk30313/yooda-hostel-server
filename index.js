const express = require("express");
const path = require('path');
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const rootPath = require("./routes/root");
const studentRoute = require("./routes/student");
const foodRoute = require("./routes/food");
// const distributionRoute = require("./routes/distribution");
const cors = require('cors');
const bodyParser = require("body-parser");
dotenv.config();
// Our Express
mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
      console.log("Connected to MongoDB");
    }
);

//middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cors({origin: true}));
app.use(rootPath);
app.use("/api/food", foodRoute);
app.use("/api/student", studentRoute);
// app.use("/api/distribution", distributionRoute);
app.listen(process.env.PORT || port);
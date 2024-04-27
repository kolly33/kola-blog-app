const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongoDB = () => {
     mongoose.connect(process.env.DB);

    mongoose.connection.on("connected", () => {
        console.log("Connection to database is successful");
    });

    mongoose.connection.on("error", (err) => {
        console.log("Connection to database failed", err);
    });
};

module.exports = {connectToMongoDB}
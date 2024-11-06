const mongoose = require("mongoose");
const MONGO_HOST = "mongodb+srv://admin:admin1234!!@cluster0.kctce.mongodb.net";
mongoose
  .connect(MONGO_HOST, {
    retryWrites: true,
    w: "majority",
  })
  .then((db) => {
    console.log("db connection");
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = mongoose;

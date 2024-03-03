const mongoose = require("mongoose");
exports.dbConnect = () => {
  mongoose.connect("mongodb://127.0.0.1:27017/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.error("Error in connecting to DB");
      console.error(err);
      process.exit(1);
    });
};
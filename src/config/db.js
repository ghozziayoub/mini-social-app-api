const mongoose = require("mongoose");
const env = require("./env");

const MONGODB_URL = env.MONGO_URL;

const connectToDB = async () => {
  try {
    const DBConnection = await mongoose.connect(MONGODB_URL);

    console.log(
      "🟢 Connection to database success ! ",
      DBConnection.connection.host
    );
  } catch (error) {
    console.error(error);
    console.log("🔴 Error Connection to database ! ");

    process.exit(1);
  }
};

module.exports = connectToDB;

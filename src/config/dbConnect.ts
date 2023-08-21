const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    if (connection) console.log("Connected to DB");
  } catch (error) {
    console.log("db error: ", error);
  }
};

export default connectToDB;

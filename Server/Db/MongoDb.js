import mongoose from "mongoose";

const db = async (srv) => {
  try {
    await mongoose.connect(
      "mongodb+srv://choudharygaurav884:310886Mongodb@cluster0.yo9cuqs.mongodb.net/food-App"
    ); // Only this line is enough in latest versions
    console.log("Db Connected Successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

export default db;

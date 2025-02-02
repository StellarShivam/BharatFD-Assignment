import mongoose from "mongoose";

const DBConnection = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    if (connection) {
      console.log("DB is connected", connection.host);
    }
  } catch (e) {
    console.log("DB not connected", e);
    process.exit(1);
  }
};
export default DBConnection;

import express from "express";
import cors from "cors";
import { config } from "dotenv";
config();
import DBConnection from "./config/dbConnect.js";
import FaqRoutes from "./routes/faqRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/Faqs", FaqRoutes);
app.listen(process.env.PORT, async () => {
  console.log("Our App is working on " + process.env.PORT);
  await DBConnection();
});
export default app;

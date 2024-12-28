import express from "express";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
dotenv.config(); //to load enviroment variables

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`SERVER IS RUNNING ON PORT ${port} 🚀`);
});

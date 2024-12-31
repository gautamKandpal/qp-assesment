import express from "express";
import user from "./routes/userRoutes";
import auth from "./routes/authRoutes";
import order from "./routes/orderRoutes";
import dotenv from "dotenv";
dotenv.config(); //to load enviroment variables

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/auth", auth);
app.use("/user", user);
app.use("/order", order);

app.listen(port, () => {
  console.log(`SERVER IS RUNNING ON PORT ${port} 🚀`);
});

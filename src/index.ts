import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
const port = 3000;

app.use("/user", userRoutes);

// app.get("/", (req, res) => {
//   res.send("from git project");
// });

app.listen(port, () => {
  console.log(`Backend is running on port: ${port}`);
});

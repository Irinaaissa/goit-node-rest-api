import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import "./db/db.js";
import contactsRouter from "./routes/contactsRouter.js";
import router from "./routes/auth.js"
import authMiddleware from "./middleware/auth.js";
import userRoutes from "./routes/users.js"
import path from "node:path";



const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts",authMiddleware, contactsRouter);
app.use("/users", router);
app.use("/users",userRoutes);
// app.use("/auth",router);

app.use("/avatars",authMiddleware, express.static(path.resolve("public/avatars")));

app.use((_, res) => {
  
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});

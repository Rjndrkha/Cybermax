import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes/index.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/ping", (_req: any, res: any) => {
  res.send("API Running 🚀");
});

app.use("/api", routes);
app.use("/uploads", express.static("uploads"));

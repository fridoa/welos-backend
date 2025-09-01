import express from "express";
import router from "./routes/api";

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running!",
    status: "success",
  });
});

app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

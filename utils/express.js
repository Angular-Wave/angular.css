import express from "express";
const app = express();
const port = 3000;

app.use("/post", express.json());
app.use("/nocontent", express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Change * to your desired origin if needed
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  // Additional headers you may need to allow

  // Set the allowed methods
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }

  next();
});


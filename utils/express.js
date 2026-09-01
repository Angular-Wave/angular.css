import express from "express";
const app = express();
const port = Number(process.env.MOCK_SERVER_PORT ?? 4101);

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

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/post", (req, res) => {
  res.json(req.body);
});

app.post("/nocontent", (_req, res) => {
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Mock server listening on http://localhost:${port}`);
});

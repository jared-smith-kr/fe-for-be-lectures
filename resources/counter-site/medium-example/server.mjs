import express from "express";
import path from "node:path";

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "public")));

let count = 0;
let userInput = 0;

app.get("/sync-count", (_req, res) => {
  console.log(`responding with ${count} ${userInput}`);
  res.json({ count, userInput });
});

app.post("/sync-count", (req, res) => {
  console.log("POST UP");
  const userData = req.body;
  console.log(JSON.stringify(userData));

  if (userData && "count" in userData && "userInput" in userData) {
    ({ count, userInput } = userData);
    console.log(`State is ${count}, ${userInput}`);
  }

  res.status(201).json({
    message: "User data received successfully!",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

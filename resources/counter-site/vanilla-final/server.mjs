import express from "express";
import path from "node:path";

import { DEFAULT_STATE } from "./public/constants.mjs";
import {
  isCompleteState,
  isValidNumeric,
  isValidUpdate,
} from "./public/logic.mjs";

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "public")));

let state = DEFAULT_STATE;

app.get("/sync-count", (_req, res) => {
  res.json(state);
});

app.post("/sync-count", (req, res) => {
  const userData = req.body;

  if (isCompleteState(userData)) {
    const st = Object.entries(userData).reduce((acc, [k, v]) => {
      acc[k] = Number(v);
      return acc;
    }, {});

    if (isValidNumeric(st) && isValidUpdate(state, st)) {
      state = st;
      res.status(201).json({
        message: "User data received successfully!",
      });
    } else {
      console.warn(`Not replacing state with invalid ${JSON.stringify(st)}`);
      res.status(400).send("State older than current server state");
    }
  } else {
    console.warn(`POST is incomplete state: ${JSON.stringify(userData)}`);
    res.status(400).send("Missing fields in POSTed data");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

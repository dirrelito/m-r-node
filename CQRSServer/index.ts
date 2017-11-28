import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { NextFunction, Response } from "express";
import {router} from "./routes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(publicweb));
// console.log(`serving ${publicweb}`);

app.use((req, res, next) => {
  console.log(new Date(), req.method, req.url, req.headers.origin);
  next();
});

app.use(cors({
  exposedHeaders: ["Location", "ETag"],
}));

app.use("/api", router);

app.get("*", (req, res) => {
  // res.sendFile(`index.html`, { root: publicweb });
  res.sendStatus(404);
});

const port = process.env.PORT || "3000";
app.listen(port, () => console.log(`API running on localhost:${port}`));

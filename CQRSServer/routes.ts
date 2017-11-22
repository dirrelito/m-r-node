import * as express from "express";
import {ItemReadModel} from "./item.read.model";

export const router = express.Router();

router.get("/items", (req, res) => {
    ItemReadModel.getItems(req, res);
});

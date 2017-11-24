import * as express from "express";
import {ItemReadModel} from "./item.read.service";

export const router = express.Router();

router.get("/items", (req, res) => {
    ItemReadModel.getItems(req, res);
});

router.get("/item/:id", (req, res) => {
    ItemReadModel.getItem(req, res);
});

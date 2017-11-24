import * as express from "express";
import {ItemReadModel} from "./item.read.service";

export const router = express.Router();

router.get("/", (req, res) => {
    res.json({
            title: "List of commands for this API",
            commands: [

                {command: "List items", url: "/InventoryItem", method: "GET", comment: "Lists all items"},
                {command: "Find item details", url: "/InventoryItem/:id", method: "GET"},
                {command: "Deactivate item", url: "/InventoryItem/:id", method: "DELETE"},
            ],
        });
});

router.get("/InventoryItem", (req, res) => {
    ItemReadModel.getItems(req, res);
});

router.get("/InventoryItem/:id", (req, res) => {
    ItemReadModel.getItem(req, res);
});

router.delete("/InventoryItem/:id", (req, res) => {
    ItemReadModel.deactivateItem(req, res);
});

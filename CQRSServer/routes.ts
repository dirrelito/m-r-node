import * as express from "express";
import { ItemCommandService } from "./item.command.service";
import {ItemReadService} from "./item.read.service";

export const router = express.Router();

router.get("/", (req, res) => {
    res.json({
            commands: [
                {command: "List items", method: "GET",
                 url: "/InventoryItem"},
                {command: "Find item details",  method: "GET",
                 url: "/InventoryItem/:id"},
                {command: "Deactivate item", method: "DELETE",
                 params: "Send http header ETag.",
                 url: "/InventoryItem/:id"},
                {command: "Rename item", method: "PATCH",
                 params: "Send JSON body with field 'name', and http header ETag.",
                 url: "/InventoryItem/:id"},
                {command: "Check in item", method: "POST",
                 params: "Send JSON body with field 'count', and http header ETag.",
                 url: "/InventoryItem/:id/CheckIn"},
                {command: "Remove items", method: "POST",
                 params: "Send JSON body with field 'count', and http header ETag.",
                 url: "/InventoryItem/:id/Remove"},
                {command: "Create item", method: "POST",
                 params: "Send JSON body with field 'name'",
                 url: "/InventoryItem/"},
            ],
            title: "List of commands for this API",
        });
});

router.get("/InventoryItem", (req, res) => {
    ItemReadService.getItems(req, res);
});

router.get("/InventoryItem/:id", (req, res) => {
    ItemReadService.getItem(req, res);
});

router.delete("/InventoryItem/:id", (req, res) => {
    ItemCommandService.deactivateItem(req, res);
});

router.patch("/InventoryItem/:id/", (req, res) => {
    ItemCommandService.renameItem(req, res);
});
router.post("/InventoryItem/:id/CheckIn", (req, res) => {
    ItemCommandService.checkInItems(req, res);
});

router.post("/InventoryItem/:id/Remove", (req, res) => {
    ItemCommandService.removeItems(req, res);
});

router.post("/InventoryItem", (req, res) => {
    ItemCommandService.createItem(req, res);
});

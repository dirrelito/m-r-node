import { Request, Response } from "../node_modules/@types/express/index";
import {RemoveItemsFromInventory, RenameInventoryItem, CheckInItemsToInventory, DeactivateInventoryItem, CreateInventoryItem } from "../SimpleCQRS/Commands";
import {v4 as uuid} from "uuid";

export class ItemCommandService {

    public static renameItem = (req: Request, res: Response) => {
        const newName = req.body.name;
        const expectedVersion = req.body.expectedVersion;
        const id = req.params.id;
        if (newName == null || expectedVersion == null) {
            res.status(422).json("Bad input.");
        } else {
            console.log(new RenameInventoryItem(id, newName, expectedVersion));
            res.json("dispatched rename command!");
        }
    }

    public static removeItems = (req: Request, res: Response) => {
        const count = parseInt(req.body.count, 10);
        const expectedVersion = parseInt(req.body.expectedVersion, 10);
        const id = req.params.id;
        if (isNaN(count)) {
            res.status(422).json("Input 'count' is not a number.");
        } else if (isNaN(expectedVersion) || id == null) {
            res.status(422).json("Bad input.");
        } else {
            console.log(new RemoveItemsFromInventory(id, count, expectedVersion));
            res.json("dispatched remove command!");
        }
    }

    public static checkInItems = (req: Request, res: Response) => {
        const count = parseInt(req.body.count, 10);
        const expectedVersion = parseInt(req.body.expectedVersion, 10);
        const id = req.params.id;
        if (!isNaN(count) && !isNaN(expectedVersion)) {
            console.log(new CheckInItemsToInventory(id, count, expectedVersion));
            res.json("dispatched checkin command!");
        } else {
            res.status(422).json("Bad input.");
        }
    }

    public static deactivateItem = (req: Request, res: Response) => {
        const id = req.params.id;
        const expectedVersion = req.body.version;
        if (id == null || expectedVersion == null) {
            res.status(422).json("bad input.");
        } else {
            console.log(new DeactivateInventoryItem(id, expectedVersion));
            res.json("dispatched deactivate command!");
        }
    }

    public static createItem = (req: Request, res: Response) => {
        const newName = req.body.name;
        const id = uuid();
        console.log(new CreateInventoryItem(id, newName));
        res.location(`/api/IventoryItem/${id}`);
        res.status(202).end();
    }
}

import {v4 as uuid} from "uuid";
import { Request, Response } from "../node_modules/@types/express/index";
import { InventoryCommandHandlers } from "../SimpleCQRS/CommandHandlers";
import {CheckInItemsToInventory, Command, CreateInventoryItem, DeactivateInventoryItem,
     RemoveItemsFromInventory, RenameInventoryItem } from "../SimpleCQRS/Commands";
import { InventoryItem, IRepository, Repository } from "../SimpleCQRS/Domain";
import { EventStore } from "../SimpleCQRS/EventStore";
import { eventbus } from "./eventbus";
import { ReadModel } from "./item.read.model";
import * as e from "etag";

const es = new EventStore(eventbus);
const repo: IRepository<InventoryItem> = new Repository(es, InventoryItem);
const ch = new InventoryCommandHandlers(repo);

eventbus.RegisterHandler({handle: ch.Handle,
                          messagesHandeled: [
                        CreateInventoryItem, RenameInventoryItem, DeactivateInventoryItem
                        , CheckInItemsToInventory, RemoveItemsFromInventory,
                    ]});

export class ItemCommandService {

    public static renameItem = (req: Request, res: Response) => {
        const name = req.body.name;
        const expectedVersion = req.body.expectedVersion;
        const id = req.params.id;
        if (name == null) {
          res.status(422).json("Bad input. Mssing field 'name' in data.");
        } else if (expectedVersion == null) {
            res.status(422).json("Bad input. Mssing field 'expectedVersion' in data.");
        } else {
            eventbus.Send(new RenameInventoryItem(id, name, expectedVersion));
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
            eventbus.Send(new RemoveItemsFromInventory(id, count, expectedVersion));
            res.json("dispatched remove command!");
        }
    }

    public static checkInItems = (req: Request, res: Response) => {
        const count = parseInt(req.body.count, 10);
        const expectedVersion = parseInt(req.body.expectedVersion, 10);
        const id = req.params.id;
        if (!isNaN(count) && !isNaN(expectedVersion)) {
            eventbus.Send(new CheckInItemsToInventory(id, count, expectedVersion));
            res.json("dispatched checkin command!");
        } else {
            res.status(422).json("Bad input.");
        }
    }

    public static deactivateItem = (req: Request, res: Response) => {
        const id = req.params.id;

        const currentItem = ReadModel.readModelFacade.GetInventoryItemDetails(id); // BAD! should be DI'ed.
        const etag = req.headers.etag;

        // generated a weak etag. but the tag i got from headers is prefixed with "W/";
        const e2 = "W/" + e(JSON.stringify(currentItem));

        if (e2 !== etag) {
            res.status(422).json(`Got ETag ${etag} but expected ${e2}`);
        } else {
            eventbus.Send(new DeactivateInventoryItem(id, currentItem.Version));
            res.json("dispatched deactivate command!");
        }
    }

    public static createItem = (req: Request, res: Response) => {
        const newName = req.body.name;
        const id = uuid();
        eventbus.Send(new CreateInventoryItem(id, newName));
        res.location(`/api/IventoryItem/${id}`)
           .status(202)
           .end();
    }
}

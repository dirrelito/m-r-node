import * as e from "etag";
import { v4 as uuid} from "uuid";
import { Request, Response } from "../node_modules/@types/express/index";

import { InventoryCommandHandlers } from "../SimpleCQRS/CommandHandlers";
import { CheckInItemsToInventory, Command, CreateInventoryItem, DeactivateInventoryItem,
     RemoveItemsFromInventory, RenameInventoryItem } from "../SimpleCQRS/Commands";
import { InventoryItem, IRepository, Repository } from "../SimpleCQRS/Domain";
import { EventStore } from "../SimpleCQRS/EventStore";

import { eventbus } from "./eventbus";
import { ReadModel } from "./item.read.model";

type uuid = string;

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
        const newName = req.body.name;
        const id = req.params.id;
        const etag = req.headers.etag;
        const {ETag, Version} = getETagAndVersion(id);

        if (newName == null) {
          res.status(422).json("Bad input. Mssing field 'name' in data.");
        } else  if (ETag !== etag) {
            res.status(422).json(`Got ETag ${etag} but expected ${ETag}`);
        } else {
            eventbus.Send(new RenameInventoryItem(id, newName, Version));
            res.json("dispatched rename command!");
        }
    }

    public static removeItems = (req: Request, res: Response) => {
        const count = parseInt(req.body.count, 10);
        const id = req.params.id;
        const etag = req.headers.etag;
        const {ETag, Version} = getETagAndVersion(id);

        if (isNaN(count)) {
          res.status(422).json("Bad input. 'count' is not a number.");
        } else  if (ETag !== etag) {
          res.status(422).json(`Got ETag ${etag} but expected ${ETag}`);
        } else {
          eventbus.Send(new RemoveItemsFromInventory(id, count, Version));
          res.json("dispatched remove command!");
        }
    }

    public static checkInItems = (req: Request, res: Response) => {
        const count = parseInt(req.body.count, 10);
        const id = req.params.id;
        const etag = req.headers.etag;
        const {ETag, Version} = getETagAndVersion(id);

        if (isNaN(count)) {
          res.status(422).json("Bad input. 'count' is not a number.");
        } else  if (ETag !== etag) {
          res.status(422).json(`Got ETag ${etag} but expected ${ETag}`);
        } else {
          eventbus.Send(new CheckInItemsToInventory(id, count, Version));
          res.json("dispatched checkin command!");
        }
    }

    public static deactivateItem = (req: Request, res: Response) => {
        const id = req.params.id;
        const etag = req.headers.etag;
        const {ETag, Version} = getETagAndVersion(id);

        if (ETag !== etag) {
            res.status(422).json(`Got ETag ${etag} but expected ${ETag}`);
        } else {
            eventbus.Send(new DeactivateInventoryItem(id, Version));
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

const getETagAndVersion = (id: uuid) => {
  // BAD! should be DI'ed.
  const currentItem = ReadModel.readModelFacade.GetInventoryItemDetails(id);
  // etags from express are weak by default, so I add that...
  const ETag = "W/" + e(JSON.stringify(currentItem));
  const Version = currentItem.Version;
  return {ETag, Version};
};

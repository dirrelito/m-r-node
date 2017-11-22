import {InventoryCommandHandlers} from "./SimpleCQRS/CommandHandlers";
import {InventoryItem, IRepository, Repository } from "./SimpleCQRS/Domain";
import {EventBus} from "./SimpleCQRS/EventBus";
import {EventStore} from "./SimpleCQRS/EventStore";
import {InventoryItemDetailView, InventoryListView, ReadModelFacade} from "./SimpleCQRS/ReadModel";

import {CheckInItemsToInventory, CreateInventoryItem, DeactivateInventoryItem,
     RemoveItemsFromInventory, RenameInventoryItem} from "./SimpleCQRS/Commands";
import {InventoryItemCreated, InventoryItemDeactivated
    , InventoryItemRenamed, ItemsCheckedInToInventory, ItemsRemovedFromInventory} from "./SimpleCQRS/Events";

const eb = new EventBus();
const es = new EventStore(eb);
const repo: IRepository<InventoryItem> = new Repository(es, InventoryItem);
const ch = new InventoryCommandHandlers(repo);
const rmf = new ReadModelFacade();
const iidv = new InventoryItemDetailView();
const ilv = new InventoryListView();

eb.RegisterHandler({handle: ch.Handle,
                    messagesHandeled: [
                        CreateInventoryItem, RenameInventoryItem, DeactivateInventoryItem
                        , CheckInItemsToInventory, RemoveItemsFromInventory,
                    ]});
eb.RegisterHandler({handle: iidv.Handle,
                    messagesHandeled: [
                        InventoryItemCreated, InventoryItemDeactivated
                        , InventoryItemRenamed, ItemsCheckedInToInventory, ItemsRemovedFromInventory,
                    ]});
eb.RegisterHandler({handle: ilv.Handle,
                    messagesHandeled: [
                        InventoryItemCreated, InventoryItemDeactivated, InventoryItemRenamed,
                    ]});

eb.Send(new CreateInventoryItem("id1", "Mutter"));
eb.Send(new RenameInventoryItem("id1", "Mutter model 1", 0));
eb.Send(new DeactivateInventoryItem("id1", 1));

eb.Send(new CreateInventoryItem("id2", "Mutter model 2"));
eb.Send(new CheckInItemsToInventory("id2", 7, 0));
eb.Send(new RemoveItemsFromInventory("id2", 3, 1));
eb.Send(new RenameInventoryItem("id2", "Mutter no2", 2));

console.log("\n\nList from Readmodel:", rmf.GetInventoryItems());
console.log("\n\nDetails Readmodel:", rmf.GetInventoryItemDetails("id2"));

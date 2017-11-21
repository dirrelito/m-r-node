import {InventoryCommandHandlers} from "./SimpleCQRS/CommandHandlers";
import {InventoryItem, IRepository, Repository } from "./SimpleCQRS/Domain";
import {EventBus} from "./SimpleCQRS/EventBus";
import {EventStore} from "./SimpleCQRS/EventStore";
import {InventoryItemDetailView, InventoryListView, ReadModelFacade} from "./SimpleCQRS/ReadModel";

import {CreateInventoryItem, DeactivateInventoryItem, RenameInventoryItem} from "./SimpleCQRS/Commands";
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
                        CreateInventoryItem, RenameInventoryItem, DeactivateInventoryItem,
                    ]});
eb.RegisterHandler({handle: iidv.Handle,
                    messagesHandeled: [InventoryItemCreated, InventoryItemDeactivated
                        , InventoryItemRenamed, ItemsCheckedInToInventory, ItemsRemovedFromInventory]});
eb.RegisterHandler({handle: ilv.Handle,
                    messagesHandeled: [InventoryItemCreated, InventoryItemDeactivated, InventoryItemRenamed]});

eb.Send(new CreateInventoryItem("123", "hej"));
eb.Send(new RenameInventoryItem("123", "mutter", 0));
eb.Send(new DeactivateInventoryItem("123", 1));

eb.Send(new CreateInventoryItem("321", "Gurka"));
eb.Send(new RenameInventoryItem("321", "Bonde", 0));

console.log("\n\nList from Readmodel:",rmf.GetInventoryItems());
console.log("\n\nDetails Readmodel:",rmf.GetInventoryItemDetails("321"));

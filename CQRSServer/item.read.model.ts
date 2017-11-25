import { InventoryItemCreated, InventoryItemDeactivated, InventoryItemRenamed,
     ItemsCheckedInToInventory, ItemsRemovedFromInventory } from "../SimpleCQRS/Events";
import {InventoryItemDetailView, InventoryListView, IReadModelFacade, ReadModelFacade} from "../SimpleCQRS/ReadModel";
import {eventbus} from "./eventbus";

const rmf = new ReadModelFacade();
const iidv = new InventoryItemDetailView();
const ilv = new InventoryListView();

eventbus.RegisterHandler({handle: iidv.Handle,
                          messagesHandeled: [
                        InventoryItemCreated, InventoryItemDeactivated
                        , InventoryItemRenamed, ItemsCheckedInToInventory, ItemsRemovedFromInventory,
                    ]});
eventbus.RegisterHandler({handle: ilv.Handle,
                          messagesHandeled: [
                        InventoryItemCreated, InventoryItemDeactivated, InventoryItemRenamed,
                    ]});

export class ReadModel {
    public static readModelFacade: IReadModelFacade = rmf;
}

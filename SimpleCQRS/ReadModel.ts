import {InventoryItemCreated, InventoryItemDeactivated, InventoryItemRenamed,
     ItemsCheckedInToInventory, ItemsRemovedFromInventory} from "./Events";
import {Message} from "./Message";

type uuid = string;

export interface IReadModelFacade {
    GetInventoryItems: () => Iterable<InventoryItemListDto>;
    GetInventoryItemDetails: (id: uuid) => InventoryItemDetailsDto;
}

class InventoryItemDetailsDto {
    public id: uuid ;
    public name: string ;
    public currentCount: number ;
    public version: number ;

    constructor(id: uuid,  name: string,  currentCount: number, Version: number) {
        this.id = id;
        this.name = name;
        this.currentCount = currentCount;
        this.version = Version;
    }
}

class InventoryItemListDto {
    constructor(public id: uuid, public name: string) {}
}

export class InventoryListView {

        public Handle(message: InventoryItemCreated | InventoryItemRenamed | InventoryItemDeactivated) {

        if (message instanceof InventoryItemCreated) {
            BullShitDatabase.list.push(new InventoryItemListDto(message.id, message.name));

        } else if (message instanceof InventoryItemRenamed) {
            const itemPos = BullShitDatabase.list.findIndex(x => x.id === message.id);
            BullShitDatabase.list[itemPos].name = message.newName;

        } else if (message instanceof InventoryItemDeactivated) {
            BullShitDatabase.list = BullShitDatabase.list.filter(x => x.id !== message.id);

        } else {
            throw new Error("This Handler cannot handle this message type!");
        }
    }
}

export class InventoryItemDetailView {

    private static GetDetailsItem(id: uuid) {
        const d = BullShitDatabase.details.get(id);
        if (typeof d === "undefined") { throw Error("This shouldnt happen. Did not find details!"); }
        return d;
    }

    public Handle(message: ItemsCheckedInToInventory | ItemsRemovedFromInventory | InventoryItemCreated |
        InventoryItemDeactivated | InventoryItemRenamed) {

        // console.log(new Date(), "Handling DomainEvent in readmodel", message);

        if (message instanceof InventoryItemCreated) {
            BullShitDatabase.details.set(message.id, new InventoryItemDetailsDto(message.id, message.name, 0, 0));

        } else if (message instanceof InventoryItemRenamed) {
            const d = InventoryItemDetailView.GetDetailsItem(message.id);
            d.version = message.version;
            d.name = message.newName;
            BullShitDatabase.details.set(message.id, d);

        } else if (message instanceof ItemsCheckedInToInventory) {
            const d = InventoryItemDetailView.GetDetailsItem(message.id);
            d.version = message.version;
            d.currentCount = d.currentCount + message.count;
            BullShitDatabase.details.set(message.id, d);

        } else if (message instanceof ItemsRemovedFromInventory) {
            const d: InventoryItemDetailsDto = InventoryItemDetailView.GetDetailsItem(message.id);
            d.version = message.version;
            d.currentCount = d.currentCount - message.count;
            BullShitDatabase.details.set(message.id, d);

        } else if (message instanceof InventoryItemDeactivated) {
            BullShitDatabase.details.delete(message.id);

        }  else {
            throw new Error("This Handler cannot handle this message type!");
        }
    }

}

export class ReadModelFacade implements IReadModelFacade {
    public GetInventoryItems() {
        return BullShitDatabase.list;
    }

    public GetInventoryItemDetails(id: uuid) {
        return BullShitDatabase.details.get(id);
    }
}

class BullShitDatabase {
    public static details: Map<uuid, InventoryItemDetailsDto> = new Map();
    public static list: InventoryItemListDto[] = [];
}

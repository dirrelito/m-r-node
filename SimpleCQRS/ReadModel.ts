import {InventoryItemCreated, InventoryItemDeactivated, InventoryItemRenamed,
     ItemsCheckedInToInventory, ItemsRemovedFromInventory} from "./Events";
import {Message} from "./Message";

type uuid = string;

export interface IReadModelFacade {
    GetInventoryItems: () => Iterable<InventoryItemListDto>;
    GetInventoryItemDetails: (id: uuid) => InventoryItemDetailsDto;
}

class InventoryItemDetailsDto {
    public Id: uuid ;
    public Name: string ;
    public CurrentCount: number ;
    public Version: number ;

    constructor(id: uuid,  name: string,  currentCount: number, Version: number) {
        this.Id = id;
        this.Name = name;
        this.CurrentCount = currentCount;
        this.Version = Version;
    }
}

class InventoryItemListDto {
    public Id: uuid;
    public Name: string;

    constructor(id: uuid, name: string) {
        this.Id = id;
        this.Name = name;
    }
}

export class InventoryListView {

        public Handle(message: InventoryItemCreated | InventoryItemRenamed | InventoryItemDeactivated) {

        if (message instanceof InventoryItemCreated) {
            BullShitDatabase.list.push(new InventoryItemListDto(message.id, message.name));

        } else if (message instanceof InventoryItemRenamed) {
            const itemPos = BullShitDatabase.list.findIndex(x => x.Id === message.id);
            BullShitDatabase.list[itemPos].Name = message.newName;

        } else if (message instanceof InventoryItemDeactivated) {
            BullShitDatabase.list = BullShitDatabase.list.filter(x => x.Id !== message.id);

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

        if (message instanceof InventoryItemCreated) {
            BullShitDatabase.details.set(message.id, new InventoryItemDetailsDto(message.id, message.name, 0, 0));

        } else if (message instanceof InventoryItemRenamed) {
            const d = InventoryItemDetailView.GetDetailsItem(message.id);
            d.Version = message.version;
            d.Name = message.newName;
            BullShitDatabase.details.set(message.id, d);

        } else if (message instanceof ItemsCheckedInToInventory) {
            const d = InventoryItemDetailView.GetDetailsItem(message.id);
            d.Version = message.version;
            d.CurrentCount = d.CurrentCount + message.count;
            BullShitDatabase.details.set(message.id, d);

        } else if (message instanceof ItemsRemovedFromInventory) {
            const d: InventoryItemDetailsDto = InventoryItemDetailView.GetDetailsItem(message.id);
            d.Version = message.version;
            d.CurrentCount = d.CurrentCount - message.count;
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

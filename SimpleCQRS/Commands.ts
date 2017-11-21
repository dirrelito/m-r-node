type uuid = string;

export class Command {}

export class DeactivateInventoryItem extends Command {
    public id: uuid;
    public originalVersion: number;
    constructor(id, version) {
        super();
        this.id = id;
        this.originalVersion = version;
    }
}

export class CreateInventoryItem extends Command {
    public inventoryItemId: uuid;
    public name: string;
    constructor(id, name) {
        super();
        this.inventoryItemId = id;
        this.name = name;
    }
}

export class RenameInventoryItem extends Command {
    public InventoryItemId: uuid;
    public NewName: uuid;
    public OriginalVersion: number;
    constructor(i, name, v) {
        super();
        this.NewName = name;
        this.InventoryItemId = i;
        this.OriginalVersion = v;
    }
}

export class CheckInItemsToInventory extends Command {
    public InventoryItemId: uuid;
    public Count: number;
    public OriginalVersion: number;
    constructor(i, c, v) {
        super();
        this.Count = c;
        this.InventoryItemId = i;
        this.OriginalVersion = v;
    }
}

export  class RemoveItemsFromInventory extends Command {
    public InventoryItemId: uuid;
    public Count: number;
    public OriginalVersion: number;
    constructor(i, c, v) {
        super();
        this.Count = c;
        this.InventoryItemId = i;
        this.OriginalVersion = v;
    }
}

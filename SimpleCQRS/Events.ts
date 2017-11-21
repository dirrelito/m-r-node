type uuid = string;

export class DomainEvent {
    public version: number;
}

export class InventoryItemDeactivated extends DomainEvent {
    public Id: uuid;
    constructor(id) {
        super();
        this.Id = id;
    }

}

export class InventoryItemCreated extends DomainEvent {
    public Id: uuid;
    public Name: string;
    constructor(id: uuid, name: string) {
        super();
        this.Id = id;
        this.Name = name;
    }
}

export class InventoryItemRenamed extends DomainEvent {
    public Id: uuid;
    public NewName: string;
    constructor(id, newName) {
        super();
        this.Id = id;
        this.NewName = newName;
    }
}

export class ItemsCheckedInToInventory extends DomainEvent {
    public  Id: uuid;
    public readonly Count: number;
    constructor(id, count) {
        super();
        this.Id = id;
        this.Count = count;
    }
}

export class ItemsRemovedFromInventory extends DomainEvent {
    public  Id: uuid;
    public readonly Count: uuid;
    constructor(id, count) {
        super();
        this.Id = id;
        this.Count = count;
    }
}

type uuid = string;

export class DomainEvent {
    public Version: number;
    constructor(Version: number) {
        this.Version = Version;
    }
}

export class InventoryItemDeactivated extends DomainEvent {
    public Id: uuid;
    constructor(id, Version) {
        super(Version);
        this.Id = id;
    }

}

export class InventoryItemCreated extends DomainEvent {
    public Id: uuid;
    public Name: string;
    constructor(id: uuid, name: string, Version) {
        super(Version);
        this.Id = id;
        this.Name = name;
    }
}

export class InventoryItemRenamed extends DomainEvent {
    public Id: uuid;
    public NewName: string;
    constructor(id, newName, Version) {
        super(Version);
        this.Id = id;
        this.NewName = newName;
    }
}

export class ItemsCheckedInToInventory extends DomainEvent {
    public  Id: uuid;
    public readonly Count: number;
    constructor(id, count, Version) {
        super(Version);
        this.Id = id;
        this.Count = count;
    }
}

export class ItemsRemovedFromInventory extends DomainEvent {
    public  Id: uuid;
    public readonly Count: number;
    constructor(id, count, Version) {
        super(Version);
        this.Id = id;
        this.Count = count;
    }
}

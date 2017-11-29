import { Message } from "./Message";

type uuid = string;

export class DomainEvent extends Message {
    public version: number;
}

export class InventoryItemDeactivated extends DomainEvent {
    constructor(public id: uuid) { super(); }
}

export class InventoryItemCreated extends DomainEvent {
    constructor(public id: uuid, public name: string) { super(); }
}

export class InventoryItemRenamed extends DomainEvent {
    constructor(public id, public newName) { super(); }
}

export class ItemsCheckedInToInventory extends DomainEvent {
    constructor(public id, public count) { super(); }
}

export class ItemsRemovedFromInventory extends DomainEvent {
    constructor(public id, public readonly count) { super(); }
}

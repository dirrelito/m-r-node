import { Message } from "./Message";

type uuid = string;

export class Command extends Message { }

export class DeactivateInventoryItem extends Command {
    constructor(public id: uuid, public version: number) { super(); }
}

export class CreateInventoryItem extends Command {
    constructor(public id, public name) { super(); }
}

export class RenameInventoryItem extends Command {
    constructor(public id, public name, public version: number) { super(); }
}

export class CheckInItemsToInventory extends Command {
    constructor(public id, public count, public version: number) { super(); }
}

export  class RemoveItemsFromInventory extends Command {
    constructor(public id, public count, public version: number) { super(); }
}

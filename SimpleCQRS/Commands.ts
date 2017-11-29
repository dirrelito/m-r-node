import { Message } from "./Message";

type uuid = string;

export class Command extends Message {
  constructor(public type: string) { super(); }
}

export class DeactivateInventoryItem extends Command {
    constructor(public id: uuid, public version: number) {
        super("DeactivateInventoryItem");
    }
}

export class CreateInventoryItem extends Command {
    constructor(public id, public name) {
        super("CreateInventoryItem");
    }
}

export class RenameInventoryItem extends Command {
    constructor(public id, public name, public version: number) {
        super("RenameInventoryItem");
    }
}

export class CheckInItemsToInventory extends Command {
    constructor(public id, public count, public version: number) {
        super("CheckInItemsToInventory");
    }
}

export  class RemoveItemsFromInventory extends Command {
    constructor(public id, public count, public version: number) {
        super("RemoveItemsFromInventory");
    }
}

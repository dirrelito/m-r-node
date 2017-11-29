import {CheckInItemsToInventory, Command
    , CreateInventoryItem, DeactivateInventoryItem, RemoveItemsFromInventory, RenameInventoryItem} from "./Commands";
import {InventoryItem, IRepository} from "./Domain";

export class InventoryCommandHandlers {
    private  repository: IRepository<InventoryItem>;

    public constructor(repository: IRepository<InventoryItem>) {
        this.repository = repository;
    }

    public  Handle = (message: Command) => {
        let i;
        if (message instanceof CreateInventoryItem) {
            i = new InventoryItem(message.id, message.name);
            this.repository.Save(i, -1);

        } else if (message instanceof DeactivateInventoryItem) {
            i = this.repository.GetById(message.id);
            i.Deactivate();
            this.repository.Save(i, message.version);

        } else if (message instanceof RemoveItemsFromInventory) {
            i = this.repository.GetById(message.id);
            i.Remove(message.count);
            this.repository.Save(i, message.version);

        } else if (message instanceof CheckInItemsToInventory) {
            i = this.repository.GetById(message.id);
            i.CheckIn(message.count);
            this.repository.Save(i, message.version);

        } else if (message instanceof RenameInventoryItem) {
            i  = this.repository.GetById(message.id);
            i.ChangeName(message.name);
            this.repository.Save(i, message.version);

        } else {
            throw new InvalidHandlerError("This handler cannot handle this command!");
        }
    }
}

class InvalidHandlerError extends Error {}

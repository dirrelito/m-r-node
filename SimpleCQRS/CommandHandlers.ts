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
            // console.log("created new")
            i = new InventoryItem(message.inventoryItemId, message.name);
            // console.log("when handling:", message, i)
            this.repository.Save(i, -1);

        } else if (message instanceof DeactivateInventoryItem) {
            // console.log("deactivate");
            i = this.repository.GetById(message.id);
            i.Deactivate();
            this.repository.Save(i, message.originalVersion);

        } else if (message instanceof RemoveItemsFromInventory) {
            i = this.repository.GetById(message.InventoryItemId);
            i.Remove(message.Count);
            this.repository.Save(i, message.OriginalVersion);

        } else if (message instanceof CheckInItemsToInventory) {
            i = this.repository.GetById(message.InventoryItemId);
            i.CheckIn(message.Count);
            this.repository.Save(i, message.OriginalVersion);

        } else if (message instanceof RenameInventoryItem) {
            // console.log("renamed");
            i  = this.repository.GetById(message.InventoryItemId);
            // console.log("before renaming:", i);
            i.ChangeName(message.NewName);
            // console.log("after renaming:", i);
            this.repository.Save(i, message.OriginalVersion);

        } else {
            throw new InvalidHandlerError("This handler cannot handle this command!");
        }
    }
}

class InvalidHandlerError extends Error {}

type uuid = string;
import {DomainEvent, InventoryItemCreated, InventoryItemDeactivated
    , InventoryItemRenamed, ItemsCheckedInToInventory, ItemsRemovedFromInventory} from "./Events";
import {IEventStore} from "./EventStore";

abstract class AggregateRoot {
    public Version: number;
    public id: uuid;
    private unCommittedChanges: DomainEvent[]  = [];

    public abstract Apply(event: DomainEvent): void; // how to apply an event to the Aggregate

    public GetUncommittedChanges() {return this.unCommittedChanges[Symbol.iterator](); }

    public MarkChangesAsCommitted() {this.unCommittedChanges = []; }

    public LoadsFromHistory(history: DomainEvent[]) {
        // console.log("Commencing load of history:", history);
        for (const event of history) {
            // console.log("Applying event:", event," onto the state ",this);
            this.ApplyChange2(event, false);
            // console.log("After applying event:",this)
        }
    }

    protected ApplyChange1(event: DomainEvent) { this.ApplyChange2(event, true); }

    // push atomic aggregate changes to local history for further processing (EventStore.SaveEvents)
    private ApplyChange2(event: DomainEvent,  isNew: boolean) {
        // console.log("apply2.1", event);
        this.Apply(event);
        if (isNew) { this.unCommittedChanges.push(event); }
    }
}
export class InventoryItem extends AggregateRoot {
    public activated: boolean;
    public id: uuid;
    public Version: number;

    constructor();
    constructor(id: uuid, name: string);
    constructor(id?: uuid, name?: string) {
        super();
        if (id && name) { this.ApplyChange1(new InventoryItemCreated(id, name));} 
    }

    public Apply(event: DomainEvent) {
        if (event instanceof InventoryItemCreated) {
            this.id = event.Id;
            this.activated = true;
        } else if (event instanceof InventoryItemDeactivated) {
            this.activated = false;
        }
    }

    public  ChangeName(newName: string) {
        if (newName == null) {throw new ArgumentError("newName"); }
        this.ApplyChange1(new InventoryItemRenamed(this.id, newName));
    }

    public Remove(count: number) {
        if (count <= 0) { throw new InvalidOperationError("cant remove negative count from inventory"); }
        this.ApplyChange1(new ItemsRemovedFromInventory(this.id, count));
    }

    public CheckIn(count: number) {
        if (count <= 0) { throw new InvalidOperationError("must have a count greater than 0 to add to inventory"); }
        this.ApplyChange1(new ItemsCheckedInToInventory(this.id, count));
    }

    public Deactivate() {
        if (!this.activated) { throw new InvalidOperationError("already deactivated"); }
        this.ApplyChange1(new InventoryItemDeactivated(this.id));
    }

}

export interface IRepository<T extends AggregateRoot> {
    Save: (aggregate: AggregateRoot , expectedVersion: number) => void;
    GetById: (id: uuid) => T;
}

export class Repository<T extends AggregateRoot> implements IRepository<T> {
    private storage: IEventStore;
    private factory;

    public constructor(storage: IEventStore, objectFactory) {
        this.storage = storage;
        this.factory = objectFactory;
    }

    public Save(aggregate: AggregateRoot,  expectedVersion: number) {
        // console.log("when saving:",aggregate,expectedVersion)
        this.storage.SaveEvents(aggregate.id, aggregate.GetUncommittedChanges(), expectedVersion);
    }

    public GetById(id: uuid): T {
        const obj: T = new this.factory(); // this doesn't work, since it calls a 2-arg-constructor using 0 args.
        // console.log("the 'clean' state to apply on", obj);
        const events = this.storage.GetEventsForAggregate(id);
        // console.log("events to reconstruct from", events);
        obj.LoadsFromHistory(events);
        // console.log("reconstructed object", obj);
        return obj;
    }
}

class NotImplementedError extends Error {}
class ArgumentError extends Error {}
class InvalidOperationError extends Error {}

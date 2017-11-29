import {IEventPublisher} from "./EventBus";
import {DomainEvent} from "./Events";

type uuid = string;

export interface IEventStore {
    SaveEvents: (aggregateId: uuid, events: Iterator<DomainEvent>, expectedVersion: number) => void;
    GetEventsForAggregate: (aggregateId: uuid) => DomainEvent[];
}

export class EventStore implements IEventStore {
    private readonly current: Map<uuid, EventDescriptor[]>  = new Map();

    constructor(private readonly publisher: IEventPublisher) {}

    public SaveEvents = (aggregateId, eventsToCommit, expectedVersion) => {

        // try to get event descriptors list for given aggregate id
        let eventDescriptors = this.current.get(aggregateId);
        // otherwise -> create empty dictionary
        if (typeof eventDescriptors === "undefined") {
          eventDescriptors = [];
          this.current.set(aggregateId, eventDescriptors);
          // console.log(new Date(), "New Aggregate", aggregateId, eventsToCommit, expectedVersion);

          // check whether latest event version matches current aggregate version
          // otherwise -> throw Error
        } else if (
          eventDescriptors[eventDescriptors.length - 1].Version !== expectedVersion
          && expectedVersion !== -1) {
            throw new ConcurrencyError();
        }
        let i = expectedVersion;

          // iterate through current aggregate events increasing version with each processed event
        for (const thisEvent of eventsToCommit) {
            i = i + 1;
            thisEvent.Version = i;

            // push event to the event descriptors list for current aggregate
            eventDescriptors.push(new EventDescriptor(aggregateId, thisEvent, i));

            // publish current event to the bus for further processing by subscribers
            this.publisher.Publish(thisEvent);
        }

    }

    public GetEventsForAggregate = (aggregateId: uuid) => {

        const eventDescriptors = this.current.get(aggregateId);

        if (typeof eventDescriptors === "undefined") {
            throw new AggregateNotFoundError(`Could not find aggregate ${aggregateId}.
            The known aggregates are: ${[...this.current.keys()]}`);
        } else {
            return eventDescriptors.map(desc => desc.EventData);
        }
    }
}

class EventDescriptor {
    public readonly EventData: DomainEvent;
    public readonly Id: uuid;
    public readonly Version: number;

    constructor(id: uuid, eventData: DomainEvent, version: number) {
        this.EventData = eventData;
        this.Version = version;
        this.Id = id;
    }
}

class ConcurrencyError extends Error {}

class AggregateNotFoundError extends Error {}

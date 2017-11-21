import {Command} from "./Commands";
import {DomainEvent} from "./Events";
import {Message} from "./Message";

type Action<T> = (T) => void;

interface IMessageHandler<T extends Message> {
    messagesHandeled: T[];
    handle: Action<T>;
}

export class EventBus implements ICommandSender, IEventPublisher {

    private routes: Map<Message, Array<Action<Message>>> = new Map();

    public RegisterHandler(handler: IMessageHandler<Message>) {
        handler.messagesHandeled.forEach(messageHandled => {
            let handlers = this.routes.get(messageHandled);

            if (typeof handlers === "undefined") {
                handlers = [];
                this.routes.set(messageHandled, handlers);
            }

            handlers.push(handler.handle);
            // console.log(`added listener for ${messageHandled}`)
        });
    }

    public Send = (command: Command) => {
        // find class at runtime using the constructor chain. N.B. all events must be created with correct class
        const commandClass = command.constructor;
        const handlers = this.routes.get(commandClass);
        if (typeof handlers === "undefined") {
            throw new InvalidOperationError(`no handler registered to deal with event of type ${commandClass}`);
        } else if (handlers.length !== 1) {
            throw new InvalidOperationError("cannot send to more than one handler!");
        } else {
            handlers.forEach(fun => fun(command));
        }
    }

    public Publish = event => {
        // console.log(`looking for handlers for event ${event.constructor}`)
        const handlers = this.routes.get(event.constructor);
        if (typeof handlers === "undefined") {
            // console.log(`Found none!`)
            return;
        } else {
            handlers.forEach(fun => fun(event));
        }
    }
}

interface ICommandSender {
    Send: <T extends Command>(command: T) => void;
}

export interface IEventPublisher {
    Publish: <T extends DomainEvent> (event: T) => void;
}

class InvalidOperationError extends Error {}

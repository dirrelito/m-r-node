import { Response, Request } from "../node_modules/@types/express/index";
import { DummyDb } from "./item.read.model";

export class ItemReadModel {

    public static getItems = (req, res: Response) => {
        res.json(DummyDb.db);
    }

    public static getItem = (req: Request, res: Response) => {
        const id = req.params.id;
        const usr = DummyDb.db.find(item => item.id === id);
        if (!usr) {
            res.status(404).json("Could not find that user");
        } else {
            res.json(usr);
        }
    }
}

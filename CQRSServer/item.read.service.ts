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

    public static deactivateItem = (req, res: Response) => {
        console.log(req.params);
        const id = req.params.id;
        const pos = DummyDb.db.findIndex(i => i.id === id);
        console.log(pos);
        if (pos !== -1) {
            DummyDb.db.splice(pos, 1);
            res.json("ok");
        } else {
            res.status(404).json("Could not find that user");
        }
    }
}

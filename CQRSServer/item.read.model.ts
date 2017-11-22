import { Response } from "../node_modules/@types/express/index";

export class ItemReadModel {

    public static getItems = (req, res: Response) => {
        res.json(DummyDb.db);
    }
}

class DummyDb {
    public static db = ["hej", "hopp"];
}

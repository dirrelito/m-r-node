import { Request, Response } from "../node_modules/@types/express/index";
import { ReadModel } from "./item.read.model";

export class ItemReadService {

    public static getItems = (req, res: Response) => {
        res.json(ReadModel.readModelFacade.GetInventoryItems());
    }

    public static getItem = (req: Request, res: Response) => {
        const id = req.params.id;
        const itemDto = ReadModel.readModelFacade.GetInventoryItemDetails(id);
        if (itemDto == null) {
            res.status(404).json("Could not find details for that item.");
        } else {
            res.json(itemDto);
        }
    }
}

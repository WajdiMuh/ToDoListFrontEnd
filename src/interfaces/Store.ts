import { StoreType } from "../app/enums/StoreType";
import { Item } from "./Item";

export interface Store
{
    id:number
    name: string;
    type: StoreType;
    items: Item[];
    new_item?: string;
}

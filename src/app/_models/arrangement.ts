import { Container } from "./container";
import { Item } from "./item";

export class Arrangement {
    public id: number;
    public title: string;
    public owner: string;
    public containers: Container[];
    public items: Item[];
    public multiBinPack: boolean;
    public arrangementPossible: boolean;
    public timeout: boolean;
    public timeoutDuration: number;
    public constructor(init?: Partial<Arrangement>) {
        Object.assign(this, init);
    }
}

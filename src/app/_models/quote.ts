import { Arrangement } from "./arrangement";

export class Quote {
    public id: number;
    public owner: string;
    public daysToShip: number;
    public carrier: string;
    public cost: number;
    public shippoRateId: string;
    public arrangement: Arrangement;
    public constructor(init?: Partial<Quote>) {
        Object.assign(this, init);
    }
}

import { Arrangement } from "./arrangement";
import { ShippoTransaction } from "./shippo-transaction";

export class ServiceLevel {
    public name: string;
    public token: string;
    public terms: string;
    public quote: string;
}
export class Quote {
    public id: number;
    public owner: string;
    public daysToShip: number;
    public carrier: string;
    public cost: number;
    public shippoRateId: string;
    public arrangement: Arrangement;
    public shippoTransaction: ShippoTransaction;
    public serviceLevel: ServiceLevel
    public constructor(init?: Partial<Quote>) {
        Object.assign(this, init);
    }
}
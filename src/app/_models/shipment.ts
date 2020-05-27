import { Container } from './container';
import { Item } from './item';

export class Shipment {
    public id: number;
    public owner: string;
    public containers: Container[];
    public items: Item[];
    public multiBinPack: boolean;
    public constructor(init?: Partial<Shipment>) {
        Object.assign(this, init);
    }
}

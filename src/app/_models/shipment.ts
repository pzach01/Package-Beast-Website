import { Quote } from './quote';
import { Address } from './address';
import { Container } from './container';
import { Item } from './item';

export class Shipment {
    public id: number;
    public lastSelectedQuoteId: number;
    public shipFromAddress: Address;
    public shipToAddress: Address;
    public title: string;
    public owner: string;
    public containers: Container[];
    public items: Item[];
    public multiBinPack: boolean;
    public arrangementPossible: boolean;
    public timeout: boolean;
    public timeoutDuration: number;
    public quotes: Quote[];
    public includeUpsContainers: boolean;
    public includeUspsContainers: boolean;
    public validFromAddress: boolean;
    public validToAddress: boolean;
    public constructor(init?: Partial<Shipment>) {
        Object.assign(this, init);
    }
}
import { Container } from './container';

export class Shipment {
    public id: number;
    public owner: string;
    public containers: string;
    public items: string;
    public binLayout: [Container];
}

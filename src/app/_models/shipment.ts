import { Container } from './container';

export class Shipment {
    public id: number;
    public owner: string;
    public bins: string;
    public boxes: string;
    public binLayout: [Container];
}

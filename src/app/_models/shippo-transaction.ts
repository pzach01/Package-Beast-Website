import { ShippoRefund } from "./shippo-refund";

export class ShippoMessage {
    code: string;
    source: string;
    text: string
}

export class ShippoTransaction {
    id: number;
    label_url: string;
    messages: ShippoMessage[];
    objectState: string;
    status: string;
    objectCreated: string;
    objectUpdated: string;
    objectId: string;
    objectOwner: string;
    rate: string;
    shippoRefund: ShippoRefund;
    trackingNumber: string;
    trackingStatus: string;
    trackingUrlProvider: string;
    test: string;
    shippoRateId: string
}
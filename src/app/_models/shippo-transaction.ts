export class ShippoMessage {
    code: string;
    source: string;
    text: string
}

export class ShippoTransaction {
    label_url: string;
    messages: ShippoMessage[];
    objectState: string;
    status: string;
    objectCreated: string;
    objectUpdated: string;
    objectId: string;
    objectOwner: string;
    test: string;
    shippoRateId: string
}
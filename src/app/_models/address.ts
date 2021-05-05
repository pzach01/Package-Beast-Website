export class Address {
    name: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    stateProvinceCode: string;
    postalCode: string
    public constructor(init?: Partial<Address>) {
        Object.assign(this, init);
    }
}
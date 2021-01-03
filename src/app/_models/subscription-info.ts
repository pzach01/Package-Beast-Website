export class SubscriptionInfo {
    public containersAllowed: number;
    public containersUsed: number;
    public itemsAllowed: number;
    public itemsUsed: number;
    public shipmentsAllowed: number;
    public shipmentsUsed: number;
    public subscriptionActive: boolean;
    public paymentUpToDate: boolean;
    public subscriptionType: "none" | "trial" | "standard" | "premium" | "beastMode";
    public subscriptionExpirationTime: number;
}
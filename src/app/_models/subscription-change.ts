import { subscriptionType } from 'src/app/_models/subscription-info'
export class SubscriptionChange {
    constructor(selectedSubscriptionType: subscriptionType, previousSubscriptionType: subscriptionType) {
        this.selectedSubscriptionType = selectedSubscriptionType
        this.previousSubscriptionType = previousSubscriptionType
        this.assignSelectedSubscriptionProperties(selectedSubscriptionType)
        this.assignPreviousSubscriptionProperties(previousSubscriptionType)
        this.assignDirection()
    }
    public priceId: string;
    public productId: string;
    public selectedSubscriptionType: subscriptionType;
    public previousSubscriptionType: subscriptionType;
    public selectedSubscriptionText: string;
    public selectedSubscriptionPrice: number;
    public previousSubscriptionText: string;
    public previousSubscriptionPrice: number;
    public direction: "initial" | "upgrade" | "downgrade";
    public prorate: number;

    assignSelectedSubscriptionProperties(selectedSubscriptionType: subscriptionType) {
        switch (selectedSubscriptionType) {
            case "standard":
                this.selectedSubscriptionType = "standard"
                this.selectedSubscriptionText = "Standard";
                this.selectedSubscriptionPrice = 10;
                this.priceId = "price_1I76eoE5mpXPYa9nlFHK60Ge";
                this.productId = "prod_IiXkLvo2tLRuCi";
                break;
            case "premium":
                this.selectedSubscriptionType = "premium"
                this.selectedSubscriptionText = "Premium";
                this.selectedSubscriptionPrice = 30;
                this.priceId = "price_1I76fUE5mpXPYa9ncmIy6tbY";
                this.productId = "prod_IiXkKw7qe4Dt7l";
                break;
            case "beastMode":
                this.selectedSubscriptionType = "beastMode"
                this.selectedSubscriptionText = "Beast Mode";
                this.selectedSubscriptionPrice = 50;
                this.priceId = "price_1I76gPE5mpXPYa9nzbdm3s9f";
                this.productId = "prod_IiXlcdTHpmbQHR";
                break;
        }
    }

    assignPreviousSubscriptionProperties(previousSubscriptionType: subscriptionType) {
        switch (previousSubscriptionType) {
            case "none":
                this.previousSubscriptionPrice = 0;
                this.previousSubscriptionText = "None";
                break;
            case "trial":
                this.previousSubscriptionPrice = 0;
                this.previousSubscriptionText = "Trial";
                break;
            case "standard":
                this.previousSubscriptionPrice = 10;
                this.previousSubscriptionText = "Standard";
                break;
            case "premium":
                this.previousSubscriptionPrice = 30;
                this.previousSubscriptionText = "Premium";
                break;
            case "beastMode":
                this.previousSubscriptionPrice = 50;
                this.previousSubscriptionText = "Beast Mode";
                break;
        }
    }

    assignDirection() {
        if (this.selectedSubscriptionPrice > this.previousSubscriptionPrice) {
            this.direction = "upgrade"
            this.prorate = this.selectedSubscriptionPrice - this.previousSubscriptionPrice
        }
        if (this.selectedSubscriptionPrice < this.previousSubscriptionPrice) {
            this.direction = "downgrade"
            this.prorate = 0;
        }
        if (this.previousSubscriptionType == "none" || this.previousSubscriptionType == "trial") {
            this.direction = "initial"
            this.prorate = 0;
        }
    }
}

import { subscriptionType } from 'src/app/_models/subscription-info'
import { environment } from 'src/environments/environment'
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
                this.selectedSubscriptionPrice = environment.standardSubscription.price;
                this.priceId = environment.standardSubscription.priceId;
                this.productId = environment.standardSubscription.productId;
                break;
            case "premium":
                this.selectedSubscriptionType = "premium"
                this.selectedSubscriptionText = "Premium";
                this.selectedSubscriptionPrice = environment.premiumSubscription.price;
                this.priceId = environment.premiumSubscription.priceId;
                this.productId = environment.premiumSubscription.productId;
                break;
            case "beastMode":
                this.selectedSubscriptionType = "beastMode"
                this.selectedSubscriptionText = "Beast Mode";
                this.selectedSubscriptionPrice = environment.beastModeSubscription.price;
                this.priceId = environment.beastModeSubscription.priceId;
                this.productId = environment.beastModeSubscription.productId;
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
                this.previousSubscriptionPrice = environment.standardSubscription.price;
                this.previousSubscriptionText = "Standard";
                break;
            case "premium":
                this.previousSubscriptionPrice = environment.premiumSubscription.price;
                this.previousSubscriptionText = "Premium";
                break;
            case "beastMode":
                this.previousSubscriptionPrice = environment.beastModeSubscription.price;
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

export class SubscriptionChange {
    constructor(selectedSubscriptionType: "none" | "trial" | "standard" | "premium" | "beastMode", previousSubscriptionType: "none" | "trial" | "standard" | "premium" | "beastMode") {
        this.selectedSubscriptionType = selectedSubscriptionType
        this.previousSubscriptionType = previousSubscriptionType
        this.assignSelectedSubscriptionProperties(selectedSubscriptionType)
        this.assignPreviousSubscriptionProperties(previousSubscriptionType)
        this.assignDirection()
    }
    public priceId: string;
    public selectedSubscriptionType: "none" | "trial" | "standard" | "premium" | "beastMode";
    public previousSubscriptionType: "none" | "trial" | "standard" | "premium" | "beastMode";
    public selectedSubscriptionText: string;
    public selectedSubscriptionPrice: number;
    public previousSubscriptionText: string;
    public previousSubscriptionPrice: number;
    public direction: "upgrade" | "downgrade";
    public prorate: number;

    assignSelectedSubscriptionProperties(selectedSubscriptionType: "none" | "trial" | "standard" | "premium" | "beastMode") {
        switch (selectedSubscriptionType) {
            case "standard":
                this.selectedSubscriptionType = "standard"
                this.selectedSubscriptionText = "Standard";
                this.selectedSubscriptionPrice = 10;
                this.priceId = "price_1HPJLlJWFTMXIZUoMH26j2EB";
                break;
            case "premium":
                this.selectedSubscriptionType = "premium"
                this.selectedSubscriptionText = "Premium";
                this.selectedSubscriptionPrice = 30;
                this.priceId = "price_1HPJNoJWFTMXIZUo60gNaXlm";
                break;
            case "beastMode":
                this.selectedSubscriptionType = "beastMode"
                this.selectedSubscriptionText = "Beast Mode";
                this.selectedSubscriptionPrice = 50;
                this.priceId = "price_1HPJOLJWFTMXIZUoGcXhTnax";
                break;
        }
    }

    assignPreviousSubscriptionProperties(previousSubscriptionType: "none" | "trial" | "standard" | "premium" | "beastMode") {
        switch (previousSubscriptionType) {
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
    }
}

import { EventCenter } from "../../../../../CFramework/CPlugin/Event/EventCenter";
import { EventEnum } from "../../../../../CFramework/CPlugin/Event/EventEnum";
import IAPManager, { PurchaseFailureReason } from "../../../../../CFramework/CPlugin/IAP/IAPManager";
import Singleton from "../../../../../CFramework/CPlugin/Pattern/Singleton";

export class StoreModel extends Singleton {
    public Init() {
        EventCenter.on(EventEnum.VERIFY_UNFULFILLED_PAYMENTS, this.OnPurchased, this);
    }

    public Purchase(purchaseId: number) {
        if (purchaseId <= 0) {
            console.error(`StoreModel.Purchase > invalid purchaseId: ${purchaseId}`);
			return;
		}

        if (CC_DEV) {
            this.GetIPAReward();
            return;
        }

        const productId: string = "com.joyplay.joyplay.token1";

        IAPManager.Instance().PurchaseProductWithVerify(productId, purchaseId, this.OnPurchased.bind(this));
    }

    GetIPAReward() {
        console.log(`GetIPAReward`);
    }

    OnPurchased(result: boolean, productId: string, purchaseId: number, transactionID?: string, failureReason?: string) {
        if (result && transactionID != null) {
            this.GetIPAReward();
        } else {
            console.log("OnPurchased failed with reason = ", failureReason);
            if (failureReason === PurchaseFailureReason[PurchaseFailureReason.UserCancelled]) {
                console.warn(`OnPurchased: PurchaseFailureReason.UserCancelled`);
            } else {
                console.warn(`OnPurchased: ${failureReason}`);
            }
        }
    }

}

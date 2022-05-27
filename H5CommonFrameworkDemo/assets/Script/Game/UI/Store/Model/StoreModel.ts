import { EventCenter } from "../../../../../CFramework/CPlugin/Event/CEventCenter";
import { EventEnum } from "../../../../../CFramework/CPlugin/Event/CEventEnum";
import IAPManager, { PurchaseFailureReason } from "../../../../../CFramework/CPlugin/IAP/CIAPManager";
import Singleton from "../../../../../CFramework/CPlugin/Pattern/CSingleton";

export class StoreModel extends Singleton {
    public Init() {
        EventCenter.on(EventEnum.VERIFY_UNFULFILLED_PAYMENTS, this.OnPurchased, this);
    }

    public InitProduct() {
        let consumableProductIds: Array<string> = new Array<string>();
        consumableProductIds.push("com.joyplay.joyplay.token1");
        IAPManager.Instance().InitProduct(consumableProductIds);
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

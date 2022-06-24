import { IAPLogicManager } from "../../../../../CFramework/CCCBase/Script/IAP/CIAPLogicManager";
import { EventCenter, IEvent } from "../../../../../CFramework/CPlugin/Event/CEventCenter";
import { EventEnum } from "../../../../../CFramework/CPlugin/Event/CEventEnum";
import { PurchaseFailureReason } from "../../../../../CFramework/CPlugin/IAP/CIAPManager";
import Singleton from "../../../../../CFramework/CPlugin/Pattern/CSingleton";

export class StoreModel extends Singleton {
    public Init() {
        EventCenter.on(EventEnum.VERIFY_UNFULFILLED_PAYMENTS, this.OnVeryfyUnfulfilledPayment, this);
    }

    public InitProduct() {
        let consumableProductIds: Array<string> = new Array<string>();
        consumableProductIds.push("com.joyplay.joyplay.token1");
        IAPLogicManager.Instance().InitProduct(consumableProductIds);
    }

    public Purchase(purchaseId: number) {
        if (purchaseId <= 0) {
            console.error(`StoreModel.Purchase > invalid purchaseId: ${purchaseId}`);
			return;
		}

        // if (CC_DEV) {
        //     this.GetIAPReward();
        //     return;
        // }

        const productId: string = "com.joyplay.joyplay.token1";

        IAPLogicManager.Instance().PurchaseProductWithVerify(productId, purchaseId, this.OnPurchased.bind(this));
    }

    GetIAPReward() {
        console.log(`GetIPAReward`);
    }

    OnVeryfyUnfulfilledPayment(e: IEvent, result: boolean, productId: string, purchaseId: number, transactionID?: string, failureReason?: string) {
        this.OnPurchased(result, productId, purchaseId, transactionID, failureReason);
    }

    OnPurchased(result: boolean, productId: string, purchaseId: number, transactionID?: string, failureReason?: string) {
        if (result && transactionID != null) {
            this.GetIAPReward();
        } else {
            console.log("OnPurchased failed with reason = ", failureReason);
            if (failureReason === PurchaseFailureReason[PurchaseFailureReason.UserCancelled]) {
                console.warn(`OnPurchased: PurchaseFailureReason.UserCancelled`);
            } else if (PurchaseFailureReason[PurchaseFailureReason.ProductUnavailable] === failureReason || PurchaseFailureReason[PurchaseFailureReason.PurchasingUnavailable] === failureReason){
                console.warn(`OnPurchased: Failed to connect to Google Play!`);
            } else {
                console.warn(`OnPurchased: ${failureReason}`);
            }
        }
    }

}

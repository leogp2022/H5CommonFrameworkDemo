import IAPManager, { PurchaseFailureReason } from "../../../../../CFramework/CPlugin/IAP/IAPManager";
import Singleton from "../../../../../CFramework/CPlugin/Pattern/Singleton";

export class StoreModel extends Singleton {
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

        let cb = () => {
            IAPManager.Instance().PurchaseProduct(productId, purchaseId, this.OnPurchased.bind(this));
        };

		if (cc.sys.os == cc.sys.OS_ANDROID) {
			IAPManager.Instance().IsProductAlreadyOwned(productId, purchaseId, (result: boolean, purchaseId2: number) => {
				if (result) {
					// 该商品有未完成订单，尝试一次补单
					console.log("该商品为未完成状态，尝试补单，取消本次付费行为!");
					IAPManager.Instance().VerifyUnfulfilledPayment(productId, purchaseId);
					return;
				} else {
					cb();
				}
			});
		} else {
			cb();
		}
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

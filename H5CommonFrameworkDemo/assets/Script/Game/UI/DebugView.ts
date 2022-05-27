import ViewBase from "../../../CFramework/CCCBase/Script/UI/Base/CViewBase";
import { AdLogicManager } from "../../../CFramework/CCCBase/Script/UserGroup/CAdLogicManager";
import { GameBIManager } from "../BI/GameBIManager";
import { IntAdPosition, RvAdPosition } from "../UserGroup/AdPosition";
import { StoreModel } from "./Store/Model/StoreModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DebugView extends ViewBase {
    protected static sPrefabPath: string = "MainPrefab/DebugView";

    protected async onViewLoad(): Promise<void> {
        let rvButton: cc.Node = this.findChild("RvBtn");
        this.registerTouch(rvButton, this.OnClickRvBtn, this);

        let intButton: cc.Node = this.findChild("IntBtn");
        this.registerTouch(intButton, this.OnClickIntBtn, this);

        let iapButton: cc.Node = this.findChild("IapBtn");
        this.registerTouch(iapButton, this.OnClickIapBtn, this);

        let crashButton: cc.Node = this.findChild("CrashBtn");
        this.registerTouch(crashButton, this.OnClickCrashBtn, this);

        let biButton: cc.Node = this.findChild("BIBtn");
        this.registerTouch(biButton, this.OnClickBIBtn, this);
    }

    private OnClickRvBtn(): void {
        console.log(`OnClickRvBtn`);
        AdLogicManager.Instance().TryShowRewardedVideo(RvAdPosition.RV_TEST, (result: boolean) => {
            console.log(`OnClickRvBtn 2: ${result}`);
        });
    }

    OnClickIntBtn() {
        console.log(`OnClickIntBtn`);
        AdLogicManager.Instance().TryShowInterstitial(IntAdPosition.INT_TEST);
        console.log(`OnClickIntBtn 2`);
    }

    OnClickIapBtn() {
        console.log(`OnClickIapBtn`);
        const buyID: number = 1;
		StoreModel.Instance().Purchase(buyID);
    }

    OnClickCrashBtn() {
        console.log(`OnClickCrashBtn`);
        throw new Error("Test: OnClickCrashBtn");
    }

    OnClickBIBtn() {
        console.log(`OnClickBIBtn`);
        GameBIManager.SendEvent("test-data", "test-type");
    }

}

import ViewBase from "../../../CFramework/CCCBase/Script/UI/Base/CViewBase";
import { AdLogicManager } from "../../../CFramework/CCCBase/Script/UserGroup/CAdLogicManager";
import AdManager from "../../../CFramework/CPlugin/AD/CAdManager";
import { EventCenter } from "../../../CFramework/CPlugin/Event/CEventCenter";
import { EventEnum } from "../../../CFramework/CPlugin/Event/CEventEnum";
import { GameBIManager } from "../BI/GameBIManager";
import { IntAdPosition, RvAdPosition } from "../UserGroup/AdPosition";
import { StoreModel } from "./Store/Model/StoreModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DebugView extends ViewBase {
    protected static sPrefabPath: string = "MainPrefab/DebugView";

    intAdButton: cc.Button;
    rvAdButton: cc.Button

    protected async onViewLoad(): Promise<void> {
        this.rvAdButton = this.findChild("RvBtn").getComponent<cc.Button>(cc.Button);
        this.registerTouch(this.rvAdButton.node, this.OnClickRvBtn, this);

        this.intAdButton = this.findChild("IntBtn").getComponent<cc.Button>(cc.Button);
        this.registerTouch(this.intAdButton.node, this.OnClickIntBtn, this);

        let iapButton: cc.Node = this.findChild("IapBtn");
        this.registerTouch(iapButton, this.OnClickIapBtn, this);

        let crashButton: cc.Node = this.findChild("CrashBtn");
        this.registerTouch(crashButton, this.OnClickCrashBtn, this);

        let biButton: cc.Node = this.findChild("BIBtn");
        this.registerTouch(biButton, this.OnClickBIBtn, this);

        StoreModel.Instance().InitProduct();

        EventCenter.on(EventEnum.INT_AD_READY_STATE_CHANGE, this.OnIntAdReadyStateChange, this);
        EventCenter.on(EventEnum.RV_AD_READY_STATE_CHANGE, this.OnRVAdReadyStateChange, this);

        this.UpdateIntAdBtnState(AdManager.Instance().IsInterstitialReady);
        this.UpdateRVAdBtnState(AdManager.Instance().IsRewardVideoReady);
    }

    UpdateIntAdBtnState(isEnable: boolean) {
        this.intAdButton.interactable = isEnable;
    }

    UpdateRVAdBtnState(isEnable: boolean) {
        this.rvAdButton.interactable = isEnable;
    }

    OnClickRvBtn(): void {
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

    OnIntAdReadyStateChange(isReady: boolean) {
        console.log(`OnIntAdReadyStateChange: ${isReady}`);
    }

    OnRVAdReadyStateChange(isReady: boolean) {
        console.log(`OnRVAdReadyStateChange: ${isReady}`);
    }

}

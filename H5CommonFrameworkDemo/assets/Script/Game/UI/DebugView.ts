import ViewBase from "../../../CFramework/CCCBase/Script/UI/Base/CViewBase";
import { ViewManager } from "../../../CFramework/CCCBase/Script/UI/Base/CViewManager";
import { AdLogicManager } from "../../../CFramework/CCCBase/Script/UserGroup/CAdLogicManager";
import AdManager from "../../../CFramework/CPlugin/AD/CAdManager";
import BridgeManager from "../../../CFramework/CPlugin/Bridge/CBridgeManager";
import { EventCenter, IEvent } from "../../../CFramework/CPlugin/Event/CEventCenter";
import { EventEnum } from "../../../CFramework/CPlugin/Event/CEventEnum";
import { GameBIManager } from "../BI/GameBIManager";
import { IntAdPosition, RvAdPosition } from "../UserGroup/AdPosition";
import DebugView2 from "./DebugView2";
import DebugView3 from "./DebugView3";
import { UIMoreGameCtrl } from "../../../CFramework/CCCBase/Script/UI/RecommandGame/CUIMoreGameCtrl";
import { StoreModel } from "./Store/Model/StoreModel";
import { UIPopGameCtrl } from "../../../CFramework/CCCBase/Script/UI/RecommandGame/CUIPopGameCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DebugView extends ViewBase {
    protected static sPrefabPath: string = "MainPrefab/DebugView";

    _intAdButton: cc.Button;
    _rvAdButton: cc.Button
    _loadRemoteSprite: cc.Node;

    protected async onViewLoad(): Promise<void> {
        this._rvAdButton = this.findChild("RvBtn").getComponent<cc.Button>(cc.Button);
        this.registerTouch(this._rvAdButton.node, this.OnClickRvBtn, this);

        this._intAdButton = this.findChild("IntBtn").getComponent<cc.Button>(cc.Button);
        this.registerTouch(this._intAdButton.node, this.OnClickIntBtn, this);

        let iapButton: cc.Node = this.findChild("IapBtn");
        this.registerTouch(iapButton, this.OnClickIapBtn, this);

        let crashButton: cc.Node = this.findChild("CrashBtn");
        this.registerTouch(crashButton, this.OnClickCrashBtn, this);

        let biButton: cc.Node = this.findChild("BIBtn");
        this.registerTouch(biButton, this.OnClickBIBtn, this);

        let getDlc2Button: cc.Node = this.findChild("GetDlc2Btn");
        this.registerTouch(getDlc2Button, this.OnClickGetDlc2Btn, this);

        let getDlc3Button: cc.Node = this.findChild("GetDlc3Btn");
        this.registerTouch(getDlc3Button, this.OnClickGetDlc3Btn, this);

        let unzipDlc2Button: cc.Node = this.findChild("UnzipDlc2Btn");
        this.registerTouch(unzipDlc2Button, this.OnClickUnzipDlc2Btn, this);

        let unzipDlc3Button: cc.Node = this.findChild("UnzipDlc3Btn");
        this.registerTouch(unzipDlc3Button, this.OnClickUnzipDlc3Btn, this);

        let loadDlc2Button: cc.Node = this.findChild("LoadDlc2Btn");
        this.registerTouch(loadDlc2Button, this.OnClickLoadDlc2Btn, this);

        let loadDlc3Button: cc.Node = this.findChild("LoadDlc3Btn");
        this.registerTouch(loadDlc3Button, this.OnClickLoadDlc3Btn, this);

        let loadButton: cc.Node = this.findChild("LoadBtn");
        this.registerTouch(loadButton, this.OnClickLoadBtn, this);

        this._loadRemoteSprite = this.findChild("LoadRemoteSprite");

        let exitButton: cc.Node = this.findChild("ExitBtn");
        this.registerTouch(exitButton, this.OnClickExitBtn, this);

        let paoPaoButton: cc.Node = this.findChild("PaoPaoBtn");
        this.registerTouch(paoPaoButton, this.OnClickPaoPaoBtn, this);

        StoreModel.Instance().InitProduct();

        EventCenter.on(EventEnum.INT_AD_READY_STATE_CHANGE, this.OnIntAdReadyStateChange, this);
        EventCenter.on(EventEnum.RV_AD_READY_STATE_CHANGE, this.OnRVAdReadyStateChange, this);
        EventCenter.on(EventEnum.DLC_DOWNLOAD_UPDATE, this.OnDlcDownloadUpdate, this);
        EventCenter.on(EventEnum.DLC_UNZIP_COMPLETE, this.OnDlcUnzipComplete, this);

        this.UpdateIntAdBtnState(AdManager.Instance().IsInterstitialReady);
        this.UpdateRVAdBtnState(AdManager.Instance().IsRewardVideoReady);

    }

    UpdateIntAdBtnState(isEnable: boolean) {
        this._intAdButton.interactable = isEnable;
    }

    UpdateRVAdBtnState(isEnable: boolean) {
        this._rvAdButton.interactable = isEnable;
    }

    onViewDestroy() {
        EventCenter.off(EventEnum.INT_AD_READY_STATE_CHANGE, this.OnIntAdReadyStateChange, this);
        EventCenter.off(EventEnum.RV_AD_READY_STATE_CHANGE, this.OnRVAdReadyStateChange, this);
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

    OnClickGetDlc2Btn() {
        console.log(`OnClickGetDlc2Btn`);
        BridgeManager.Instance().scheme_downloaddlc("MainPrefab2");
    }

    OnClickGetDlc3Btn() {
        console.log(`OnClickGetDlc3Btn`);
        BridgeManager.Instance().scheme_downloaddlc("MainPrefab3");
    }

    OnClickUnzipDlc2Btn() {
        console.log(`OnClickUnzipDlc2Btn`);
        BridgeManager.Instance().scheme_unzipdlc("MainPrefab2");
    }

    OnClickUnzipDlc3Btn() {
        console.log(`OnClickUnzipDlc3Btn`);
        BridgeManager.Instance().scheme_unzipdlc("MainPrefab3");
    }

    OnClickLoadDlc2Btn() {
        console.log(`OnClickLoadDlc2Btn`);
        ViewManager.Instance().openView(DebugView2);
    }

    OnClickLoadDlc3Btn() {
        console.log(`OnClickLoadDlc3Btn`);
        ViewManager.Instance().openView(DebugView3);
    }

    OnClickLoadBtn() {
        console.log(`OnClickLoadBtn`);
        cc.assetManager.loadRemote("https://res.starcdn.cn/h5games_debug/mergex/icons/MergeX.png", (e, t: cc.Texture2D)=>{
            console.log("e:", e);
            console.log("t:", t);
            let f1 = new cc.SpriteFrame();
            f1.setTexture(t);
            this._loadRemoteSprite.getComponent(cc.Sprite).spriteFrame = f1;
        });
    }

    OnClickExitBtn() {
        console.log(`OnClickExitBtn`);
        ViewManager.Instance().openView(UIMoreGameCtrl);
    }

    OnClickPaoPaoBtn() {
        console.log(`OnClickPaoPaoBtn`);
        ViewManager.Instance().openView(UIPopGameCtrl)
    }

    OnIntAdReadyStateChange(e: IEvent, isReady: boolean) {
        console.log(`OnIntAdReadyStateChange: ${isReady}`);
        this.UpdateIntAdBtnState(isReady);
    }

    OnRVAdReadyStateChange(e: IEvent, isReady: boolean) {
        console.log(`OnRVAdReadyStateChange: ${isReady}`);
        this.UpdateRVAdBtnState(isReady);
    }

    OnDlcDownloadUpdate(e: IEvent, id: string, progress: string, error: string) {
        console.log(`OnDlcDownloadUpdate > id: ${id}, progress: ${progress}, error: ${error}`);
    }

    OnDlcUnzipComplete(e: IEvent, result: boolean, id: string) {
        console.log(`OnDlcUnzipComplete > result: ${result}, id: ${id}`);
    }

}

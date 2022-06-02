import { CCGameApp } from "../CFramework/CCCBase/Script/CCGameApp";
import ViewManager from "../CFramework/CCCBase/Script/UI/Base/CViewManager";
import UIWaiting from "../CFramework/CCCBase/Script/UI/CUIWaiting";
import AdLogicModel from "../CFramework/CCCBase/Script/UserGroup/Model/CAdLogicModel";
import BridgeManager from "../CFramework/CPlugin/Bridge/CBridgeManager";
import { DebugUtils } from "../CFramework/CPlugin/Utils/CDebugUtils";
import DebugView from "./Game/UI/DebugView";
import { StoreModel } from "./Game/UI/Store/Model/StoreModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnterScene extends cc.Component {

    async onLoad() {
        CCGameApp.Instance().Init({
            gameScheme: "tileshop",
            configPrePath: "Configs/",
            ccStorage: [],
            audioPrePath: "AudioDynamic/",
            musicPrePath: "AudioDynamic/",
            getBICommonData: this.getBICommonData,
        });

        StoreModel.Instance().Init();
        AdLogicModel.Instance().Init();

        cc.game.addPersistRootNode((await UIWaiting.create()).node);
        await ViewManager.openScene(DebugView);

        BridgeManager.Instance().scheme_notifyprogress("LandLobby", 1.0);
    }

    start() {
        // DebugUtils.IsLog = false;
    }

    // update (dt) {}

    private getBICommonData() {
        return {};
    }


}

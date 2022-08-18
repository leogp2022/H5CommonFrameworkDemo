import { CCGameApp } from "../CFramework/CCCBase/Script/CCGameApp";
import { CCConfig } from "../CFramework/CCCBase/Script/Config/CCConfig";
import { ViewManager } from "../CFramework/CCCBase/Script/UI/Base/CViewManager";
import BridgeManager from "../CFramework/CPlugin/Bridge/CBridgeManager";
import { EventCenter } from "../CFramework/CPlugin/Event/CEventCenter";
import { EventEnum } from "../CFramework/CPlugin/Event/CEventEnum";
import { DebugUtils } from "../CFramework/CPlugin/Utils/CDebugUtils";
import DebugView from "./Game/UI/DebugView";
import { StoreModel } from "./Game/UI/Store/Model/StoreModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnterScene extends cc.Component {

    async onLoad() {
        console.log("ver: 004");
        console.log("webp: ", cc.sys.capabilities.webp);
        cc.sys.capabilities.webp = true;

        CCConfig.ENABLE_RECOMMAND_GAME = true;
        CCGameApp.Instance().Init({
            gameScheme: "tileshop",
            configPrePath: "Configs/",
            ccStorage: [],
            audioPrePath: "AudioDynamic/",
            musicPrePath: "AudioDynamic/",
            getBICommonData: this.getBICommonData,
        });

        StoreModel.Instance().Init();

        await ViewManager.Instance().openScene(DebugView);

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

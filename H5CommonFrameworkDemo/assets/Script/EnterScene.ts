import { CCGameApp } from "../CFramework/CCCBase/Script/CCGameApp";
import ViewManager from "../CFramework/CCCBase/Script/UI/Base/CViewManager";
import UIWaiting from "../CFramework/CCCBase/Script/UI/CUIWaiting";
import AdLogicModel from "../CFramework/CCCBase/Script/UserGroup/Model/CAdLogicModel";
import BridgeManager from "../CFramework/CPlugin/Bridge/CBridgeManager";
import DebugView from "./Game/UI/DebugView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnterScene extends cc.Component {

    async onLoad() {
        CCGameApp.Instance().Init({
            gameScheme: "tileshop",
            configPrePath: "Configs/",
            ccStorage: [],
            audioPrePath: "AudioDynamic/",
            musicPrePath: "AudioDynamic/"
        });

        AdLogicModel.Instance().Init();

        BridgeManager.Instance().scheme_notifyprogress("LandLobby", 1.0);

        cc.game.addPersistRootNode((await UIWaiting.create()).node);
        await ViewManager.openScene(DebugView);
    }

    start() {

    }

    // update (dt) {}
}

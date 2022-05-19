import { CCGameApp } from "../CFramework/CCCBase/Script/CCGameApp";
import ViewManager from "../CFramework/CCCBase/Script/UI/Base/ViewManager";
import UILoading from "../CFramework/CCCBase/Script/UI/UILoading";
import AdLogicModel from "../CFramework/CCCBase/Script/UserGroup/Model/AdLogicModel";
import BridgeManager from "../CFramework/CPlugin/Bridge/BridgeManager";
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

        cc.game.addPersistRootNode((await UILoading.create()).node);
        await ViewManager.openScene(DebugView);
    }

    start() {

    }

    // update (dt) {}
}

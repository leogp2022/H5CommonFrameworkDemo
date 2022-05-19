import { CCGameApp } from "../CFramework/CCCBase/Script/CCGameApp";
import { LocaleConfigManager } from "../CFramework/CCCBase/Script/Localization/LocaleConfigManager";
import ViewManager from "../CFramework/CCCBase/Script/UI/Base/ViewManager";
import UILoading from "../CFramework/CCCBase/Script/UI/UILoading";
import AdLogicModel from "../CFramework/CCCBase/Script/UserGroup/Model/AdLogicModel";
import BridgeManager from "../CFramework/CPlugin/Bridge/BridgeManager";
import DebugView from "./Game/UI/DebugView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnterScene extends cc.Component {

    onLoad() {
        CCGameApp.Instance().Init({
            gameName: "tileshop",
            configPrePath: "Configs/",
            ccStorage: [],
            audioPrePath: "AudioDynamic/",
            musicPrePath: "AudioDynamic/"
        });

        // await LocaleConfigManager.Instance().Init("LocaleConfig/locale_en");
        AdLogicModel.Instance().Init();

        BridgeManager.Instance().scheme_notifyprogress("LandLobby", 1.0);

        ViewManager.openScene(DebugView);
    }

    start() {

    }

    // update (dt) {}
}

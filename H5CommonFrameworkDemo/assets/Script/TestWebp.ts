import { CCGameApp } from "../CFramework/CCCBase/Script/CCGameApp";
import BridgeManager from "../CFramework/CPlugin/Bridge/CBridgeManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad () {
        console.log("ver: 005");
        console.log("webp: ", cc.sys.capabilities.webp);
        cc.sys.capabilities.webp = true;

        CCGameApp.Instance().Init({
            gameScheme: "tileshop",
            configPrePath: "Configs/",
            ccStorage: [],
            audioPrePath: "AudioDynamic/",
            musicPrePath: "AudioDynamic/",
            getBICommonData: null,
        });
        BridgeManager.Instance().scheme_notifyprogress("LandLobby", 1.0);

        cc.director.loadScene("testwebp");
    }

    start () {

    }

    // update (dt) {}
}

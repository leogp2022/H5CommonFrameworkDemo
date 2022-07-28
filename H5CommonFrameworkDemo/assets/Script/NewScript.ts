// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CCGameApp } from "../CFramework/CCCBase/Script/CCGameApp";
import BridgeManager from "../CFramework/CPlugin/Bridge/CBridgeManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log("ver: 001");
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
        BridgeManager.Instance().scheme_backtogamecenter();

        // if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {
        //     this.checkSupport(function (result) {
        //         cc.sys.capabilities.webp = result;  // overwrite
        //         console.log("ok.");
        //     });
        // }

        // cc.director.loadScene("testwebp");
    }

    start () {

    }

    // update (dt) {}
    
    checkSupport(cb) {
        var webP = new Image();
        webP.onload = webP.onerror = function () {
            let isSupported = (webP.height === 2);
            cb(isSupported);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }
}

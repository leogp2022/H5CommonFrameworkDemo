import ViewBase from "../../../CFramework/CCCBase/Script/UI/Base/CViewBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DebugView2 extends ViewBase {
    protected static sPrefabPath: string = "MainPrefab2/DebugView2";

    protected async onViewLoad(): Promise<void> {
        let closeButton = this.findChild("CloseBtn");
        this.registerTouch(closeButton, this.OnClickCLoseBtn, this);
    }

    OnClickCLoseBtn(): void {
        console.log(`OnClickCLoseBtn2`);
        this.closeView();
    }

    onViewDestroy() {
    }

}

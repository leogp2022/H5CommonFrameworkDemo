import ViewBase from "../../../CFramework/CCCBase/Script/UI/Base/CViewBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DebugView3 extends ViewBase {
    protected static sPrefabPath: string = "MainPrefab3/DebugView3";

    protected async onViewLoad(): Promise<void> {
        let closeButton = this.findChild("CloseBtn");
        this.registerTouch(closeButton, this.OnClickCLoseBtn, this);
    }

    OnClickCLoseBtn(): void {
        console.log(`OnClickCLoseBtn3`);
        this.closeView();
    }

    onViewDestroy() {
    }

}

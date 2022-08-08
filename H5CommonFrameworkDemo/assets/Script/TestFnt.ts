const {ccclass, property} = cc._decorator;

@ccclass
export default class TestFnt extends cc.Component {
    @property(cc.Node)
    mNode: cc.Node = null;

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBigClick() {
        this.mNode.setScale(this.mNode.scaleX * 2, this.mNode.scaleY * 2);
    }

    onSmallClick() {
        this.mNode.setScale(this.mNode.scaleX / 2, this.mNode.scaleY / 2);
    }
}

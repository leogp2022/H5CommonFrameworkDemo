import { BIManager } from "../../../CFramework/CPlugin/BI/CBIManager";
import Singleton from "../../../CFramework/CPlugin/Pattern/CSingleton";

export class GameBIManager extends Singleton {
    public SendCommonEvent(data: any, type: string) {
        const biEventCommon = {};
        biEventCommon[type] = data;
        BIManager.Instance().SendEvent(type, biEventCommon);
    }
}
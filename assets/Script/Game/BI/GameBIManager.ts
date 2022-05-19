import { BIManager } from "../../../CFramework/CPlugin/BI/BIManager";
import Singleton from "../../../CFramework/CPlugin/Pattern/Singleton";

export class GameBIManager extends Singleton {
    public SendCommonEvent(data: any, type: string) {
        const biEventCommon = {};
        biEventCommon[type] = data;
        BIManager.Instance().SendEvent(type, biEventCommon);
    }
}
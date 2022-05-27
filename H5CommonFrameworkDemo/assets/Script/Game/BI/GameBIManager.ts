import { BIManager } from "../../../CFramework/CPlugin/BI/CBIManager";
import Singleton from "../../../CFramework/CPlugin/Pattern/CSingleton";

export class GameBIManager extends Singleton {
    public static SendEvent(message: any, type: string = "levelInfo") {
        BIManager.Instance().SendEvent(message, type);
    }
}
import { Player, Slayer } from "../server/src/SlayerRoomState"
import { IPlayer } from "./common"

export enum EMessageTypes {
    CharacterUpdate,
    NumericalUpdate,
    ArrayChange,
    Kill,
    Roll,
    OptionsChoice,
    OptionsSelection,
    Kick,
    PlayerUpdate,
    SaveCampaign,
}

export interface IBaseMsg {
    kind: EMessageTypes
}

export interface IArrayChangeMsg extends IBaseMsg {
    kind: EMessageTypes.ArrayChange,
    characterId: string,
    array: "advances" | "inventory",
    action: "add" | "remove",
    ix?: number,
    data?: {name: string, description: string}

}

export interface ICharacterUpdateMsg extends IBaseMsg {
    kind: EMessageTypes.CharacterUpdate,
    characterId: string,
    data: Slayer
}

export interface IKillMsg extends IBaseMsg {
    kind: EMessageTypes.Kill,
    characterId: string,
}

export interface IPlayerUpdateMsg extends IBaseMsg {
    kind: EMessageTypes.PlayerUpdate,
    playerData: IPlayer
}

export interface IUpdateNumericalMsg extends IBaseMsg {
    kind: EMessageTypes.NumericalUpdate,
    slayerId: string,
    field: string,
    newValue: number
}

export interface ISaveCampaignMsg extends IBaseMsg {
    kind: EMessageTypes.SaveCampaign
}

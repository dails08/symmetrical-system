import { Player, Slayer } from "../server/src/SlayerRoomState"
import { IPlayer } from "./common"

export enum EMessageTypes {
    CharacterUpdate,
    NumericalUpdate,
    ArrayChange,
    Assignment, 
    Kill,
    Roll,
    OptionsChoice,
    OptionsSelection,
    Kick,
    PlayerUpdate,
    SaveCampaign,
    JoinResponse
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
    playerId: string,
    field: string,
    newValueInt: number,
    newValueStr: string
}

export interface IAssignmentMsg extends IBaseMsg {
    kind: EMessageTypes.Assignment,
    action: "assign" | "unassign",
    playerId: string,
    slayerId?: string
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

export interface IJoinResponseMsg extends IBaseMsg {
    kind: EMessageTypes.JoinResponse,
    role: "player" | "gm",
    player: Player
}

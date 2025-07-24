import { Player, Slayer } from "../server/src/SlayerRoomState"
import { EStances, IPlayer, ISlayer, ERunes } from "./common"

export enum EMessageTypes {
    CharacterUpdate,
    NumericalUpdate,
    ArrayChange,
    Assignment, 
    Kill,
    RosterAdd,
    Roll,
    OptionsChoice,
    OptionsSelection,
    Kick,
    PlayerUpdate,
    SaveCampaign,
    JoinResponse,
    StanceChange,
    RuneChange,
    LoadedChange,
    setWeapon
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

export interface IRosterAddMsg extends IBaseMsg {
    kind: EMessageTypes.RosterAdd,
    slayer: ISlayer
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

export interface IStanceChangeMsg extends IBaseMsg {
    kind: EMessageTypes.StanceChange,
    stance: EStances,
    characterId: string
}

export interface IRuneChangeMsg extends IBaseMsg {
    kind: EMessageTypes.RuneChange,
    rune: ERunes,
    slayerId: string,
    chamber: number
}

export interface ILoadedChangeMsg extends IBaseMsg {
    kind: EMessageTypes.LoadedChange,
    loaded: boolean,
    slayerId: string,
    chamber: number
}

export interface IWeaponChangeMsg extends IBaseMsg {
    kind: EMessageTypes.setWeapon,
    dmgN: number,
    dmgS: number,
    slayerId: string
}


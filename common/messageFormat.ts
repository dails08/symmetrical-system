import { Player, Slayer } from "../server/src/SlayerRoomState"
import { IPlayer } from "./common"

export enum EMessageTypes {
    CharacterUpdate,
    NumericalUpdate,
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

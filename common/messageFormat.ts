import { Player, RecentRoll, Slayer } from "../server/src/SlayerRoomState"
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
    setWeapon,
    addPlan,
    removePlan,
    addSpell,
    removeSpell,
    setEnhanced,
    setFavoredSpell,
    setRecentRolls,
    swapRoll,
    // overlay message types
    playAnimation,
    playRollSwap,
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

export interface IAddPlanMsg extends IBaseMsg {
    kind: EMessageTypes.addPlan,
    slayerId: string,
    planVal: number
}

export interface IRemovePlanMsg extends IBaseMsg {
    kind: EMessageTypes.removePlan,
    slayerId: string,
    planIx: number
}

export interface IAddSpellMsg extends IBaseMsg {
    kind: EMessageTypes.addSpell,
    slayerId: string,
    name: string,
    effect: string,
    boostedEffect: string,
    enhancedEffect: string
}

export interface IRemoveSpellMsg extends IBaseMsg {
    kind: EMessageTypes.removeSpell,
    slayerId: string,
    ix: number
}

export interface ISetEnhancedMsg extends IBaseMsg {
    kind: EMessageTypes.setEnhanced,
    slayerId: string,
    ix: number,
    enhanced: boolean
}

export interface ISetFavoredSpell extends IBaseMsg {
    kind: EMessageTypes.setFavoredSpell,
    slayerId: string,
    favoredSpell: string
}

export interface ISetRecentRolls extends IBaseMsg {
    kind: EMessageTypes.setRecentRolls,
    action: "add" | "set",
    rolls: {
        actor: string,
        action: string,
        value: number
    }[]
        
    
}

// Overlay message format

export interface IPlayAnimationMsg extends IBaseMsg {
    kind: EMessageTypes.playAnimation,
    key: string
}

export interface IPlayRollSwapMsg extends IBaseMsg {
    kind: EMessageTypes.playRollSwap,
    actor: string,
    action: string,
    oldValue: number,
    newValue: number
}

// Tactician related

export interface ISwapRollMsg extends IBaseMsg {
    kind: EMessageTypes.swapRoll,
    rollIx: number,
    planValue: number,
    action: string,
}

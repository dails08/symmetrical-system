export enum EPlaybooks {
    Blade = "blade",
    Gunslinger = "gunslinger",
    Arcanist = "arcanist",
    Tactician = "tactician"
}

export interface ISlayer {
    id: string,
    name: string,
    class: EPlaybooks,
    maxHP: number,
    currentHP: number,
    weaponNumber: number,
    weaponSides: number,
    speed: 4|6|8|10|12,
    damage: number,
    skillsAgile: 4|6|8|10|12,
    skillsBrawn: 4|6|8|10|12,
    skillsDeceive: 4|6|8|10|12,
    skillsHunt: 4|6|8|10|12,
    skillsMend: 4|6|8|10|12,
    skillsNegotiate: 4|6|8|10|12,
    skillsStreet: 4|6|8|10|12,
    skillsStealth: 4|6|8|10|12,
    skillsStudy: 4|6|8|10|12,
    skillsTactics: 4|6|8|10|12,
    advances: {name: string, desc: string}[]
}

export enum EStances {
    Slay = "slay",
    Flow = "flow",
    Parry = "parry"
}
export interface IBlade extends ISlayer {
    stance: EStances,
}

export enum ERunes {
    Hollowpoint = "hollowpoint",
    Blast = "blast",
    Tar = "tar",
    Bleed = "bleed",
    Snare = "snare",
    Seeker = "seeker",
    None = "none"
}

export interface IGunslinger extends ISlayer {
    chamber1Loaded: boolean,
    chamber1Rune: ERunes,
    chamber2Loaded: boolean,
    chamber2Rune: ERunes,
    chamber3Loaded: boolean,
    chamber3Rune: ERunes,
    chamber4Loaded: boolean,
    chamber4Rune: ERunes,
    chamber5Loaded: boolean,
    chamber5Rune: ERunes,
    chamber6Loaded: boolean,
    chamber6Rune: ERunes,
}

export interface IArcanist extends ISlayer {
    corruption: number,
    favoredSpell: string,
    knownSpells: {name: string, desc: string, enhanced: boolean}[]
}

export interface ITactician extends ISlayer {
    plans: number[],
}

export interface IPlayer {
    id: string,
    name: string,
    displayName: string,
    currentCampaign: string
}

export interface IPlayerRecord extends IPlayer {
    campaigns: string[]
}

export interface ICampaign {
    id: string,
    name: string,
    gms: string[],
    players: string[],
    roster: ISlayer[],
    kia: ISlayer[],
    roomId?: string;
}

export interface IJoinOptions {
    name: string,
    displayName: string;
    campaignId: string;
}
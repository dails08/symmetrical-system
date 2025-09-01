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
    advances: {name: string, desc: string}[],
    inventory: {name: string, desc: string}[]
}

export enum EStances {
    Slay = "slay",
    Flow = "flow",
    Parry = "parry"
}
export interface IBlade extends ISlayer {
    stance: EStances,
    weaponNumber: number,
    weaponSides: number,
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
    knownSpells: {name: string, effect: string, range: string, spellId: string, boostedEffect: string, enhancedEffect: string, enhanced: boolean}[]
}

export interface ITactician extends ISlayer {
    plans: number[],
}

export interface IPlayer {
    id: string,
    displayName: string,
    chekhovPoints: number,
}

export interface IPlayerRecord extends IPlayer {
    campaigns: string[],
    currentCampaign: string
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
    id: string,
    displayName: string;
    campaignId: string;
}

export const spellData = {
    corruptingTouch: {
        displayName: "Corrupting Touch",
        iconID: 34,
        description: "The corruption inside you leaps from your hands to those you touch.",
        base: "Target is infected by your corruption. Every time you cast a spell after this, the infected target takes 1 damage. Effect lasts until the target or you are Downed.",
        range: "Engaged",
        boost: "Every time you cast a spell, the infected target takes damage equal to your Corruption score.",
        enhance: "When the target dies, immediately choose another target within Near range to gain Corrupting Touch's effect."
    },
        energyBolt: {
        displayName: "Energy Bolt",
        iconID: 51,
        description: "TCat a olt of raw energy, crackling with power.",
        base: "First a bolt of energy at a target, dealing 2 damage per Hit.",
        range: "Near and Far",
        boost: "+1 to damage per Hit.",
        enhance: "Base effect damage is now 3 damage per Hit."
    }
}
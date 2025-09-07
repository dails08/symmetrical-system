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

export const spellData = [
    {
        displayName: "Corrupting Touch",
        iconID: 34,
        description: "The corruption inside you leaps from your hands to those you touch.",
        base: "Target is infected by your corruption. Every time you cast a spell after this, the infected target takes 1 damage. Effect lasts until the target or you are Downed.",
        range: "Engaged",
        boost: "Every time you cast a spell, the infected target takes damage equal to your Corruption score.",
        enhance: "When the target dies, immediately choose another target within Near range to gain Corrupting Touch's effect."
    },
    {
        displayName: "Corrupting Wave",
        iconID: 36,
        description: "The corruption inside you erupts out, lashing out at all around you.",
        base: "Everyone within Engaged and Near range, including allies, takes damage equal to your current Corruption score.",
        range: "Engaged and Near",
        boost: "Damage is doubled.",
        enhance: "Allies only take 1 damage from the effect."
    },
    {
        displayName: "Energy Bolt",
        iconID: 51,
        description: "Cast a bolt of raw energy, crackling with power.",
        base: "First a bolt of energy at a target, dealing 2 damage per Hit.",
        range: "Near and Far",
        boost: "+1 to damage per Hit.",
        enhance: "Base effect damage is now 3 damage per Hit."
    },
    {
        displayName: "Fear Cloud",
        iconID: 14,
        description: "Plant the worst fears into the minds of your foes and watch them panic.",
        base: "Target and anyone at Engaged with them always make a Move action away from you until the start of your next turn.",
        range: "Near",
        boost: "Those affected are paralyzed and take 1 fewer Actions on their next turn instead of fleeing.",
        enhance: "Fear Cloud now works at any range."
    },
    {
        displayName: "Hex",
        iconID: 28,
        description: "You always have just the right trick to weaken your foes and make them vulnerable.",
        base: "Choose 1 effect. Effect lasts until the end of the target's next turn. Haze: Target must roll 5+ to hit. Lock Up: Target cannot Move. Betray: Target attacks nearest fellow enemy.",
        range: "Any",
        boost: "Effects last 2 turns.",
        enhance: "Choose 2 effects instead."
    },
    {
        displayName: "Mend",
        iconID: 13,
        description: "Though corrupting, your power can mend those you care about...for a cost.",
        base: "Target heals for 1d6 HP per Hit. This can also revive a downed character.",
        range: "Any",
        boost: "2d6 per Hit.",
        enhance: "If you heal a character for at least 4 HP, you may also remove one corruption from yourself."
    },
    {
        displayName: "Siphon",
        iconID: 55,
        description: "Drain the life force directly from your foes and make it your own.",
        base: "Target loses 2 HP and you heal 2 HP.",
        range: "Engaged",
        boost: "Heal all of your lost HP and inflict that amount in damage to the target.",
        enhance: "Base effects increased +1."
    },
    {
        displayName: "Temporal Shift",
        iconID: 70,
        description: "Breaking time is dangerous, but you know how to give it a little nudge.",
        base: "Chose 1 effect: Slow: Target takes 1 fewer action during their next turn. Haste: Target takes 1 more action during their next turn.",
        range: "Near and Far",
        boost: "Affects 2 actions normally instead of 1.",
        enhance: "Slayers may do the same action twice when affected by Temporal Shift."
    }
]
    
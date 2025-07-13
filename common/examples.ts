import { IPlayer, ISlayer, IGunslinger, IBlade, IArcanist, ITactician, ERunes, EPlaybooks, EStances } from "./common";
import { Gunslinger, Advance } from "../server/src/SlayerRoomState";
import { ArraySchema } from "@colyseus/schema";


export const Clint: IGunslinger ={
    id: "",
    name: "Clint",
    class: EPlaybooks.Gunslinger,
    maxHP: 8,
    currentHP: 7,
    damage: 2,
    speed: 6,
    skillsAgile: 6,
    skillsBrawn: 6,
    skillsDeceive: 6,
    skillsHunt: 6,
    skillsMend: 6,
    skillsNegotiate: 6,
    skillsStreet: 6,
    skillsStealth: 6,
    skillsStudy: 6,
    skillsTactics: 6,

    advances: [{
        name: "Draw",
        desc: "Roll a d8 for speed"
    }],
    inventory: [],
    chamber1Loaded: true,
    chamber1Rune: ERunes.None,
    chamber2Loaded: true,
    chamber2Rune: ERunes.None,
    chamber3Loaded: true,
    chamber3Rune: ERunes.None,
    chamber4Loaded: true,
    chamber4Rune: ERunes.None,
    chamber5Loaded: true,
    chamber5Rune: ERunes.None,
    chamber6Loaded: true,
    chamber6Rune: ERunes.None,
};



export const Cervantes: IBlade = {
    id: "",
    name: "Cervantes de Leon",
    class: EPlaybooks.Blade,
    maxHP: 8,
    currentHP: 7,
    damage: 2,
    speed: 6,
    weaponNumber: 1,
    weaponSides: 6,
    skillsAgile: 6,
    skillsBrawn: 6,
    skillsDeceive: 6,
    skillsHunt: 6,
    skillsMend: 6,
    skillsNegotiate: 6,
    skillsStreet: 6,
    skillsStealth: 6,
    skillsStudy: 6,
    skillsTactics: 6,

    advances: [],
    inventory: [{
        name: "Soul Edge",
        desc: "Cervantes was seriously wounded, but the soul still burns..."
    }],
    stance: EStances.Flow
}

export const Ryze: IArcanist = {
    id: "",
    name: "Ryze",
    class: EPlaybooks.Arcanist,
    maxHP: 8,
    currentHP: 7,
    damage: 2,
    speed: 6,
    skillsAgile: 6,
    skillsBrawn: 6,
    skillsDeceive: 6,
    skillsHunt: 6,
    skillsMend: 6,
    skillsNegotiate: 6,
    skillsStreet: 6,
    skillsStealth: 6,
    skillsStudy: 6,
    skillsTactics: 6,

    advances: [],
    inventory: [],
    corruption: 2,
    favoredSpell: "",
    knownSpells: [
        {
            name: "Create Potato",
            desc: "Creates a potato",
            enhanced: false
        }
    ]
}

export const Gene: ITactician = {
    id: "",
    name: "Gene Krantz",
    class: EPlaybooks.Tactician,
    maxHP: 8,
    currentHP: 7,
    damage: 2,
    speed: 6,
    skillsAgile: 6,
    skillsBrawn: 6,
    skillsDeceive: 6,
    skillsHunt: 6,
    skillsMend: 6,
    skillsNegotiate: 6,
    skillsStreet: 6,
    skillsStealth: 6,
    skillsStudy: 6,
    skillsTactics: 6,

    advances: [{
        name: "Draw",
        desc: "Roll a d8 for speed"
    }],
    inventory: [],
    plans: []
}



export const Chris: IPlayer = {
    id: "soubaiurvb",
    name: "dails",
    displayName: "Chris",
    chekhovPoints: 0,
}
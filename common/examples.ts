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
    weaponNumber: 1,
    weaponSides: 6,
    skillsAgile: 4,
    skillsBrawn: 4,
    skillsDeceive: 4,
    skillsHunt: 4,
    skillsMend: 4,
    skillsNegotiate: 4,
    skillsStreet: 4,
    skillsStealth: 4,
    skillsStudy: 4,
    skillsTactics: 4,

    advances: [{
        name: "Draw",
        desc: "Roll a d8 for speed"
    }],
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
    skillsAgile: 4,
    skillsBrawn: 4,
    skillsDeceive: 4,
    skillsHunt: 4,
    skillsMend: 4,
    skillsNegotiate: 4,
    skillsStreet: 4,
    skillsStealth: 4,
    skillsStudy: 4,
    skillsTactics: 4,

    advances: [],
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
    weaponNumber: 1,
    weaponSides: 6,
    skillsAgile: 4,
    skillsBrawn: 4,
    skillsDeceive: 4,
    skillsHunt: 4,
    skillsMend: 4,
    skillsNegotiate: 4,
    skillsStreet: 4,
    skillsStealth: 4,
    skillsStudy: 4,
    skillsTactics: 4,

    advances: [],
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
    weaponNumber: 1,
    weaponSides: 6,
    skillsAgile: 4,
    skillsBrawn: 4,
    skillsDeceive: 4,
    skillsHunt: 4,
    skillsMend: 4,
    skillsNegotiate: 4,
    skillsStreet: 4,
    skillsStealth: 4,
    skillsStudy: 4,
    skillsTactics: 4,

    advances: [{
        name: "Draw",
        desc: "Roll a d8 for speed"
    }],
    plans: []
}



export const Chris: IPlayer = {
    id: "soubaiurvb",
    name: "dails",
    displayName: "Chris",
    currentCampaign: ""
}
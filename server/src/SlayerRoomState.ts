import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { EPlaybooks, ISlayer, IPlayer, IGunslinger, ERunes, IBlade, EStances, IArcanist, ITactician } from "../../common/common";


export class Advance extends Schema {
  @type("string") name: string = "";
  @type("string") desc: string = "";
}

export class Player extends Schema implements IPlayer {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("string") displayName: string = "";

}

// export class Slayer extends Schema implements ISlayer { //re-un-comment this to soft-check interface compliance
export class Slayer extends Schema {
  @type("string") name: string = "";
  @type("string") class: EPlaybooks = EPlaybooks.Blade;
  @type("number") maxHP: number = 8;
  @type("number") currentHP: number = 8;

  @type([Advance]) advances = new ArraySchema<Advance>();
  @type("number") damage: number = 1;
  @type("number") speed: 8 | 4 | 6 | 10 | 12 = 6;
  @type("number") weaponNumber: number = 1;
  @type("number") weaponSides: number = 6;

  loadAdvances(data: ISlayer) {
    this.advances = new ArraySchema<Advance>();
    for (let advance of data.advances){
      const newAdvance = new Advance();
      newAdvance.name = advance.name;
      newAdvance.desc = advance.desc
      this.advances.push(new Advance)
    }
  }
}

// export class Gunslinger extends Slayer implements IGunslinger {
export class Gunslinger extends Slayer {
  @type("boolean") chamber1Loaded: boolean = false;
  @type("string") chamber1Rune: ERunes = ERunes.None;
  @type("boolean") chamber2Loaded: boolean = false;
  @type("string") chamber2Rune: ERunes = ERunes.None;
  @type("boolean") chamber3Loaded: boolean = false;
  @type("string") chamber3Rune: ERunes = ERunes.None;
  @type("boolean") chamber4Loaded: boolean = false;
  @type("string") chamber4Rune: ERunes = ERunes.None;
  @type("boolean") chamber5Loaded: boolean = false;
  @type("string") chamber5Rune: ERunes = ERunes.None;
  @type("boolean") chamber6Loaded: boolean = false;
  @type("string") chamber6Rune: ERunes = ERunes.None;

  static from(data: IGunslinger): Gunslinger {
    const returnValue = new Gunslinger();
    Object.assign(returnValue, data);
    returnValue.loadAdvances(data);
    return returnValue;
  }
}

// export class Blade extends Slayer implements IBlade {
export class Blade extends Slayer {
  @type("string") stance: EStances = EStances.Flow;

  static from(data: IBlade): Blade {
    const returnValue = new Blade();
    Object.assign(returnValue, data);
    returnValue.loadAdvances(data);
    return returnValue;
  }

}

export class KnownSpell extends Schema {
  @type("string") name = "";
  @type("string") desc = "";
  @type("boolean") enhanced = false;
}

export class Arcanist extends Slayer {
  @type("number") corruption: number = 0;
  @type("string") favoredSpell: string = "";
  @type([KnownSpell]) knownSpells = new ArraySchema<KnownSpell>();

  static from(data: IArcanist): Arcanist {
    const returnValue = new Arcanist();
    Object.assign(returnValue, data);
    returnValue.loadAdvances(data);
    returnValue.knownSpells = new ArraySchema<KnownSpell>();
    for (let knownSpell of data.knownSpells){
      const newKnownSpell = new KnownSpell();
      newKnownSpell.name = knownSpell.name;
      newKnownSpell.desc = knownSpell.desc;
      newKnownSpell.enhanced = knownSpell.enhanced;
      returnValue.knownSpells.push(newKnownSpell);
    }
    return returnValue;
  }
}

export class Tactician extends Slayer {
  @type(["number"]) plans: number[] = [];

  static from(data: ITactician): Tactician {
    const returnValue = new Tactician();
    Object.assign(returnValue, data);
    returnValue.loadAdvances(data);
    return returnValue;
  }
}

export function schemaFromTemplate(data: ISlayer) {
  if (data.class == EPlaybooks.Blade) return Blade.from(data as IBlade);
  if (data.class == EPlaybooks.Gunslinger) return Gunslinger.from(data as IGunslinger);
  if (data.class == EPlaybooks.Arcanist) return Arcanist.from(data as IArcanist);
  if (data.class == EPlaybooks.Tactician) return Tactician.from(data as ITactician);
  return undefined
}

export class SlayerRoomState extends Schema {

  @type({map: Player}) playerMap = new MapSchema<Player>();
  @type([Slayer]) roster = new ArraySchema<Slayer>();
  @type([Slayer]) kia = new ArraySchema<Slayer>();
}

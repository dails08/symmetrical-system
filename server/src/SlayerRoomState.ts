import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { EPlaybooks, ISlayer, IPlayer, IGunslinger, ERunes, IBlade, EStances, IArcanist, ITactician } from "../../common/common";
import { v4 as uuidv4 } from "uuid";

export class Advance extends Schema {
  @type("string") name: string = "";
  @type("string") desc: string = "";
}

export class Player extends Schema implements IPlayer {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("string") displayName: string = "";
  @type("string") currentCampaign: string = "";

}

// export class Slayer extends Schema implements ISlayer { //re-un-comment this to soft-check interface compliance
export class Slayer extends Schema {

  constructor(data?: ISlayer){
    super();
    if (data){
      Object.assign(this, data);
      if (this.id == ""){
        this.id = uuidv4();
      }
      this.advances = new ArraySchema<Advance>();
      for (let advance of data.advances){
        const newAdvance = new Advance();
        newAdvance.name = advance.name;
        newAdvance.desc = advance.desc;
        this.advances.push(newAdvance);
      }
    } else {
      this.advances = new ArraySchema<Advance>();
    }
  }

  toISlayer(){
    const slayer: ISlayer = {
      id: this.id,
      name: this.name,
      class: this.class,
      currentHP: this.currentHP,
      damage: this.damage,
      maxHP: this.maxHP,
      speed: this.speed,
      weaponNumber: this.weaponNumber,
      weaponSides: this.weaponSides,
      skillsAgile: this.skillsAgile,
      skillsBrawn: this.skillsBrawn,
      skillsDeceive: this.skillsDeceive,
      skillsHunt: this.skillsHunt,
      skillsMend: this.skillsMend,
      skillsNegotiate: this.skillsNegotiate,
      skillsStreet: this.skillsStreet,
      skillsStealth: this.skillsStealth,
      skillsStudy: this.skillsStudy,
      skillsTactics: this.skillsTactics,
      advances: []
    }
    for (const advance of this.advances){
      slayer.advances.push(advance);
    }
    return slayer;
  }
  @type("string") id: string = "";
  @type("string") name: string = "Nameless";
  @type("string") class: EPlaybooks = EPlaybooks.Blade;
  @type("number") maxHP: number = 8;
  @type("number") currentHP: number = 8;
  @type("number") skillsAgile: 4|6|8|10|12 = 4
  @type("number") skillsBrawn: 4|6|8|10|12 = 4
  @type("number") skillsDeceive: 4|6|8|10|12 = 4
  @type("number") skillsHunt: 4|6|8|10|12 = 4
  @type("number") skillsMend: 4|6|8|10|12 = 4
  @type("number") skillsNegotiate: 4|6|8|10|12 = 4
  @type("number") skillsStreet: 4|6|8|10|12 = 4
  @type("number") skillsStealth: 4|6|8|10|12 = 4
  @type("number") skillsStudy: 4|6|8|10|12 = 4
  @type("number") skillsTactics: 4|6|8|10|12 = 4

  @type([Advance]) advances = new ArraySchema<Advance>();
  @type("number") damage: number = 1;
  @type("number") speed: 8 | 4 | 6 | 10 | 12 = 6;
  @type("number") weaponNumber: number = 1;
  @type("number") weaponSides: number = 6;
}

// export class Gunslinger extends Slayer implements IGunslinger {
export class Gunslinger extends Slayer {

  constructor(data?: IGunslinger){
    super(data || undefined);
    this.class = EPlaybooks.Gunslinger;

    if (data){
      this.chamber1Loaded = data.chamber1Loaded;
      this.chamber1Rune = data.chamber1Rune;
      this.chamber2Loaded = data.chamber2Loaded;
      this.chamber2Rune = data.chamber2Rune;
      this.chamber3Loaded = data.chamber3Loaded;
      this.chamber3Rune = data.chamber3Rune;
      this.chamber4Loaded = data.chamber4Loaded;
      this.chamber4Rune = data.chamber4Rune;
      this.chamber5Loaded = data.chamber5Loaded;
      this.chamber5Rune = data.chamber5Rune;
      this.chamber6Loaded = data.chamber6Loaded;
      this.chamber6Rune = data.chamber6Rune;  
    }
  }

  toIGunslinger(): IGunslinger{
    const returnValue: IGunslinger = this.toISlayer() as IGunslinger;

    returnValue.chamber1Loaded = this.chamber1Loaded;
    returnValue.chamber1Rune = this.chamber1Rune;
    returnValue.chamber2Loaded = this.chamber2Loaded;
    returnValue.chamber2Rune = this.chamber2Rune;
    returnValue.chamber3Loaded = this.chamber3Loaded;
    returnValue.chamber3Rune = this.chamber3Rune;
    returnValue.chamber4Loaded = this.chamber4Loaded;
    returnValue.chamber4Rune = this.chamber4Rune;
    returnValue.chamber5Loaded = this.chamber5Loaded;
    returnValue.chamber5Rune = this.chamber5Rune;
    returnValue.chamber6Loaded = this.chamber6Loaded;
    returnValue.chamber6Rune = this.chamber6Rune;
    return returnValue;
  }
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
}

// export class Blade extends Slayer implements IBlade {
export class Blade extends Slayer {

  constructor(data?: IBlade) {
    super(data || undefined);
    this.class = EPlaybooks.Blade;
    if (data){
      this.stance = data.stance;
    }
  }

  toIBlade(){
    const returnValue: IBlade = this.toISlayer() as IBlade;
    returnValue.stance = this.stance;
    return returnValue;
  }
  @type("string") stance: EStances = EStances.Flow;
}

export class KnownSpell extends Schema {
  constructor(newSpell: {name: string, desc: string, enhanced: boolean}){
    super();
    Object.assign(this, newSpell);
  }

  toObject(){
    return {
      name: this.name,
      desc: this.desc,
      enhanced: this.enhanced
    }
  }
  @type("string") name = "";
  @type("string") desc = "";
  @type("boolean") enhanced = false;
}

export class Arcanist extends Slayer {

  constructor(data?: IArcanist){
    super(data);
    this.knownSpells = new ArraySchema<KnownSpell>();
    this.class = EPlaybooks.Arcanist;
    if (data){
      this.corruption = data.corruption;
      this.favoredSpell = data.favoredSpell;  
      for (let knownSpell of data.knownSpells){
        const newKnownSpell = new KnownSpell(knownSpell);
        newKnownSpell.name = knownSpell.name;
        newKnownSpell.desc = knownSpell.desc;
        newKnownSpell.enhanced = knownSpell.enhanced;
        this.knownSpells.push(newKnownSpell);
      }
    }
  }

  toIArcanist(){
    const returnValue: IArcanist = this.toISlayer() as IArcanist;
    returnValue.corruption = this.corruption;
    returnValue.favoredSpell = this.favoredSpell;
    returnValue.knownSpells = [];
    for (const knownSpell of this.knownSpells){
      returnValue.knownSpells.push(knownSpell.toObject())
    }
    return returnValue;
  }
  @type("number") corruption: number = 0;
  @type("string") favoredSpell: string = "";
  @type([KnownSpell]) knownSpells = new ArraySchema<KnownSpell>();

}

export class Tactician extends Slayer {
  constructor(data?: ITactician){
    super(data);
    this.class = EPlaybooks.Tactician;
    this.plans = new ArraySchema<Number>();
    if (data){
      for (const plan of data.plans){
        this.plans.push(plan);
      }  
    }
  }

  toITactician(){
    const returnValue: ITactician = this.toISlayer() as ITactician;
    returnValue.plans = new Array<number>();
    for (const elem of this.plans){
      returnValue.plans.push(elem as number);
    }
    return returnValue
  }
  @type(["number"]) plans = new ArraySchema<Number>();
}


export class SlayerRoomState extends Schema {

  @type({map: Player}) playerMap = new MapSchema<Player>();
  @type([Slayer]) roster = new ArraySchema<Slayer>();
  @type([Slayer]) kia = new ArraySchema<Slayer>();
  @type({ map: Slayer }) currentAssignments = new MapSchema<Slayer>();

  export(){
    
  }
}

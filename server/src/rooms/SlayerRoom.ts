import { Room, Client, logger, debugMessage } from "@colyseus/core";
import { SlayerRoomState, Advance, Player, Slayer, Blade, Tactician, Gunslinger, Arcanist, InventoryItem, KnownSpell, RecentRoll } from "../SlayerRoomState";
import { EPlaybooks, ICampaign, IJoinOptions, ISlayer, IBlade, IGunslinger, IArcanist, ITactician, ERunes } from "../../../common/common";
import { Clint, Ryze, Cervantes, Gene} from "../../../common/examples";
import { EMessageTypes, IBaseMsg, IRuneChangeMsg, ILoadedChangeMsg, IStanceChangeMsg, IRosterAddMsg, IKillMsg, IAssignmentMsg, IArrayChangeMsg, IPlayerUpdateMsg, ICharacterUpdateMsg, IUpdateNumericalMsg, IJoinResponseMsg, IWeaponChangeMsg, IAddPlanMsg, IRemovePlanMsg, IAddSpellMsg, IRemoveSpellMsg, ISetEnhancedMsg, ISetFavoredSpell, IPlayAnimationMsg, ISwapRollMsg, IPlayRollSwapMsg, ISetRecentRolls, ISprayLeadMsg, IPlayGunshotAnimationMsg } from "../../../common/messageFormat";
import { db } from "../firestoreConnection";
import { v4 as uuidv4 } from "uuid";
import { customRoll } from "../dddiceConnection";
import { IDiceRoll, IDieType, IRoll, ThreeDDiceRollEvent } from "dddice-js";

export class SlayerRoom extends Room<SlayerRoomState> {
  maxClients = 10;
  // db: Firestore | undefined;
  state = new SlayerRoomState();
  sessionIDtoPlayerIdMap = new Map<string, string>()
  overlayClients: Client[] = [];
  // campaign: ICampaign | undefined;
  campaign: ICampaign | undefined = {
    id: "",
    name: "Dummy campaign",
    gms: [],
    players: [],
    roster: [],
    kia: []
  }


  constructor(){
    super();

  
  }


  static schemaFromISlayer(slayerData: ISlayer){
    if (slayerData.class == EPlaybooks.Blade) return new Blade(slayerData as IBlade);
    else if (slayerData.class == EPlaybooks.Gunslinger) return new Gunslinger(slayerData as IGunslinger);
    else if (slayerData.class == EPlaybooks.Arcanist) return new Arcanist(slayerData as IArcanist);
    else return new Tactician(slayerData as ITactician);
  }


  async loadCampaign(campaignID: string){
    console.log("Loading campaign " + campaignID);
    const campaignRef = await db.collection("campaigns").doc(campaignID).get();
    const campaignValue = campaignRef.data();
    if (campaignValue){
      const tempCampaign: ICampaign = campaignValue as ICampaign;
      console.log("Found campaign " + tempCampaign.id); //\n" + JSON.stringify(campaignValue));
      this.campaign.name = tempCampaign.name;
      this.campaign.id = tempCampaign.id;
      this.campaign.gms = [];
      for (const gm of tempCampaign.gms){
        console.log("Adding " + gm + " to gms")
        this.campaign.gms.push(gm);
      }
      this.campaign.players = [];
      for (const player of tempCampaign.players){
        this.campaign.players.push(player);
      }
      this.campaign.roster = [];
      this.state.roster.clear();
      for (const character of tempCampaign.roster){
        this.campaign.roster.push(character);
        console.log("Adding " + character.name + " to roster");
        this.state.roster.push(SlayerRoom.schemaFromISlayer(character));
      }
      // console.log(JSON.stringify(this.campaign.roster));
      console.log("State roster is ")
      for (const slayerData of this.state.roster){
        console.log(slayerData.toISlayer().name);
      }
      this.campaign.kia = []
      this.state.kia.clear();
      for (const casualty of tempCampaign.kia){
        this.campaign.kia.push(casualty);
        this.state.kia.push(SlayerRoom.schemaFromISlayer(casualty));
      }
      tempCampaign.roomId = this.roomId;
      db.collection("campaigns").doc(campaignID).set(tempCampaign);
    } else {
      console.log("No campaign found with id " + campaignID);
    }
    
      
  }

  saveCampaign(){
    // this.campaign.roster = [];
    // for (const character of this.state.roster){
    //   this.campaign.roster.push(character.toJSON() as ISlayer)
    // }
    // this.campaign.kia = [];
    // for (const character of this.state.kia){
    //   this.campaign.kia.push(character.toJSON() as ISlayer)
    // }
    console.log(this.state.roster.length);
    // console.log(this.state.roster.toArray());
    const cleanCampaign: ICampaign = {
      id: this.campaign.id,
      name: this.campaign.name,
      roster: this.state.roster.toJSON(),
      kia: this.state.kia.toJSON(),
      roomId: this.roomId,
      gms: this.campaign.gms,
      players: this.campaign.players
    }
    // console.log("Saving:");
    // console.log(JSON.stringify(cleanCampaign));
    db.collection("campaigns").doc(this.campaign.id).set(cleanCampaign).then((value) => {
      // console.log(value);
      console.log("Campaign " + this.campaign.id + " saved");
    })


  }
  
  sessionIdToPlayer(seshId: string){
    const clientPlayerId = this.sessionIDtoPlayerIdMap.get(seshId);
    return this.state.playerMap.get(clientPlayerId);

  }

  isGM(client: Client){
    // const clientPlayer = this.state.playerMap.get(client.sessionId);
    const clientPlayer = this.sessionIdToPlayer(client.sessionId);
    return clientPlayer && this.campaign.gms.includes(clientPlayer.id);
  }

  isOverlay(client: Client){
    return this.overlayClients.includes(client);
  }

  controlsCharacter(client: Client, slayer: Slayer){
    const clientPlayer = this.sessionIdToPlayer(client.sessionId);
    const assignment = this.state.currentAssignments.get(clientPlayer.id)
    return assignment.id == slayer.id;
  }

  getCharacterFromSession(client: Client){
    const clientPlayer = this.sessionIdToPlayer(client.sessionId);
    const assignment = this.state.currentAssignments.get(clientPlayer.id)
    return assignment;
  }

  setRecentRolls(rolls: {actor: string, action: string, value: number}[], action: "add" | "set"){
    if (action == "set"){
      this.state.recentRolls.clear();
    };
    for (let roll of rolls){
      this.state.recentRolls.push(new RecentRoll(roll.actor, roll.action, roll.value));
    }
  }

  sendOverlayMessage(msg: IBaseMsg) {
    for (let overlay of this.overlayClients){
      console.log("Forwarding message to overlay: " + JSON.stringify(msg));
      overlay.send(msg.kind, msg);
    }
  }

  roll(dice: IDiceRoll[], actor: string, skipUpdate?: boolean){
    // const rolls: IDiceRoll[] = [];
    if (!skipUpdate)
    {
      this.state.recentRolls.clear();
    }
    // for (const die of dice){
    //   rolls.push({
    //     label: die.name,
    //     type: die.size.toString(),
    //     theme: die.themeId
    //   })
    // };
    // const resp = dddice.roll.create(rolls);
    const resp = customRoll(dice, actor)
    if (!skipUpdate){
      resp.then(value => {
        const rollData = value.data as IRoll;
        for (const roll of rollData.values){
          this.setRecentRolls([{
            actor: actor,
            action: roll.label,
            value: roll.value
          }], "add");
        }
      })  
    }
    return resp
  }

  onCreate (options: any) {
    const ryze = new Arcanist(Ryze);
    const cervantes = new Blade(Cervantes);
    const gene = new Tactician(Gene);
    const clint = new Gunslinger(Clint);

    const exampleBand = [clint, ryze, cervantes, gene];

    console.log("DDDICE api key: ")
    console.log(process.env.DDDICE_API_KEY);
    // dddice.


    // for (const elem of exampleBand){
    //   this.state.roster.push(elem);
    //   // this.campaign.roster.push(elem);
    // }

    // const serviceAccount = JSON.parse(readFileSync("creds/slayers-74330-firebase-adminsdk-fbsvc-2e2d26caa1.json", "utf-8"));
    // // console.log(cert(serviceAccount));
  
    // const rtdbApp = initializeApp({
    //   credential: cert(serviceAccount),
    // })

  
    // db = getFirestore(rtdbApp, "slayersapp")


    // db.collection("cities").doc("Paris").get().then((value)=> {
    //   console.log(value.data());
    // })


    // db.collection("cities").doc("Paris").set(data).then((value) => {
    //   console.log(value);
    // })
    

 this.onMessage(EMessageTypes.SaveCampaign, (client, msg) => {
      console.log("Saving campaign " + this.campaign.id);
      this.saveCampaign();
    })

    this.onMessage(EMessageTypes.Assignment, (client, msg: IAssignmentMsg) => {
      if (this.isGM(client)) {
        if (msg.action == "unassign") {
          console.log("Unassigning " + msg.playerId)
          this.state.currentAssignments.delete(msg.playerId);
        }
        if (msg.action == "assign") {
          console.log("Assigning " + msg.slayerId + " to " + msg.playerId);
          for (const elem of this.state.roster){
            if (elem.id == msg.slayerId) {
              this.state.currentAssignments.set(msg.playerId, elem);
            }
          }
        }
      } else {
        console.log("Unauthorized: Assignment");
      }
    })
    

    this.onMessage(EMessageTypes.NumericalUpdate, (client, msg: IUpdateNumericalMsg) => {
      console.log(msg);
      for (const elem of this.state.roster){
        if (elem.id == msg.slayerId){
          if (this.isGM(client)){
            if (msg.field == "currentHP"){
              console.log("Setting hp");
              elem.currentHP = msg.newValue;
            }
            if (msg.field == "damage"){
              console.log("Setting damage");
              elem.damage = msg.newValue;
            }
            if (msg.field == "speed"){
              console.log("Setting speed");
              elem.speed = msg.newValue as 4 | 6 | 8 | 10 | 12;
            }
            if (msg.field == "maxHp"){
              console.log("Setting maxHp")
              elem.maxHP = msg.newValue;
            }
            if (["skillsAgile", "skillsBrawn", "skillsDeceive", "skillsHunt", "skillsMend", "skillsNegotiate", "skillsStealth", "skillsStreet", "skillsStudy", "skillsTactics"].includes(msg.field) && [4,6,8,10].includes(msg.newValue)){

              const field = msg.field as "skillsAgile" | "skillsBrawn" | "skillsDeceive" | "skillsHunt" | "skillsMend" | "skillsNegotiate" | "skillsStealth" | "skillsStreet" | "skillsStudy" | "skillsTactics";
              elem[field] = msg.newValue as 4 | 6 | 8 | 10 | 12;
            }
            if (msg.field == "corruption") {
              if (elem.class == EPlaybooks.Arcanist){
                const arcanistElem = elem as Arcanist;
                arcanistElem.corruption = msg.newValue;
              }
            }
          }  
          }
      }
    })
   

    

    // this.onMessage(EMessageTypes.CharacterUpdate, (client, msg: ICharacterUpdateMsg) => {
    //   const clientPlayer = this.sessionIdToPlayer(client.sessionId);
    //   // const clientPlayer = this.state.playerMap.get(client.sessionId);
    //   if (clientPlayer) {
    //     if (this.campaign.gms.includes(clientPlayer.id ) || this.state.currentAssignments.get(clientPlayer.id).id == msg.characterId){
    //       for (const elem of this.state.roster){
    //         if (elem.id == msg.characterId){
    //           elem.currentHP = msg.data.currentHP;
    //         }
    //       }    
    //     } else {
    //       console.log(clientPlayer.displayName + " (" + clientPlayer.id + ") is not authorized to update character " + msg.characterId);
    //       console.log(JSON.stringify(this.campaign.gms));
    //       console.log(clientPlayer.id);
    //     }
    //   }
    // })

    // this.onMessage("addDefault", (client, msg) => {
    //   for (const elem of exampleBand){
    //     this.state.roster.push(elem);
    //     // this.campaign.roster.push(elem);
    //   }  
    // })
  
    this.onMessage(EMessageTypes.Kill, (client, msg: IKillMsg) => {
      if (this.isGM(client)){
        console.log("Killing " + msg.characterId);
        const ix = this.state.roster.findIndex((slayer, ix) => {
          return slayer.id == msg.characterId;
        });
        if (ix) {
          this.state.kia.push(this.state.roster.splice(ix, 1)[0]);
        } else {
          console.log("No slayer found with id " + msg.characterId);
        }  
      } else {
        console.log("Not authorized to kill " + msg.characterId);
      }
    })

    this.onMessage(EMessageTypes.RosterAdd, (client, msg: IRosterAddMsg) => {
      if (this.isGM(client)) {
        console.log("Adding to roster " + msg.slayer.name);
        if (msg.slayer.class == EPlaybooks.Blade) {
          this.state.roster.push(new Blade(msg.slayer as IBlade))
        } else if (msg.slayer.class == EPlaybooks.Gunslinger) {
          this.state.roster.push(new Gunslinger(msg.slayer as IGunslinger))
        } else if (msg.slayer.class == EPlaybooks.Arcanist) {
          this.state.roster.push(new Arcanist(msg.slayer as IArcanist))
        } else if (msg.slayer.class == EPlaybooks.Tactician) {
          this.state.roster.push(new Tactician(msg.slayer as ITactician))
        }
      }
    })

    this.onMessage(EMessageTypes.StanceChange, (client, msg: IStanceChangeMsg) => {
      console.log("Changing stance of " + msg.characterId + " to " + msg.stance);
      const slayer = this.state.roster.find((slayer) => {
        return slayer.id == msg.characterId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Blade){
          if (this.isGM(client) || this.controlsCharacter(client, slayer)){
            const bladeSlayer = slayer as Blade;
            bladeSlayer.stance = msg.stance
          } else {
            console.log("Not authorized to!");
          }
        } else {
          console.log("Not a blade!");
        } 
      } else {
        console.log("Slayer not found in roster!");
      }
    })



    this.onMessage(EMessageTypes.ArrayChange, (client, msg: IArrayChangeMsg) => {
      // const clientPlayer = this.state.playerMap.get(client.sessionId);
      const clientPlayer = this.sessionIdToPlayer(client.sessionId);
      for (const slayer of this.state.roster){
        if (slayer.id == msg.characterId){
          if (clientPlayer && this.isGM(client) || this.controlsCharacter(client, slayer)) {
            if (msg.action == "remove" && "ix" in msg) {
              if (msg.array == "advances"){
                console.log("Removing advance with ix " + msg.ix)
                slayer.advances.splice(msg.ix, 1)
                console.log("Updated avd to " + JSON.stringify(slayer.advances));
              } else if (msg.array == "inventory"){
                console.log("Removing item");
                slayer.inventory.splice(msg.ix, 1);
              }
            } else if (msg.action == "add" && msg.data){
              if (msg.array == "advances"){
                const newAdvance = new Advance();
                newAdvance.name = msg.data.name;
                newAdvance.desc = msg.data.description
                slayer.advances.push(newAdvance);
                console.log("Updated adv  to " + JSON.stringify(slayer.advances));
              } else if (msg.array == "inventory") {
                console.log("Adding item");
                const newInvItem = new InventoryItem();
                newInvItem.name = msg.data.name;
                newInvItem.desc = msg.data.description
                slayer.inventory.push(newInvItem);
              }
            }   
          } else {
          console.log(clientPlayer.displayName + " (" + clientPlayer.id + ") is not authorized to update character " + msg.characterId);
          console.log(JSON.stringify(this.campaign.gms));
          console.log(clientPlayer.id);
          }
        }
      }
    });

    this.onMessage(EMessageTypes.PlayerUpdate, (client, msg: IPlayerUpdateMsg) => {
      if (this.isGM(client)){
        const targetPlayer = this.state.playerMap.get(msg.playerId);
        if (targetPlayer) {
          if (msg.field == "chekhov") {
            targetPlayer.chekhovPoints = Math.max(msg.newValueInt, 0);
          }
        } else {
          console.log("Target player " + msg.playerId + " not found");
        }

      }
    });

    this.onMessage(EMessageTypes.RuneChange, (client, msg: IRuneChangeMsg) => {
      const slayer = this.state.roster.find((slayer) => {
        return slayer.id == msg.slayerId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Gunslinger){
          if (this.isGM(client) || this.controlsCharacter(client, slayer)){
            const gunslingerSlayer = slayer as Gunslinger;

            if (msg.chamber == 1){
              gunslingerSlayer.chamber1Rune = msg.rune
            } else if (msg.chamber == 2){
              gunslingerSlayer.chamber2Rune = msg.rune
            } else if (msg.chamber == 3){
              gunslingerSlayer.chamber3Rune = msg.rune
            } else if (msg.chamber == 4){
              gunslingerSlayer.chamber4Rune = msg.rune
            } else if (msg.chamber == 5){
              gunslingerSlayer.chamber5Rune = msg.rune
            } else if (msg.chamber == 6){
              gunslingerSlayer.chamber6Rune = msg.rune
            }
          } else {
            console.log("Not authorized to!");
          }
        } else {
          console.log("Not a gunslinger!");
        } 
      } else {
        console.log("Slayer not found in roster!");
      }
    })

    this.onMessage(EMessageTypes.LoadedChange, (client, msg: ILoadedChangeMsg) => {
      const slayer = this.state.roster.find((slayer) => {
        return slayer.id == msg.slayerId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Gunslinger){
          if (this.isGM(client) || this.controlsCharacter(client, slayer)){
            const gunslingerSlayer = slayer as Gunslinger;

            if (msg.chamber == 1){
              gunslingerSlayer.chamber1Loaded = msg.loaded
            } else if (msg.chamber == 2){
              gunslingerSlayer.chamber2Loaded = msg.loaded
            } else if (msg.chamber == 3){
              gunslingerSlayer.chamber3Loaded = msg.loaded
            } else if (msg.chamber == 4){
              gunslingerSlayer.chamber4Loaded = msg.loaded
            } else if (msg.chamber == 5){
              gunslingerSlayer.chamber5Loaded = msg.loaded
            } else if (msg.chamber == 6){
              gunslingerSlayer.chamber6Loaded = msg.loaded
            }
          } else {
            console.log("Not authorized to!");
          }
        } else {
          console.log("Not a gunslinger!");
        } 
      } else {
        console.log("Slayer not found in roster!");
      }
    })

    this.onMessage(EMessageTypes.setWeapon, (client, msg: IWeaponChangeMsg) => {
      console.log("Setting weapon stats:")
      console.log(msg);
      const slayer = this.state.roster.find((slayer) => {
        return slayer.id == msg.slayerId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Blade){
          if (this.isGM(client) || this.controlsCharacter(client, slayer)){
            const classedSlayer = slayer as Blade;
            classedSlayer.weaponNumber = msg.dmgN || classedSlayer.weaponNumber;
            classedSlayer.weaponSides = msg.dmgS || classedSlayer.weaponSides;
          } else {
            console.log("Not authorized to!");
          }
        } else {
          console.log("Not a blade!");
        } 
      } else {
        console.log("Slayer not found in roster!");
      }
    })

    this.onMessage(EMessageTypes.addPlan, (client, msg: IAddPlanMsg) => {
      console.log("Adding plan:")
      console.log(msg);
      const slayer = this.state.roster.find((slayer) => {
        return slayer.id == msg.slayerId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Tactician){
          if (this.isGM(client) || this.controlsCharacter(client, slayer)){
            const classedSlayer = slayer as Tactician;
            classedSlayer.plans.push(msg.planVal);
          } else {
            console.log("Not authorized to!");
          }
        } else {
          console.log("Not a tactician!");
        } 
      } else {
        console.log("Slayer not found in roster!");
      }
    })

    this.onMessage(EMessageTypes.removePlan, (client, msg: IRemovePlanMsg) => {
      console.log("Removing plan:")
      console.log(msg);
      const slayer = this.state.roster.find((slayer) => {
        return slayer.id == msg.slayerId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Tactician){
          if (this.isGM(client) || this.controlsCharacter(client, slayer)){
            const classedSlayer = slayer as Tactician;
            classedSlayer.plans.splice(msg.planIx, 1);
          } else {
            console.log("Not authorized to!");
          }
        } else {
          console.log("Not a tactician!");
        } 
      } else {
        console.log("Slayer not found in roster!");
      }
    })

    this.onMessage(EMessageTypes.setEnhanced, (client, msg: ISetEnhancedMsg) => {
      console.log("Setting enhanced:")
      console.log(msg);
      const slayer = this.state.roster.find((slayer) => {
        return slayer.id == msg.slayerId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Arcanist){
          if (this.isGM(client) || this.controlsCharacter(client, slayer)){
            const classedSlayer = slayer as Arcanist;
            classedSlayer.knownSpells.at(msg.ix).enhanced = msg.enhanced;
          } else {
            console.log("Not authorized to!");
          }
        } else {
          console.log("Not an arcanist!");
        } 
      } else {
        console.log("Slayer not found in roster!");
      }
    })
    this.onMessage(EMessageTypes.addSpell, (client, msg: IAddSpellMsg) => {
      console.log("Adding spell:")
      console.log(msg);
      const slayer = this.state.roster.find((slayer) => {
        return slayer.id == msg.slayerId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Arcanist){
          if (this.isGM(client) || this.controlsCharacter(client, slayer)){
            const classedSlayer = slayer as Arcanist;
            const newSpell: KnownSpell = new KnownSpell({
              name: msg.name,
              effect: msg.effect,
              boostedEffect: msg.boostedEffect,
              enhancedEffect: msg.enhancedEffect,
              enhanced: false
            })
            classedSlayer.knownSpells.push(newSpell);
          } else {
            console.log("Not authorized to!");
          }
        } else {
          console.log("Not an arcanist!");
        } 
      } else {
        console.log("Slayer not found in roster!");
      }
    })
    this.onMessage(EMessageTypes.removeSpell, (client, msg: IRemoveSpellMsg) => {
      console.log("Removing spell:")
      console.log(msg);
      const slayer = this.state.roster.find((slayer) => {
        return slayer.id == msg.slayerId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Arcanist){
          if (this.isGM(client) || this.controlsCharacter(client, slayer)){
            const classedSlayer = slayer as Arcanist;
            classedSlayer.knownSpells.splice(msg.ix, 1);
          } else {
            console.log("Not authorized to!");
          }
        } else {
          console.log("Not an arcanist!");
        } 
      } else {
        console.log("Slayer not found in roster!");
      }
    })
    this.onMessage(EMessageTypes.setFavoredSpell, (client, msg: ISetFavoredSpell) => {
      console.log("Setting favored spell:")
      console.log(msg);
      const slayer = this.state.roster.find((slayer) => {
        return slayer.id == msg.slayerId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Arcanist){
          if (this.isGM(client) || this.controlsCharacter(client, slayer)){
            const classedSlayer = slayer as Arcanist;
            classedSlayer.favoredSpell = msg.favoredSpell || "None"
          } else {
            console.log("Not authorized to!");
          }
        } else {
          console.log("Not an arcanist!");
        } 
      } else {
        console.log("Slayer not found in roster!");
      }
    })

    this.onMessage(EMessageTypes.playAnimation, (client, msg: IPlayAnimationMsg) => {
      console.log(msg);
      if (this.isGM(client)){
        for (let overlay of this.overlayClients){
          console.log("Forwarding message to overlay");
          overlay.send(EMessageTypes.playAnimation, msg);
        }
      } else {
        console.log("Not authorized!");
      }
    })

    this.onMessage(EMessageTypes.setRecentRolls, (client, msg: ISetRecentRolls) => {
      if (this.isGM(client)){
        console.log("Setting rolls");
        this.setRecentRolls(msg.rolls, msg.action)
      } else {
        console.log("Only GMs authorized to set rolls externally!");
      }
    })

    this.onMessage(EMessageTypes.swapRoll, (client, msg: ISwapRollMsg) => {
      const player = this.sessionIdToPlayer(client.sessionId);
      const targetRoll = this.state.recentRolls[msg.rollIx];
      const playSwapMsg: IPlayRollSwapMsg = {
        kind: EMessageTypes.playRollSwap,
        action: targetRoll.rollName,
        actor: targetRoll.actor,
        oldValue: targetRoll.value,
        newValue: msg.planValue
      }
      console.log("Target roll: " + JSON.stringify(this.state.recentRolls[msg.rollIx]));
      if (
        this.isGM(client) ||
        this.state.currentAssignments.get(player.id).class == EPlaybooks.Tactician &&
        (this.state.currentAssignments.get(player.id) as Tactician).plans.includes(msg.planValue)
      ){
        if (this.isGM(client)){
          console.log("Request comes from a GM");
        } else {
          console.log("Request comes from eligible Tactician");
          const tacticianSlayer = (this.state.currentAssignments.get(player.id) as Tactician);
          const planIx = tacticianSlayer.plans.indexOf(msg.planValue);
          tacticianSlayer.plans.splice(planIx, 1);  
        }
        if (msg.action == "swap" || msg.action == "neutral"){
          this.state.recentRolls[msg.rollIx].value = Math.min(6, msg.planValue);
          playSwapMsg.newValue = this.state.recentRolls[msg.rollIx].value;
        } else if (msg.action == "add") {
          this.state.recentRolls[msg.rollIx].value = Math.min(6, (this.state.recentRolls[msg.rollIx].value + msg.planValue));
          playSwapMsg.newValue = this.state.recentRolls[msg.rollIx].value;
        } else if (msg.action == "subtract") {
          this.state.recentRolls[msg.rollIx].value = Math.max(1, (this.state.recentRolls[msg.rollIx].value - msg.planValue));
          playSwapMsg.newValue = this.state.recentRolls[msg.rollIx].value;
        }
        this.sendOverlayMessage(playSwapMsg);
        // console.log(JSON.stringify(this.state.recentRolls));
      } 

    });

    this.onMessage(EMessageTypes.sprayLead, (client, msg: ISprayLeadMsg) => {
      const assignedSlayer = this.getCharacterFromSession(client);
      if (this.isGM(client) || assignedSlayer.class == EPlaybooks.Gunslinger) {
        
        const runeToTheme = new Map<string, string>();
        runeToTheme.set("hollowpoint", "handa-mists-of-yuggoth");
        runeToTheme.set("blast", "infernal-ly6ghn2k");
        runeToTheme.set("tar", "dark-clouds-lu5mbgi2");
        runeToTheme.set("snare", "dddice-porcelain");
        runeToTheme.set("bleed", "futura-pink-m0wtlr5x");
        runeToTheme.set("seeker", "runeheart-ls6ujsiu");
        runeToTheme.set("none", "wendigo-lw9r7tr1");

        const assignedGunslinger = assignedSlayer as Gunslinger;
        const chambers = [
          {rune: assignedGunslinger.chamber1Rune, loaded: assignedGunslinger.chamber1Loaded},
          {rune: assignedGunslinger.chamber2Rune, loaded: assignedGunslinger.chamber2Loaded},
          {rune: assignedGunslinger.chamber3Rune, loaded: assignedGunslinger.chamber3Loaded},
          {rune: assignedGunslinger.chamber4Rune, loaded: assignedGunslinger.chamber4Loaded},
          {rune: assignedGunslinger.chamber5Rune, loaded: assignedGunslinger.chamber5Loaded},
          {rune: assignedGunslinger.chamber6Rune, loaded: assignedGunslinger.chamber6Loaded},
        ]
        
        const toRolls: IDiceRoll[] = [];
        for (const chamberRaw of msg.chambers) {
          const chamber = chamberRaw - 1;
          const chamberIsLoaded = chambers[chamber].loaded;
          const runeValue = chambers[chamber].rune;
          const runeText = runeValue == ERunes.None ? "Bullet" : runeValue; 
          if (chamberIsLoaded){
              if (chamberRaw == 1){
                assignedGunslinger.chamber1Loaded = false;
              } else if(chamberRaw == 2){
                assignedGunslinger.chamber2Loaded = false;
              } else if(chamberRaw == 3){
                assignedGunslinger.chamber3Loaded = false;
              } else if(chamberRaw == 4){
                assignedGunslinger.chamber4Loaded = false;
              } else if(chamberRaw == 5){
                assignedGunslinger.chamber5Loaded = false;
              } else if(chamberRaw == 6){
                assignedGunslinger.chamber6Loaded = false;
              }
              // TODO: Fake Rolls
              toRolls.push({
                label: runeText,
                type: "d6",
                theme: runeToTheme.get(runeText) || "wendigo-lw9r7tr1"
              })
              
              // const rollValue = Math.floor(Math.random() * 6);
              // console.log(runeText + " rolled a " + rollValue);
              // const bulletRoll = new RecentRoll(assignedGunslinger.name, runeText, rollValue);
              // this.state.recentRolls.push(bulletRoll);
          }
          
        }
        this.roll(toRolls, assignedGunslinger.name).then(result => {
          console.log(result);
          const rollData = result.data as IRoll;
          const toShots: {rune: string, hit: boolean}[] = [];
          for (const value of rollData.values){
            toShots.push({
              rune: value.label,
              hit: value.label == "seeker" ? value.value >= 3 : value.value >= 4
            })
          }
          const msg: IPlayGunshotAnimationMsg = {
            kind: EMessageTypes.playGunshotAnimation,
            shots: toShots
          }
          this.sendOverlayMessage(msg);
        }).catch((err) => {
          // console.log
        })
      }
    })
    



  }

  

  async onJoin (client: Client, options: IJoinOptions) {
    console.log(client.sessionId, "joined: " + JSON.stringify(options));
    if (options.id == "overlay"){
      this.overlayClients.push(client);
    }

    if (this.state.playerMap.size == 0){
      if (this.campaign.id == "" && options.campaignId != ""){
        console.log("On join, loading campaign " + options.campaignId);
        await this.loadCampaign(options.campaignId);
        this.state.recentRolls.push(
          new RecentRoll("Clint", "Hollowpoint", 6),
          new RecentRoll("Clint", "Bullet", 4),
          new RecentRoll("Clint", "Seeker", 2)
        );
        console.log(JSON.stringify(this.state.recentRolls));
    
        // console.log("Onjoin loaded campaign: " + JSON.stringify(this.campaign));
      }
    }

    const player = new Player();
    player.displayName = options.displayName || "U.N. Owen";
    if (options.id == ""){
      player.id = uuidv4().slice(0,4)
    } else {
      player.id = options.id;
    }
    console.log("Checking for " + player.id + " in " + JSON.stringify(this.campaign.gms));
    const role: "gm" | "player" = this.campaign.gms.includes(player.id) ? "gm" : "player";
    const joinResponseMessage: IJoinResponseMsg = {
      kind: EMessageTypes.JoinResponse,
      role: role,
      player: player
    }
    console.log("Sending join message with role = " + role);
    client.send(EMessageTypes.JoinResponse, joinResponseMessage);
    
    this.state.playerMap.set(player.id, player);
    this.sessionIDtoPlayerIdMap.set(client.sessionId, player.id);
    if (!this.isGM(client) && !this.isOverlay(client)){
      const ix = Math.floor(Math.random() * this.state.roster.length);
      // console.log(this.state.roster)
      console.log("Assigning " + this.state.roster[ix].name);
      this.state.currentAssignments.set(player.id, this.state.roster[ix]);
      console.log("Added " + player.id)
      console.log("Playermap:")
      this.state.playerMap.forEach((v, k) => {
        console.log(v.displayName);
      } )
    } else {
      console.log("Not assigning to overlay or GM.");
    }

    if (this.campaign.gms)
    console.log("==========");

  }

  onLeave (client: Client, consented: boolean) {
    const clientPlayer = this.sessionIdToPlayer(client.sessionId);
    if (clientPlayer){
      console.log(clientPlayer.displayName + " (" + clientPlayer.id + "): " + client.sessionId, "left!");
      if (this.state.currentAssignments.has(clientPlayer.id) ){
        console.log("Assignment deleted? " + this.state.currentAssignments.delete(clientPlayer.id));
  
      }
      if (this.state.playerMap.has(clientPlayer.id)){
        console.log("Player deleted? " + this.state.playerMap.delete(clientPlayer.id));
        console.log("Session removed? " + this.sessionIDtoPlayerIdMap.delete(client.sessionId));
      }
      console.log("Deleted " + clientPlayer.id)
      console.log("Playermap:")
      this.state.playerMap.forEach((v, k) => {
        console.log(v.displayName);
      } )
      console.log("==========");  
    } else {
      console.log(client.sessionId + " not in playermap: ");
      console.log(JSON.stringify(this.state.playerMap));
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}

// template
// const slayer = this.state.roster.find((slayer) => {
//   return slayer.id == msg.characterId;
// })
// if ( slayer){
//   if (slayer.class == EPlaybooks.Blade){
//     if (this.isGM(client) || this.controlsCharacter(client, slayer)){
//       const bladeSlayer = slayer as Blade;
//       bladeSlayer.stance = msg.stance
//     } else {
//       console.log("Not authorized to!");
//     }
//   } else {
//     console.log("Not a blade!");
//   } 
// } else {
//   console.log("Slayer not found in roster!");
// }
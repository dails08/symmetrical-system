import { Room, Client, logger, debugMessage } from "@colyseus/core";
import { SlayerRoomState, Advance, Player, Slayer, Blade, Tactician, Gunslinger, Arcanist, InventoryItem } from "../SlayerRoomState";
import { EPlaybooks, ICampaign, IJoinOptions, ISlayer, IBlade, IGunslinger, IArcanist, ITactician } from "../../../common/common";
import { Clint, Ryze, Cervantes, Gene} from "../../../common/examples";
import { EMessageTypes, IBaseMsg, IRuneChangeMsg, ILoadedChangeMsg, IStanceChangeMsg, IRosterAddMsg, IKillMsg, IAssignmentMsg, IArrayChangeMsg, IPlayerUpdateMsg, ICharacterUpdateMsg, IUpdateNumericalMsg, IJoinResponseMsg, IWeaponChangeMsg, IAddPlanMsg, IRemovePlanMsg } from "../../../common/messageFormat";
import { db } from "../firestoreConnection";
import { v4 as uuidv4 } from "uuid";

export class SlayerRoom extends Room<SlayerRoomState> {
  maxClients = 4;
  // db: Firestore | undefined;
  state = new SlayerRoomState();
  sessionIDtoPlayerIdMap = new Map<string, string>()
  // campaign: ICampaign | undefined;
  campaign: ICampaign | undefined = {
    id: "",
    name: "Dummy campaign",
    gms: [],
    players: [],
    roster: [],
    kia: []
  }

  lastRollResult: number = 1;

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

  controlsCharacter(client: Client, slayer: Slayer){
    const clientPlayer = this.sessionIdToPlayer(client.sessionId);
    const assignment = this.state.currentAssignments.get(clientPlayer.id)
    return assignment.id == slayer.id;
  }

  onCreate (options: any) {
    const ryze = new Arcanist(Ryze);
    const cervantes = new Blade(Cervantes);
    const gene = new Tactician(Gene);
    const clint = new Gunslinger(Clint);

    const exampleBand = [clint, ryze, cervantes, gene];
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
          this.state.kia.push(this.state.roster.splice(ix)[0]);
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
                slayer.advances.splice(msg.ix)
                console.log("Updated avd to " + JSON.stringify(slayer.advances));
              } else if (msg.array == "inventory"){
                console.log("Removing item");
                slayer.inventory.splice(msg.ix);
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
            classedSlayer.plans.splice(msg.planIx);
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



  }

  

  async onJoin (client: Client, options: IJoinOptions) {
    console.log(client.sessionId, "joined: " + JSON.stringify(options));

    if (this.state.playerMap.size == 0){
      if (this.campaign.id == "" && options.campaignId != ""){
        console.log("On join, loading campaign " + options.campaignId);
        await this.loadCampaign(options.campaignId);
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
    const ix = Math.floor(Math.random() * this.state.roster.length);
    // console.log(this.state.roster)
    console.log("Assigning " + this.state.roster[ix].name);
    this.state.currentAssignments.set(player.id, this.state.roster[ix]);
    console.log("Added " + player.id)
    console.log("Playermap:")
    this.state.playerMap.forEach((v, k) => {
      console.log(v.displayName);
    } )

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
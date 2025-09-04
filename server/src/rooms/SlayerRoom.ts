import { Room, Client, logger, debugMessage } from "@colyseus/core";
import { SlayerRoomState, Advance, Player, Slayer, Blade, Tactician, Gunslinger, Arcanist, InventoryItem, KnownSpell, RecentRoll } from "../SlayerRoomState";
import { EPlaybooks, ICampaign, IJoinOptions, ISlayer, IBlade, IGunslinger, IArcanist, ITactician, ERunes } from "../../../common/common";
import { Clint, Ryze, Cervantes, Gene} from "../../../common/examples";
import { EMessageTypes, IBaseMsg, IRuneChangeMsg, ILoadedChangeMsg, IStanceChangeMsg, IRosterAddMsg, IKillMsg, IAssignmentMsg, IArrayChangeMsg, IPlayerUpdateMsg, ICharacterUpdateMsg, IUpdateNumericalMsg, IJoinResponseMsg, IWeaponChangeMsg, IAddPlanMsg, IRemovePlanMsg, IAddSpellMsg, IRemoveSpellMsg, ISetEnhancedMsg, ISetFavoredSpell, IPlayAnimationMsg, ISwapRollMsg, IPlayRollSwapMsg, ISetRecentRolls, ISprayLeadMsg, IPlayGunshotAnimationMsg, IRollMsg } from "../../../common/messageFormat";
import { db } from "../firestoreConnection";
import { v4 as uuidv4 } from "uuid";
import { customRoll } from "../dddiceConnection";
import { IApiResponse, IDiceRoll, IDieType, IRoll, ThreeDDiceRollEvent } from "dddice-js";
import { addTacticianCallbacks } from "../playbooks/tactician";
import { addGunslingerCallbacks } from "../playbooks/gunslinger";
import { addArcanistCallbacks } from "../playbooks/arcanist";
import { addBladeCallbacks } from "../playbooks/blade";
import { addGMCallbacks } from "../playbooks/gm";

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
      // console.log("Forwarding message to overlay: " + JSON.stringify(msg));
      overlay.send(msg.kind, msg);
    }
  }

  roll(dice: IDiceRoll[], actor: string, DNA?: string, skipUpdate?: boolean){
    let resp: Promise<IApiResponse<string, IRoll>>;

    if (!skipUpdate)
    {
      this.state.recentRolls.clear();
    }

    if (DNA == "A" || DNA == "D"){
      // const rollOne = customRoll(dice, actor);
      // const rollTwo = customRoll(dice, actor);

      resp = customRoll(dice.concat(dice), actor).then(advantageRollResult => {
        const rollResultOne = advantageRollResult.data.values.slice(0, advantageRollResult.data.values.length / 2);
        const rollResultTwo = advantageRollResult.data.values.slice(advantageRollResult.data.values.length / 2);
        const finalResult = [];
        for (let i = 0; i < rollResultOne.length; i++){
          const valueOne = rollResultOne[i];
          const valueTwo = rollResultTwo[i];
          console.log("Checking " + valueOne.value + " <> " + valueTwo.value);
          if (DNA == "A"){ // I know there are more clever ways to do this, but more clever == harder to read
            if (valueOne.value >= valueTwo.value){
              finalResult.push(valueOne)
            } else {
              finalResult.push(valueTwo);
            }
          }
          if (DNA == "D"){
            if (valueOne.value >= valueTwo.value){
              finalResult.push(valueTwo)
            } else {
              finalResult.push(valueOne);
            }
          }
        } // done comparing rolls
        const tmpRoll: IRoll = advantageRollResult.data;
        tmpRoll.values = finalResult;
        const tmpResponse: IApiResponse<string, IRoll> = {
          type: "IRoll",
          data: tmpRoll
        }
        return new Promise<IApiResponse<string, IRoll>>((resolve, reject) => {
          resolve(tmpResponse);
        });
        
      })
    } else { //"N", neutral roll
      resp = customRoll(dice, actor);
    }

    if (!skipUpdate){
      resp.then(value => {
        // console.log(value);
        setTimeout(() => { // so the Tactician doesn't see the result before the roll animation finishes
          const toRecentRolls = [];
          for (const roll of value.data.values){
            toRecentRolls.push({
            actor: actor,
            action: roll.label,
            value: roll.value
            })
          };
          console.log("Sending to set recent rolls:");
          console.log(toRecentRolls);
          this.setRecentRolls(toRecentRolls, "set");  
        },2000)

    });
  };
  return resp
}

  onCreate (options: any) {

    addTacticianCallbacks(this);
    addGunslingerCallbacks(this);
    addArcanistCallbacks(this);
    addBladeCallbacks(this);
    addGMCallbacks(this);

    this.onMessage(EMessageTypes.Roll, (client, msg: IRollMsg) => {
    console.log(msg);
    const assignedSlayer = this.getCharacterFromSession(client);
    const toDiceRolls: IDiceRoll[] = [];
    for (const die of msg.dice){
      toDiceRolls.push({
        type: "d" + die.type.toString(),
        label: msg.label
      })
    }
    this.roll(toDiceRolls, assignedSlayer.name, msg.DNA).then(result => {

    })
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


import { Room, Client, logger } from "@colyseus/core";
import { SlayerRoomState, Advance, Player, Slayer, Blade, Tactician, Gunslinger, Arcanist, InventoryItem } from "../SlayerRoomState";
import { EPlaybooks, ICampaign, IJoinOptions, ISlayer, IBlade, IGunslinger, IArcanist, ITactician } from "../../../common/common";
import { Clint, Ryze, Cervantes, Gene} from "../../../common/examples";
import { EMessageTypes, IBaseMsg, IArrayChangeMsg, ICharacterUpdateMsg, IUpdateNumericalMsg, IJoinResponseMsg } from "../../../common/messageFormat";
import { db } from "../firestoreConnection";

export class SlayerRoom extends Room<SlayerRoomState> {
  maxClients = 4;
  // db: Firestore | undefined;
  state = new SlayerRoomState();
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
    


    

    this.onMessage(EMessageTypes.NumericalUpdate, (client, msg: IUpdateNumericalMsg) => {
      console.log(msg);
      for (const elem of this.state.roster){
        if (elem.id == msg.slayerId){
          if (msg.field == "currentHP"){
            console.log("Dealing damage");
            elem.currentHP = msg.newValue;
          }
        }
      }
    })
    this.onMessage(EMessageTypes.SaveCampaign, (client, msg) => {
      console.log("Saving campaign " + this.campaign.id);
      this.saveCampaign();
    })

    this.onMessage(EMessageTypes.CharacterUpdate, (client, msg: ICharacterUpdateMsg) => {
      const clientPlayer = this.state.playerMap.get(client.sessionId);
      if (clientPlayer) {
        if (clientPlayer.id in this.campaign.gms || this.state.currentAssignments.get(client.sessionId).id == msg.characterId){
          for (const elem of this.state.roster){
            if (elem.id == msg.characterId){
              elem.currentHP = msg.data.currentHP;
            }
          }    
        } else {
          console.log(clientPlayer.displayName + " (" + clientPlayer.id + ") is not authorized to update character " + msg.characterId);
          console.log(JSON.stringify(this.campaign.gms));
          console.log(clientPlayer.id);
        }
      }
    })

    this.onMessage("addDefault", (client, msg) => {
      for (const elem of exampleBand){
        this.state.roster.push(elem);
        // this.campaign.roster.push(elem);
      }  
    })

    this.onMessage(EMessageTypes.ArrayChange, (client, msg: IArrayChangeMsg) => {
      const clientPlayer = this.state.playerMap.get(client.sessionId);
      if (clientPlayer) {
        if (clientPlayer.id in this.campaign.gms || this.state.currentAssignments.get(client.sessionId).id == msg.characterId){
          for (const slayer of this.state.roster){
            if (slayer.id == msg.characterId){
              if (msg.action == "remove" && msg.ix) {
                if (msg.array == "advances"){
                  slayer.advances.splice(msg.ix)
                  console.log("Updated to " + JSON.stringify(slayer.advances));
                } else if (msg.array == "inventory"){
                  slayer.inventory.splice(msg.ix);
                }
              } else if (msg.action == "add" && msg.data){
                if (msg.array == "advances"){
                  const newAdvance = new Advance();
                  newAdvance.name = msg.data.name;
                  newAdvance.desc = msg.data.description
                  slayer.advances.push(newAdvance);
                  console.log("Updated to " + JSON.stringify(slayer.advances));
                } else if (msg.array == "inventory") {
                  const newInvItem = new InventoryItem();
                  newInvItem.name = msg.data.name;
                  newInvItem.desc = msg.data.description
                  slayer.inventory.push(newInvItem);
                }
              }
            }
          }    
        } else {
          console.log(clientPlayer.displayName + " (" + clientPlayer.id + ") is not authorized to update character " + msg.characterId);
          console.log(JSON.stringify(this.campaign.gms));
          console.log(clientPlayer.id);
        }
      }

    })

    // setTimeout(() => {
    //   console.log(this.state.toJSON());
    // }, 5000);
  }

  async onJoin (client: Client, options: IJoinOptions) {
    console.log(client.sessionId, "joined!");

    if (this.state.playerMap.size == 0){
      if (this.campaign.id == "" && options.campaignId != ""){
        console.log("On join, loading campaign " + options.campaignId);
        await this.loadCampaign(options.campaignId);
        // console.log("Onjoin loaded campaign: " + JSON.stringify(this.campaign));
      }
    }

    const player = new Player();
    player.displayName = options.displayName || "U.N. Owen";
    player.id = options.id;
    console.log("Checking for " + player.id + " in " + JSON.stringify(this.campaign.gms));
    const role: "gm" | "player" = this.campaign.gms.includes(player.id) ? "gm" : "player";
    const joinResponseMessage: IJoinResponseMsg = {
      kind: EMessageTypes.JoinResponse,
      role: role
    }
    console.log("Sending join message with role=" + role);
    client.send(EMessageTypes.JoinResponse, joinResponseMessage);
    
    this.state.playerMap.set(client.sessionId, player);
    const ix = Math.floor(Math.random() * this.state.roster.length);
    // console.log(this.state.roster)
    console.log("Assigning " + this.state.roster[ix].name);
    this.state.currentAssignments.set(client.sessionId, this.state.roster[ix]);
    console.log("Added " + client.sessionId)
    console.log("Playermap:")
    this.state.playerMap.forEach((v, k) => {
      console.log(v.displayName);
    } )

    if (this.campaign.gms)
    console.log("==========");

  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    if (this.state.currentAssignments.has(client.sessionId) ){
      console.log("Assignment deleted? " + this.state.currentAssignments.delete(client.sessionId));

    }
    if (this.state.playerMap.has(client.sessionId)){
      console.log("Player deleted? " + this.state.playerMap.delete(client.sessionId));
    }
    console.log("Deleted " + client.sessionId)
    console.log("Playermap:")
    this.state.playerMap.forEach((v, k) => {
      console.log(v.displayName);
    } )
    console.log("==========");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}


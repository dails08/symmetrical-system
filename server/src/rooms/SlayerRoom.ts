import { Room, Client, logger } from "@colyseus/core";
import { SlayerRoomState, Player, Slayer, Blade, Tactician, Gunslinger, Arcanist } from "../SlayerRoomState";
import { EPlaybooks, ICampaign, IJoinOptions, ISlayer, IBlade, IGunslinger, IArcanist, ITactician } from "../../../common/common";
import { Clint, Ryze, Cervantes, Gene} from "../../../common/examples";
import { EMessageTypes, IBaseMsg, ICharacterUpdateMsg, IUpdateNumericalMsg } from "../../../common/messageFormat";
import { db } from "../firestoreConnection";

export class SlayerRoom extends Room<SlayerRoomState> {
  maxClients = 4;
  // db: Firestore | undefined;
  state = new SlayerRoomState();
  campaign: ICampaign | undefined = {
    id: "1234",
    name: "Starter campaign",
    gms: [],
    players: [],
    roster: [],
    kia: [],
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


  loadCampaign(campaignID: string){
    console.log("Loading campaign " + campaignID);
    db.collection("campaigns").doc(campaignID).get().then((campaignRef) => {
      const campaignValue = campaignRef.data();
      if (campaignValue){
        console.log("Found campaign:\n" + campaignRef.data())
        const tempCampaign: ICampaign = campaignValue.data() as ICampaign;
        this.campaign.name = tempCampaign.name;
        this.campaign.id = tempCampaign.id;
        this.campaign.gms = [];
        for (const gm of tempCampaign.gms){
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
          this.state.roster.push(SlayerRoom.schemaFromISlayer(character));
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
    })
      
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
    // const cleanCampaign: ICampaign = 
    db.collection("campaigns").doc(this.campaign.id).set(this.campaign).then((value) => {
      console.log(value);
      console.log("Campaign " + this.campaign.id + " saved");
    })


  }
  


  onCreate (options: any) {
    const ryze = new Arcanist(Ryze);
    const cervantes = new Blade(Cervantes);
    const gene = new Tactician(Gene);
    const clint = new Gunslinger(Clint);

    const exampleBand = [clint, ryze, cervantes, gene];
    for (const elem of exampleBand){
      this.state.roster.push(elem);
    }

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
      this.saveCampaign();
    })

    this.onMessage(EMessageTypes.CharacterUpdate, (client, msg: ICharacterUpdateMsg) => {
      for (const elem of this.state.roster){
        if (elem.id == msg.characterId){
          elem.currentHP = msg.data.currentHP;
        }
      }
    })

    // setTimeout(() => {
    //   console.log(this.state.toJSON());
    // }, 5000);
  }

  onJoin (client: Client, options: IJoinOptions) {
    console.log(client.sessionId, "joined!");

    if (this.state.playerMap.size == 0){
      if (this.campaign.id == "1234" && options.campaignId != ""){
        console.log("On join, loading campaign " + options.campaignId);
        this.loadCampaign(options.campaignId);
      }
    }

    const player = new Player();
    player.name = options.name || "NoName";
    player.displayName = options.displayName || "U.N. Owen";
    
    this.state.playerMap.set(client.sessionId, player);
    const ix = Math.floor(Math.random() * this.state.roster.length);
    console.log("Assigning " + this.state.roster[ix].name);
    this.state.currentAssignments.set(client.sessionId, this.state.roster[ix]);

  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    if (this.state.currentAssignments.has(client.sessionId) ){
      this.state.currentAssignments.delete(client.sessionId);

    }
    if (this.state.playerMap.has(client.sessionId)){
      this.state.playerMap.delete(client.sessionId);
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}


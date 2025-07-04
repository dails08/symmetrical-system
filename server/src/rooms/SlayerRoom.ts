import { Room, Client, logger } from "@colyseus/core";
import { SlayerRoomState, Player, Slayer, Blade, Tactician, Gunslinger, Arcanist } from "../SlayerRoomState";
import { IJoinOptions } from "../../../common/common";
import { Clint, Ryze, Cervantes, Gene} from "../../../common/examples";

export class SlayerRoom extends Room<SlayerRoomState> {
  maxClients = 4;
  state = new SlayerRoomState();
  


  onCreate (options: any) {

    // setTimeout(() => {
    //   this.state.roster.push(schemaFromTemplate(Clint));
    //   setTimeout(() => {
    //     this.state.roster.push(schemaFromTemplate(Ryze));
    //     setTimeout(() => {
    //       this.state.roster.push(schemaFromTemplate(Cervantes));
    //       setTimeout(() => {
    //         this.state.roster.push(schemaFromTemplate(Gene));
    //         setTimeout(() => {}, 1000);
    //       }, 1000);
    //     }, 1000);
    //   }, 1000);
    // }, 5000 )

    // const clint = schemaFromTemplate(Clint);
    // logger.debug(clint);

    const ryze = new Arcanist(Ryze);
    // logger.debug(ryze);

    const cervantes = new Blade(Cervantes);
    // logger.debug(cervantes);

    const gene = new Tactician(Gene);
    // logger.debug(cervantes);
    logger.debug(Clint);

    const clint = new Gunslinger(Clint);
    logger.debug(clint);
    setTimeout(() => { this.state.roster.push(clint)}, 5000);
    setTimeout(() => { if (cervantes) this.state.roster.push(cervantes)}, 6000);
    setTimeout(() => { if (ryze) this.state.roster.push(ryze)}, 7000);  
    setTimeout(() => { if (gene) this.state.roster.push(gene)}, 8000);
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin (client: Client, options: IJoinOptions) {
    console.log(client.sessionId, "joined!");
    const player = new Player();
    player.name = options.name || "UN Owen";
    player.displayName = options.displayName || "NoName";
    this.state.playerMap.set(client.sessionId, player);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}

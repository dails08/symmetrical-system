import { SlayerRoom } from "../rooms/SlayerRoom";
import { Blade, SlayerRoomState } from "../SlayerRoomState";
import { EMessageTypes, IStanceChangeMsg, IWeaponChangeMsg,  } from "../../../common/messageFormat";
import { EPlaybooks } from "../../../common/common";

export function addBladeCallbacks(room: SlayerRoom){
    room.onMessage(EMessageTypes.StanceChange, (client, msg: IStanceChangeMsg) => {
      console.log("Changing stance of " + msg.characterId + " to " + msg.stance);
      const slayer = room.state.roster.find((slayer) => {
        return slayer.id == msg.characterId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Blade){
          if (room.isGM(client) || room.controlsCharacter(client, slayer)){
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

        room.onMessage(EMessageTypes.setWeapon, (client, msg: IWeaponChangeMsg) => {
          console.log("Setting weapon stats:")
          console.log(msg);
          const slayer = room.state.roster.find((slayer) => {
            return slayer.id == msg.slayerId;
          })
          if ( slayer){
            if (slayer.class == EPlaybooks.Blade){
              if (room.isGM(client) || room.controlsCharacter(client, slayer)){
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

        
}
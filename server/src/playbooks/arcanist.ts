import { SlayerRoom } from "../rooms/SlayerRoom";
import { Arcanist, Blade, KnownSpell, SlayerRoomState } from "../SlayerRoomState";
import { EMessageTypes, IAddSpellMsg, IRemoveSpellMsg, ISetEnhancedMsg, ISetFavoredSpell, IStanceChangeMsg, IWeaponChangeMsg,  } from "../../../common/messageFormat";
import { EPlaybooks } from "../../../common/common";

export function addArcanistCallbacks(room: SlayerRoom){
       room.onMessage(EMessageTypes.setEnhanced, (client, msg: ISetEnhancedMsg) => {
         console.log("Setting enhanced:")
         console.log(msg);
         const slayer = room.state.roster.find((slayer) => {
           return slayer.id == msg.slayerId;
         })
         if ( slayer){
           if (slayer.class == EPlaybooks.Arcanist){
             if (room.isGM(client) || room.controlsCharacter(client, slayer)){
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
       room.onMessage(EMessageTypes.addSpell, (client, msg: IAddSpellMsg) => {
         console.log("Adding spell:")
         console.log(msg);
         const slayer = room.state.roster.find((slayer) => {
           return slayer.id == msg.slayerId;
         })
         if ( slayer){
           if (slayer.class == EPlaybooks.Arcanist){
             if (room.isGM(client) || room.controlsCharacter(client, slayer)){
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
       room.onMessage(EMessageTypes.removeSpell, (client, msg: IRemoveSpellMsg) => {
         console.log("Removing spell:")
         console.log(msg);
         const slayer = room.state.roster.find((slayer) => {
           return slayer.id == msg.slayerId;
         })
         if ( slayer){
           if (slayer.class == EPlaybooks.Arcanist){
             if (room.isGM(client) || room.controlsCharacter(client, slayer)){
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
       room.onMessage(EMessageTypes.setFavoredSpell, (client, msg: ISetFavoredSpell) => {
         console.log("Setting favored spell:")
         console.log(msg);
         const slayer = room.state.roster.find((slayer) => {
           return slayer.id == msg.slayerId;
         })
         if ( slayer){
           if (slayer.class == EPlaybooks.Arcanist){
             if (room.isGM(client) || room.controlsCharacter(client, slayer)){
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

        
}
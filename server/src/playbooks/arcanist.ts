import { SlayerRoom } from "../rooms/SlayerRoom";
import { Arcanist, Blade, KnownSpell, SlayerRoomState } from "../SlayerRoomState";
import { EMessageTypes, IAddSpellMsg, ICastSpellMsg, IRemoveSpellMsg, ISetEnhancedMsg, ISetFavoredSpell, IStanceChangeMsg, IWeaponChangeMsg,  } from "../../../common/messageFormat";
import { EPlaybooks } from "../../../common/common";
import { IDiceRoll, IRoll } from "dddice-js";

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
                 range: msg.range,
                 spellId: msg.spellId,
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

       room.onMessage(EMessageTypes.castSpell, (client, msg: ICastSpellMsg) => {
         console.log("Setting favored spell:")
         console.log(msg);
         const slayer = room.getCharacterFromSession(client);
         if ( slayer){
           if (slayer.class == EPlaybooks.Arcanist){
             if (room.isGM(client) || room.controlsCharacter(client, slayer)){
              const classedSlayer = slayer as Arcanist;
              const spellTheme = "neon-ice-ljfnpn6v";
              console.log("Casting " + msg.spell.name + ":" + (msg.boost? "boost" : "unboost") + ":" + (msg.spell.enhanced ? "enhanced" : "not enhanced"));
              
              const toRolls: IDiceRoll[] = [];
              
              // base spellcasting die
              let dieType = 6;
              if (classedSlayer.advances.map((val, ix, arr) => { return val.name.toLowerCase()} ).includes("my final form")){
                dieType = 8;
              };
              toRolls.push({
                type: "d" + dieType,
                theme: spellTheme,
                label: "Cast!"
              });
              classedSlayer.corruption++

              // boost die
              if (msg.boost) {
                let boostDieType = 6;
                if (classedSlayer.advances.map((val, ix, arr) => { return val.name.toLowerCase()} ).includes("boon")){
                  boostDieType = 8;
                };
                toRolls.push({
                  type: "d" + boostDieType,
                  theme: spellTheme,
                  label: "Boost!"
              });
              classedSlayer.corruption++
              };
              room.roll(toRolls, classedSlayer.name, msg.DNA).then(results => {
                const rollResults = results.data as IRoll;
                if (rollResults.values.some((val, ix, arr) => { return val.value >= 4})) {
                  // successful cast
                  console.log("Success!");
                } else {
                  // failed cast
                  console.log("Failure!");
                }
                if (rollResults.values.every((val, ix, arr) => { return val.value < classedSlayer.corruption})){
                  // bane!
                  console.log("Bane!");
                }
              })





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
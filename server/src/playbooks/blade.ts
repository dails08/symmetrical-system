import { SlayerRoom } from "../rooms/SlayerRoom";
import { Blade, SlayerRoomState } from "../SlayerRoomState";
import { EMessageTypes, IBladeAttackMsg, IStanceChangeMsg, IUpdateComboMsg, IWeaponChangeMsg,  } from "../../../common/messageFormat";
import { EPlaybooks, EStances } from "../../../common/common";
import { IDiceRoll } from "dddice-js";

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

    room.onMessage(EMessageTypes.bladeAttack, async (client, msg: IBladeAttackMsg) => {
      console.log(msg);
      const slayer = room.getCharacterFromSession(client);
      if ( slayer){
        if (slayer.class == EPlaybooks.Blade){
          if (room.isGM(client) || room.controlsCharacter(client, slayer)){
            const classedSlayer = slayer as Blade;

            // roll attack dice
              // check for Footing
              let footingIsAvailable = false;
              if (classedSlayer.advances.map((val, ix, arr) => { return val.name.toLowerCase()}).includes("footing")){
                footingIsAvailable = true;
              }
              let shrewdIsAvailable = false;
              if (classedSlayer.advances.map((val, ix, arr) => { return val.name.toLowerCase()}).includes("shrewd")){
                shrewdIsAvailable = true;
              }
              let honedBlade = false;
              if (classedSlayer.advances.map((val, ix, arr) => { return val.name.toLowerCase()}).includes("honed blade")){
                honedBlade = true;
              }
              let killer = false;
              if (classedSlayer.advances.map((val, ix, arr) => { return val.name.toLowerCase()}).includes("killer")){
                killer = true;
              }
              let efficientKiller = false;
              if (classedSlayer.advances.map((val, ix, arr) => { return val.name.toLowerCase()}).includes("efficient")){
                efficientKiller = true;
              }
              let stanceIsSlay = classedSlayer.stance == EStances.Slay;

            let combo = true;
            const finalRollValues = [];
            let totalDamage = 0;
            while (combo) {
              if (shrewdIsAvailable){
                console.log("Shrewding");
              }
              const DNA = shrewdIsAvailable? "A": msg.DNA;
              console.log("DNA: " + DNA);
              shrewdIsAvailable = false;

              // let rollValueNumbers = [];
              const toDiceRolls: IDiceRoll[] = [];
              for (let i = 0; i < classedSlayer.weaponNumber; i++){
                // const rollValueNumber = Math.floor(Math.random() * 6) + 1;
                // rollValueNumbers.push(rollValueNumber);
                toDiceRolls.push({
                  type: "d" + classedSlayer.weaponSides,
                  theme: "rime-of-the-frostmaiden-ljkrrxwr",
                  label: "Combo!",
                  // value: rollValueNumber
                });
              };
  
              const rollResultOne = await room.roll(toDiceRolls, classedSlayer.name, shrewdIsAvailable? "A": msg.DNA);
              console.log(rollResultOne.data.values.map((val, ix, arr) => { return val.value }));
              if (footingIsAvailable){
                for (let i = 0; i < rollResultOne.data.values.length; i++){ 
                  if (footingIsAvailable){ // yes I know I check twice
                    const originalRoll = rollResultOne.data.values[i];
                    if (originalRoll.value == 1){
                      const footingReRoll: IDiceRoll = {
                        type: originalRoll.type,
                        theme: originalRoll.theme
                      };
                      footingIsAvailable = false;
                      const footingReRollResult = await room.roll([footingReRoll], classedSlayer.name, msg.DNA);
                      rollResultOne.data.values[i] = footingReRollResult.data.values[0];
                    }
                  }
                }
              }
              // count hits
              let hitCount = 0;
              for (const rollResult of rollResultOne.data.values){
                finalRollValues.push(rollResult.value);
                if (rollResult.value >= (honedBlade ? 3 : 4)){
                  hitCount++;
                }
              };
              if (hitCount == 0){ // don't count on truthiness
                combo = false;
              }
              // bump combo and damage
              let dmgPerHit = classedSlayer.damage;
              if (stanceIsSlay) {
                dmgPerHit++;
                if (killer){
                  dmgPerHit++;
                }
              }
              if (efficientKiller && DNA == "A"){
                dmgPerHit++;
              }

              console.log("Hitting " + hitCount + " times for " + hitCount * dmgPerHit + " damage!");
              for (let i = 0; i < hitCount; i++){
                const bumpComboMsg: IUpdateComboMsg = {
                  kind: EMessageTypes.updateCombo,
                  target: "combo",
                  action: "inc"
                };
                totalDamage += dmgPerHit;
                room.sendOverlayMessage(bumpComboMsg);
                // for (let j = 0; j < dmgPerHit; j++){
                //   const bumpDamageMsg: IUpdateComboMsg = {
                //     kind: EMessageTypes.updateCombo,
                //     target: "damage",
                //     action: "inc"
                //   };
                //   room.sendOverlayMessage(bumpDamageMsg);  
                // } // end of counting damage
              } // end of counting hits
            } // end of combo
            console.log(finalRollValues);
            console.log(totalDamage);

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
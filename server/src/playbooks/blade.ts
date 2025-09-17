import { SlayerRoom } from "../rooms/SlayerRoom";
import { Blade, SlayerRoomState } from "../SlayerRoomState";
import { EMessageTypes, IBladeAttackMsg, IStanceChangeMsg, IOverlayUpdateComboMsg, IWeaponChangeMsg,  } from "../../../common/messageFormat";
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
              let honedBlade = false;
              if (classedSlayer.advances.some(elem => { return elem.name.toLowerCase() == "honed blade"})){
                honedBlade = true;
              }
              let killer = false;
              if (classedSlayer.advances.some((elem) => { return elem.name.toLowerCase() == "killer"})){
                killer = true;
              }
              let efficient = false;
              if (classedSlayer.advances.some(elem => {return elem.name.toLowerCase() == "efficient"})){
                efficient = true;
              }

              const DNA = classedSlayer.shrewdAvailable? "A": msg.DNA;
              console.log("DNA: " + DNA);
              classedSlayer.shrewdAvailable = false;

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
  
              const rollResultOne = await room.roll(toDiceRolls, classedSlayer.name, DNA);
              console.log(rollResultOne.data.values.map((val, ix, arr) => { return val.value }));
              if (classedSlayer.footingAvailable){
                for (let i = 0; i < rollResultOne.data.values.length; i++){ 
                    const originalRoll = rollResultOne.data.values[i];
                    if (originalRoll.value == 1){
                      const footingReRoll: IDiceRoll = {
                        type: originalRoll.type,
                        theme: originalRoll.theme
                      };
                      classedSlayer.footingAvailable = false;
                      const footingReRollResult = await room.roll([footingReRoll], classedSlayer.name, msg.DNA);
                      rollResultOne.data.values[i] = footingReRollResult.data.values[0];
                    }
                }
              }
              // Set recent rolls to account for rerolls etc
              room.setRecentRolls(rollResultOne.data.values.map((val,ix, arr) => { return {actor: classedSlayer.name, action: "Combo!", value: val.value}}), "set");
              // Bump combo counter
              for (const rollResult of rollResultOne.data.values){
                if (rollResult.value >= (honedBlade ? 3 : 4)){
                  classedSlayer.comboCount += 1;
                  const bumpComboMsg: IOverlayUpdateComboMsg = {
                    kind: EMessageTypes.updateCombo,
                  };
                  room.sendOverlayMessage(bumpComboMsg);
                }
              };
              // Normal damage
              classedSlayer.comboDamage += classedSlayer.damage;
              // Extra damage for slay
              if (classedSlayer.stance == EStances.Slay){
                classedSlayer.comboDamage += 1;
                // Extra damage for slay + killer
                if (killer){
                  classedSlayer.comboDamage += 1;
                }
              };
              // Extra damage for advantage and Efficient
              if (DNA == "A" && efficient){
                classedSlayer.comboDamage += 1;
              }
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
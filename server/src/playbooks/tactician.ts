import { IRoll } from "dddice-js";
import { EPlaybooks } from "../../../common/common";
import { EMessageTypes, IAddPlanMsg, IPlayRollSwapMsg, IRallyMsg, IRemovePlanMsg, IRollPlansMsg, IStabMsg, ISwapRollMsg } from "../../../common/messageFormat";
import { SlayerRoom } from "../rooms/SlayerRoom";
import { SlayerRoomState, Tactician } from "../SlayerRoomState";

export function addTacticianCallbacks(room: SlayerRoom){
    room.onMessage(EMessageTypes.addPlan, (client, msg: IAddPlanMsg) => {
        console.log("Adding plan:")
        console.log(msg);
        const slayer = room.state.roster.find((slayer) => {
            return slayer.id == msg.slayerId;
        })
        if ( slayer){
            if (slayer.class == EPlaybooks.Tactician){
            if (room.isGM(client) || room.controlsCharacter(client, slayer)){
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

    room.onMessage(EMessageTypes.removePlan, (client, msg: IRemovePlanMsg) => {
      console.log("Removing plan:")
      console.log(msg);
      const slayer = room.state.roster.find((slayer) => {
        return slayer.id == msg.slayerId;
      })
      if ( slayer){
        if (slayer.class == EPlaybooks.Tactician){
          if (room.isGM(client) || room.controlsCharacter(client, slayer)){
            const classedSlayer = slayer as Tactician;
            classedSlayer.plans.splice(msg.planIx, 1);
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

    room.onMessage(EMessageTypes.swapRoll, (client, msg: ISwapRollMsg) => {
        const player = room.sessionIdToPlayer(client.sessionId);
        const targetRoll = room.state.recentRolls[msg.rollIx];
        const playSwapMsg: IPlayRollSwapMsg = {
        kind: EMessageTypes.playRollSwap,
        action: targetRoll.rollName,
        actor: targetRoll.actor,
        oldValue: targetRoll.value,
        newValue: msg.planValue
        }
        console.log("Target roll: " + JSON.stringify(room.state.recentRolls[msg.rollIx]));
        if (
        room.isGM(client) ||
        room.state.currentAssignments.get(player.id).class == EPlaybooks.Tactician &&
        (room.state.currentAssignments.get(player.id) as Tactician).plans.includes(msg.planValue)
        ){
        if (room.isGM(client)){
            console.log("Request comes from a GM");
        } else {
            console.log("Request comes from eligible Tactician");
            const tacticianSlayer = (room.state.currentAssignments.get(player.id) as Tactician);
            const planIx = tacticianSlayer.plans.indexOf(msg.planValue);
            tacticianSlayer.plans.splice(planIx, 1);  
        }
        if (msg.action == "swap" || msg.action == "neutral"){
            room.state.recentRolls[msg.rollIx].value = Math.min(6, msg.planValue);
            playSwapMsg.newValue = room.state.recentRolls[msg.rollIx].value;
        } else if (msg.action == "add") {
            room.state.recentRolls[msg.rollIx].value = Math.min(6, (room.state.recentRolls[msg.rollIx].value + msg.planValue));
            playSwapMsg.newValue = room.state.recentRolls[msg.rollIx].value;
        } else if (msg.action == "subtract") {
            room.state.recentRolls[msg.rollIx].value = Math.max(1, (room.state.recentRolls[msg.rollIx].value - msg.planValue));
            playSwapMsg.newValue = room.state.recentRolls[msg.rollIx].value;
        }
        room.sendOverlayMessage(playSwapMsg);
        // console.log(JSON.stringify(this.state.recentRolls));
        } 

    });

    room.onMessage(EMessageTypes.rally, (client, msg: IRallyMsg) => {
      console.log(msg);
      const slayer = room.getCharacterFromSession(client);
      if ( slayer){
        if (slayer.class == EPlaybooks.Tactician){
          const assignedTactician = slayer as Tactician;
          if (room.isGM(client) || room.controlsCharacter(client, slayer)){
            const toRoll = [];

              toRoll.push({
                label: "plan",
                type: "d6",
                theme: "neon-ember-ljgxs7xb"
              })
            room.roll(toRoll, assignedTactician.name, true).then(result => {
              setTimeout(() => {
                const justValues = result.data.values.map((val, ix, arr) => {
                  // return val.value > 6 ? 6 : val.value;
                  return val.value;
                })
                for (const value of justValues.sort()){
                  assignedTactician.plans.push(value);
                }
              }, 3000); // sane guess instead of setting up another message round trip from overlay
            })
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

    room.onMessage(EMessageTypes.shootStab, (client, msg: IStabMsg) => {
      console.log(msg);
      const slayer = room.getCharacterFromSession(client);
      if ( slayer){
        if (slayer.class == EPlaybooks.Tactician){
          const assignedTactician = slayer as Tactician;
          if (room.isGM(client) || room.controlsCharacter(client, slayer)){
            const toRoll = [];

              toRoll.push({
                label: "Shoot/Stab",
                type: "d6",
                theme: "neon-ember-ljgxs7xb"
              })
            room.roll(toRoll, assignedTactician.name).then(result => {

            })
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

    room.onMessage(EMessageTypes.rollPlans, (client, msg: IRollPlansMsg) => {
      console.log(msg);
      const slayer = room.getCharacterFromSession(client);
      if ( slayer){
        if (slayer.class == EPlaybooks.Tactician){
          const assignedTactician = slayer as Tactician;
          if (room.isGM(client) || room.controlsCharacter(client, slayer)){
            const toRoll = [];
            for (let i = 0; i < msg.fours; i++){
              toRoll.push({
                label: "plan",
                type: "d4",
                theme: "neon-ember-ljgxs7xb"
              })
            };
            for (let i = 0; i < msg.sixes; i++){
              toRoll.push({
                label: "plan",
                type: "d6",
                theme: "neon-ember-ljgxs7xb"
              })
            };
            for (let i = 0; i < msg.eights; i++){
              toRoll.push({
                label: "plan",
                type: "d8",
                theme: "neon-ember-ljgxs7xb"
              })
            };
            console.log("Tactician plan dice:");
            console.log(toRoll);
            room.roll(toRoll, assignedTactician.name, true).then(result => {
              setTimeout(() => {
                assignedTactician.plans.clear();
                console.log(result);
                const justValues = result.data.values.map((val, ix, arr) => {
                  return val.value > 6 ? 6 : val.value;
                })
                for (const value of justValues.sort()){
                  assignedTactician.plans.push(value);
                }
              }, 3000); // sane guess instead of setting up another message round trip from overlay
            })
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
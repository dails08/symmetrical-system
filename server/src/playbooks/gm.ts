import { SlayerRoom } from "../rooms/SlayerRoom";
import { Advance, Arcanist, Blade, Gunslinger, InventoryItem, KnownSpell, SlayerRoomState, Tactician } from "../SlayerRoomState";
import { EMessageTypes, IAddSpellMsg, IArrayChangeMsg, IAssignmentMsg, IKillMsg, IPlayAnimationMsg, IPlayerUpdateMsg, IRemoveSpellMsg, IRollMsg, IRosterAddMsg, ISetEnhancedMsg, ISetFavoredSpell, ISetRecentRolls, IStanceChangeMsg, IUpdateNumericalMsg, IWeaponChangeMsg,  } from "../../../common/messageFormat";
import { EPlaybooks, IArcanist, IBlade, IGunslinger, ITactician } from "../../../common/common";

export function addGMCallbacks(room: SlayerRoom){



  room.onMessage(EMessageTypes.SaveCampaign, (client, msg) => {
    console.log("Saving campaign " + room.campaign.id);
    room.saveCampaign();
  })

  room.onMessage(EMessageTypes.Assignment, (client, msg: IAssignmentMsg) => {
    if (room.isGM(client)) {
      if (msg.action == "unassign") {
        console.log("Unassigning " + msg.playerId)
        room.state.currentAssignments.delete(msg.playerId);
      }
      if (msg.action == "assign") {
        console.log("Assigning " + msg.slayerId + " to " + msg.playerId);
        for (const elem of room.state.roster){
          if (elem.id == msg.slayerId) {
            room.state.currentAssignments.set(msg.playerId, elem);
          }
        }
      }
    } else {
      console.log("Unauthorized: Assignment");
    }
  })


  room.onMessage(EMessageTypes.NumericalUpdate, (client, msg: IUpdateNumericalMsg) => {
    console.log(msg);
    for (const elem of room.state.roster){
      if (elem.id == msg.slayerId){
        if (room.isGM(client)){
          if (msg.field == "currentHP"){
            console.log("Setting hp");
            elem.currentHP = msg.newValue;
          }
          if (msg.field == "damage"){
            console.log("Setting damage");
            elem.damage = msg.newValue;
          }
          if (msg.field == "speed"){
            console.log("Setting speed");
            elem.speed = msg.newValue as 4 | 6 | 8 | 10 | 12;
          }
          if (msg.field == "maxHp"){
            console.log("Setting maxHp")
            elem.maxHP = msg.newValue;
          }
          if (["skillsAgile", "skillsBrawn", "skillsDeceive", "skillsHunt", "skillsMend", "skillsNegotiate", "skillsStealth", "skillsStreet", "skillsStudy", "skillsTactics"].includes(msg.field) && [4,6,8,10].includes(msg.newValue)){

            const field = msg.field as "skillsAgile" | "skillsBrawn" | "skillsDeceive" | "skillsHunt" | "skillsMend" | "skillsNegotiate" | "skillsStealth" | "skillsStreet" | "skillsStudy" | "skillsTactics";
            elem[field] = msg.newValue as 4 | 6 | 8 | 10 | 12;
          }
          if (msg.field == "corruption") {
            if (elem.class == EPlaybooks.Arcanist){
              const arcanistElem = elem as Arcanist;
              arcanistElem.corruption = msg.newValue;
            }
          }
        }  
        }
    }
  })

  room.onMessage(EMessageTypes.Kill, (client, msg: IKillMsg) => {
    if (room.isGM(client)){
      console.log("Killing " + msg.characterId);
      const ix = room.state.roster.findIndex((slayer, ix) => {
        return slayer.id == msg.characterId;
      });
      if (ix) {
        room.state.kia.push(room.state.roster.splice(ix, 1)[0]);
      } else {
        console.log("No slayer found with id " + msg.characterId);
      }  
    } else {
      console.log("Not authorized to kill " + msg.characterId);
    }
  })

  room.onMessage(EMessageTypes.RosterAdd, (client, msg: IRosterAddMsg) => {
    if (room.isGM(client)) {
      console.log("Adding to roster " + msg.slayer.name);
      if (msg.slayer.class == EPlaybooks.Blade) {
        room.state.roster.push(new Blade(msg.slayer as IBlade))
      } else if (msg.slayer.class == EPlaybooks.Gunslinger) {
        room.state.roster.push(new Gunslinger(msg.slayer as IGunslinger))
      } else if (msg.slayer.class == EPlaybooks.Arcanist) {
        room.state.roster.push(new Arcanist(msg.slayer as IArcanist))
      } else if (msg.slayer.class == EPlaybooks.Tactician) {
        room.state.roster.push(new Tactician(msg.slayer as ITactician))
      }
    }
  })

  room.onMessage(EMessageTypes.ArrayChange, (client, msg: IArrayChangeMsg) => {
    // const clientPlayer = room.state.playerMap.get(client.sessionId);
    const clientPlayer = room.sessionIdToPlayer(client.sessionId);
    for (const slayer of room.state.roster){
      if (slayer.id == msg.characterId){
        if (clientPlayer && room.isGM(client) || room.controlsCharacter(client, slayer)) {
          if (msg.action == "remove" && "ix" in msg) {
            if (msg.array == "advances"){
              console.log("Removing advance with ix " + msg.ix)
              slayer.advances.splice(msg.ix, 1)
              console.log("Updated avd to " + JSON.stringify(slayer.advances));
            } else if (msg.array == "inventory"){
              console.log("Removing item");
              slayer.inventory.splice(msg.ix, 1);
            }
          } else if (msg.action == "add" && msg.data){
            if (msg.array == "advances"){
              const newAdvance = new Advance();
              newAdvance.name = msg.data.name;
              newAdvance.desc = msg.data.description
              slayer.advances.push(newAdvance);
              console.log("Updated adv  to " + JSON.stringify(slayer.advances));
            } else if (msg.array == "inventory") {
              console.log("Adding item");
              const newInvItem = new InventoryItem();
              newInvItem.name = msg.data.name;
              newInvItem.desc = msg.data.description
              slayer.inventory.push(newInvItem);
            }
          }   
        } else {
        console.log(clientPlayer.displayName + " (" + clientPlayer.id + ") is not authorized to update character " + msg.characterId);
        console.log(JSON.stringify(room.campaign.gms));
        console.log(clientPlayer.id);
        }
      }
    }
  });

  room.onMessage(EMessageTypes.PlayerUpdate, (client, msg: IPlayerUpdateMsg) => {
    if (room.isGM(client)){
      const targetPlayer = room.state.playerMap.get(msg.playerId);
      if (targetPlayer) {
        if (msg.field == "chekhov") {
          targetPlayer.chekhovPoints = Math.max(msg.newValueInt, 0);
        }
      } else {
        console.log("Target player " + msg.playerId + " not found");
      }

    }
  });



  room.onMessage(EMessageTypes.playAnimation, (client, msg: IPlayAnimationMsg) => {
    console.log(msg);
    if (room.isGM(client)){
      for (let overlay of room.overlayClients){
        console.log("Forwarding message to overlay");
        overlay.send(EMessageTypes.playAnimation, msg);
      }
    } else {
      console.log("Not authorized!");
    }
  })

  room.onMessage(EMessageTypes.setRecentRolls, (client, msg: ISetRecentRolls) => {
    if (room.isGM(client)){
      console.log("Setting rolls");
      room.setRecentRolls(msg.rolls, msg.action)
    } else {
      console.log("Only GMs authorized to set rolls externally!");
    }
  })

        
}
import { IDiceRoll, IRoll } from "dddice-js";
import { EPlaybooks, ERunes } from "../../../common/common";
import { EMessageTypes, ILoadedChangeMsg, IPlayGunshotAnimationMsg, IRuneChangeMsg, ISprayLeadMsg } from "../../../common/messageFormat";
import { SlayerRoom } from "../rooms/SlayerRoom";
import { Gunslinger, SlayerRoomState } from "../SlayerRoomState";

export function addGunslingerCallbacks(room: SlayerRoom){

    room.onMessage(EMessageTypes.RuneChange, (client, msg: IRuneChangeMsg) => {
        const slayer = room.state.roster.find((slayer) => {
          return slayer.id == msg.slayerId;
        })
        if ( slayer){
          if (slayer.class == EPlaybooks.Gunslinger){
            if (room.isGM(client) || room.controlsCharacter(client, slayer)){
              const gunslingerSlayer = slayer as Gunslinger;
  
              if (msg.chamber == 1){
                gunslingerSlayer.chamber1Rune = msg.rune
              } else if (msg.chamber == 2){
                gunslingerSlayer.chamber2Rune = msg.rune
              } else if (msg.chamber == 3){
                gunslingerSlayer.chamber3Rune = msg.rune
              } else if (msg.chamber == 4){
                gunslingerSlayer.chamber4Rune = msg.rune
              } else if (msg.chamber == 5){
                gunslingerSlayer.chamber5Rune = msg.rune
              } else if (msg.chamber == 6){
                gunslingerSlayer.chamber6Rune = msg.rune
              }
            } else {
              console.log("Not authorized to!");
            }
          } else {
            console.log("Not a gunslinger!");
          } 
        } else {
          console.log("Slayer not found in roster!");
        }
      })
  
      room.onMessage(EMessageTypes.LoadedChange, (client, msg: ILoadedChangeMsg) => {
        const slayer = room.state.roster.find((slayer) => {
          return slayer.id == msg.slayerId;
        })
        if ( slayer){
          if (slayer.class == EPlaybooks.Gunslinger){
            if (room.isGM(client) || room.controlsCharacter(client, slayer)){
              const gunslingerSlayer = slayer as Gunslinger;
  
              if (msg.chamber == 1){
                gunslingerSlayer.chamber1Loaded = msg.loaded
              } else if (msg.chamber == 2){
                gunslingerSlayer.chamber2Loaded = msg.loaded
              } else if (msg.chamber == 3){
                gunslingerSlayer.chamber3Loaded = msg.loaded
              } else if (msg.chamber == 4){
                gunslingerSlayer.chamber4Loaded = msg.loaded
              } else if (msg.chamber == 5){
                gunslingerSlayer.chamber5Loaded = msg.loaded
              } else if (msg.chamber == 6){
                gunslingerSlayer.chamber6Loaded = msg.loaded
              }
            } else {
              console.log("Not authorized to!");
            }
          } else {
            console.log("Not a gunslinger!");
          } 
        } else {
          console.log("Slayer not found in roster!");
        }
      })

      room.onMessage(EMessageTypes.sprayLead, (client, msg: ISprayLeadMsg) => {
        const assignedSlayer = room.getCharacterFromSession(client);
        if (room.isGM(client) || assignedSlayer.class == EPlaybooks.Gunslinger) {
          
          const runeToTheme = new Map<string, string>();
          runeToTheme.set("hollowpoint", "handa-mists-of-yuggoth");
          runeToTheme.set("blast", "infernal-ly6ghn2k");
          runeToTheme.set("tar", "dark-clouds-lu5mbgi2");
          runeToTheme.set("snare", "dddice-porcelain");
          runeToTheme.set("bleed", "futura-pink-m0wtlr5x");
          runeToTheme.set("seeker", "runeheart-ls6ujsiu");
          runeToTheme.set("none", "wendigo-lw9r7tr1");
  
          const assignedGunslinger = assignedSlayer as Gunslinger;
          const chambers = [
            {rune: assignedGunslinger.chamber1Rune, loaded: assignedGunslinger.chamber1Loaded},
            {rune: assignedGunslinger.chamber2Rune, loaded: assignedGunslinger.chamber2Loaded},
            {rune: assignedGunslinger.chamber3Rune, loaded: assignedGunslinger.chamber3Loaded},
            {rune: assignedGunslinger.chamber4Rune, loaded: assignedGunslinger.chamber4Loaded},
            {rune: assignedGunslinger.chamber5Rune, loaded: assignedGunslinger.chamber5Loaded},
            {rune: assignedGunslinger.chamber6Rune, loaded: assignedGunslinger.chamber6Loaded},
          ]
          
          const toRolls: IDiceRoll[] = [];
          for (const chamberRaw of msg.chambers) {
            const chamber = chamberRaw - 1;
            const chamberIsLoaded = chambers[chamber].loaded;
            const runeValue = chambers[chamber].rune;
            const runeText = runeValue == ERunes.None ? "Bullet" : runeValue; 
            if (chamberIsLoaded){
                if (chamberRaw == 1){
                  assignedGunslinger.chamber1Loaded = false;
                } else if(chamberRaw == 2){
                  assignedGunslinger.chamber2Loaded = false;
                } else if(chamberRaw == 3){
                  assignedGunslinger.chamber3Loaded = false;
                } else if(chamberRaw == 4){
                  assignedGunslinger.chamber4Loaded = false;
                } else if(chamberRaw == 5){
                  assignedGunslinger.chamber5Loaded = false;
                } else if(chamberRaw == 6){
                  assignedGunslinger.chamber6Loaded = false;
                }
                // TODO: Fake Rolls
                toRolls.push({
                  label: runeText,
                  type: "d6",
                  theme: runeToTheme.get(runeText) || "wendigo-lw9r7tr1"
                })
                
                // const rollValue = Math.floor(Math.random() * 6);
                // console.log(runeText + " rolled a " + rollValue);
                // const bulletRoll = new RecentRoll(assignedGunslinger.name, runeText, rollValue);
                // room.state.recentRolls.push(bulletRoll);
            }
            
          }
          room.roll(toRolls, assignedGunslinger.name).then(result => {
            console.log(result);
            const rollData = result.data as IRoll;
            const toShots: {rune: string, hit: boolean}[] = [];
            for (const value of rollData.values){
              toShots.push({
                rune: value.label,
                hit: value.label == "seeker" ? value.value >= 3 : value.value >= 4
              })
            }
            const msg: IPlayGunshotAnimationMsg = {
              kind: EMessageTypes.playGunshotAnimation,
              shots: toShots
            }
            room.sendOverlayMessage(msg);
          }).catch((err) => {
            // console.log
          })
        }
      })
}
import { DiceEvent, ThreeDDice } from "dddice-js";
import { DDDICE_API_KEY, DDDICE_ROOM } from "../creds/creds";


export function initDDDice() {
    console.log(DDDICE_API_KEY);
    console.log(DDDICE_ROOM);
    console.log(document.getElementById("dice") as HTMLCanvasElement);
    const dddice = new ThreeDDice(document.getElementById("dice") as HTMLCanvasElement, DDDICE_API_KEY);
    return dddice.connect(DDDICE_ROOM);
    
}

// const redTheme = dddice.getTheme("Bees");
// console.log(redTheme);
// dddice.loadTheme(redTheme);
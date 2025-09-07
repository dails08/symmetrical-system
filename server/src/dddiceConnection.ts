import { ThreeDDiceAPI , ITheme, IApiResponse, IRoll, IDiceRoll} from "dddice-js";


export async function customRoll(
    // rollName: string, 
    dice: IDiceRoll[],
    actor: string
    ): Promise<IApiResponse<string, IRoll>> {
    // console.log("Building roll");
    const url = new URL(
        "https://dddice.com/api/1.0/roll"
    );
    
    const headers = {
        "Authorization": "Bearer " + process.env.DDDICE_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    // var diceArray = new Array(numDice).fill({"type": diceSides, "theme": themeId});
    var diceArray = dice.map(element => {
        return {
            "type": element.type,
            "theme": element.theme || "wendigo-lw9r7tr1",
            "label": element.label
        }
    });

    let body = {
        "dice": diceArray,
        "room": process.env.DDDICE_ROOM,
        // "label": rollName + ":" + actor
    };
    // console.log(body);
    
    return fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    }).
    then(response => {return response.json() as Promise<IApiResponse<string, IRoll>>}).
    catch((err) => {
        console.log(err);
        return err;
    })
}
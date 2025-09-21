import { Client } from "colyseus.js";
import { Slayer, SlayerRoomState } from "../../server/src/SlayerRoomState";
import { IJoinOptions } from '../../common/common';
import { EMessageTypes, IBaseMsg, IJoinResponseMsg, ISaveCampaignMsg, IUpdateNumericalMsg, ICharacterUpdateMsg, IArrayChangeMsg } from "../../common/messageFormat";


export const client = new Client("https://us-ewr-a693c475.colyseus.cloud");
// export const client = new Client("http://localhost:2567");

export const room = await client.joinOrCreate<SlayerRoomState>("gameplay", {id: "overlay", displayName: "", campaignId: "1234"})
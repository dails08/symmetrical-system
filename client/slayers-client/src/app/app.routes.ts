import { Routes } from '@angular/router';
import { GmScreen } from './gm-screen/gm-screen';
import { CharacterSheet } from './character-sheet/character-sheet';
import { JoinScreen } from './join-screen/join-screen';
import { PlayerScreen } from './player-screen/player-screen';

export const routes: Routes = [
    {
        path: "gm",
        component: GmScreen,
    },
    {
        path: "",
        component: PlayerScreen
    },
];

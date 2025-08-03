import { Routes } from '@angular/router';
import { GmScreen } from './gm-screen/gm-screen';
import { CharacterSheet } from './character-sheet/character-sheet';
import { JoinScreen } from './join-screen/join-screen';

export const routes: Routes = [
    {
        path: "gm",
        component: GmScreen,
    },
    {
        path: "",
        component: CharacterSheet
    },
    {
        path: "**",
        component: JoinScreen
    }
];

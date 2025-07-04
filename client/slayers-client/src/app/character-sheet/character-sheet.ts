import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPlayer, ISlayer, IGunslinger, IBlade, IArcanist, ITactician } from "../../../../../common/common";
import { Cervantes, Clint } from "../../../../../common/examples";
import { ColyseusService } from '../services/colyseusService';
import { Slayer, Blade, Gunslinger, Arcanist, Tactician, KnownSpell, Advance } from '../../../../../server/src/SlayerRoomState';
import { provideRouter } from '@angular/router';
import { CentralService } from '../central-service';

@Component({
  selector: 'app-character-sheet',
  imports: [CommonModule],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss'
})
export class CharacterSheet {

    constructor(
      protected cjs: ColyseusService,
      protected cs: CentralService
    ){
    }


}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTableModule} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { ERunes } from '../../../../../../../common/common';
import { Gunslinger, Player } from '../../../../../../../server/src/SlayerRoomState';
import { ColyseusService } from '../../../services/colyseusService';
@Component({
  selector: 'app-gm-slayer-gunslinger',
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
],
  templateUrl: './gm-slayer-gunslinger.html',
  styleUrl: './gm-slayer-gunslinger.scss'
})
export class GmSlayerGunslinger {

  @Input({required: true}) player!: Player;
  @Input({required: true }) playerIx!: String;
  @Input({ required: true }) slayer!: Gunslinger;

  constructor(
    private cjs: ColyseusService
  ) {

  }

  runes = ERunes;

  setRune(playerId: string, chamber: number, rune: ERunes){
    console.log("Setting chamber " + chamber + " to rune " + rune + " for player " + playerId);
  }
}

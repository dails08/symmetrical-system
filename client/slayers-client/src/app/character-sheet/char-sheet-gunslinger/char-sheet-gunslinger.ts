import { Component, Input } from '@angular/core';
import { Gunslinger  } from '../../../../../../server/src/SlayerRoomState';
import { ColyseusService } from '../../services/colyseusService';
import { ERunes } from '../../../../../../common/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-char-sheet-gunslinger',
  imports: [
    CommonModule,
    DragDropModule
  ],
  templateUrl: './char-sheet-gunslinger.html',
  styleUrl: './char-sheet-gunslinger.scss'
})
export class CharSheetGunslinger {

  @Input({required: true}) slayer!: Gunslinger

  ERunes = ERunes;

  stagedRounds: {
    chamber: number,
    rune: ERunes
  }[] = [];

  stateReloading: boolean = false;

  constructor(
      private cjs: ColyseusService
    ){
      

     
      
    }

}

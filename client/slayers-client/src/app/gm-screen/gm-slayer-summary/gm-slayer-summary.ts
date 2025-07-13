import { Component, Input } from '@angular/core';
import { Player, Slayer } from '../../../../../../server/src/SlayerRoomState';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gm-slayer-summary',
  imports: [CommonModule],
  templateUrl: './gm-slayer-summary.html',
  styleUrl: './gm-slayer-summary.scss'
})
export class GmSlayerSummary {

  @Input({required: true}) player!: Player;
  @Input() slayer: Slayer | undefined;

  constructor() {

  }

  alterChekhovPoints(delta: number) {
    console.log("Altering chekhov by " + delta);
  }

}

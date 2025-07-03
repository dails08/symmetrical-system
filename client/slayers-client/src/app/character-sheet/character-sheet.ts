import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPlayer, ISlayer, IGunslinger, IBlade, IArcanist, ITactician } from "../../../../../common/common";
import { Clint } from "../../../../../common/examples";

@Component({
  selector: 'app-character-sheet',
  imports: [CommonModule],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss'
})
export class CharacterSheet {

    constructor(){
      this.slayer = Clint;

    }

    @Input() player: IPlayer | undefined;

    slayer: ISlayer | undefined;
}

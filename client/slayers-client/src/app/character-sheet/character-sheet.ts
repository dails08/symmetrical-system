import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPlayer, ISlayer, IGunslinger, IBlade, IArcanist, ITactician } from "../../../../../common/common";
import { Cervantes, Clint } from "../../../../../common/examples";
import { ColyseusService } from '../services/colyseusService';
import { Slayer, Blade, Gunslinger, Arcanist, Tactician, KnownSpell, Advance } from '../../../../../server/src/SlayerRoomState';

@Component({
  selector: 'app-character-sheet',
  imports: [CommonModule],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss'
})
export class CharacterSheet {

    constructor(
      protected cjs: ColyseusService
    ){
      // this.slayer = schemaFromTemplate(Clint);
      this.slayer = new Arcanist();
      console.log(Clint)
      console.log(this.slayer);
      console.log(this.slayer.advances.toArray());


      cjs.getRosterChange().subscribe((newSlayer) => {
        console.log("Roster update");
        console.log(newSlayer);
        this.slayer = newSlayer;
      })
      // if (colysues.$){
      //   colysues.$!(colysues.room!.state).roster.onAdd((newSlayer, ix) => {
      //     console.log("New slayer!");
      //     console.log(newSlayer);
      //     this.slayer = newSlayer;

      //   }) 

      // } else {
      //   console.log("Colyseus is undefined");
      // }

    }

    @Input() player: IPlayer | undefined;

    slayer: Slayer | undefined;
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {animate} from "animejs";
import { ColyseusService } from '../services/colyseusService';
import { CentralService } from '../services/central-service';


@Component({
  selector: 'app-character-sheet',
  imports: [CommonModule],
  templateUrl: './character-sheet.html',
  styleUrl: './character-sheet.scss'
})
export class CharacterSheet {


  constructor(
    cjs: ColyseusService,
    cs: CentralService
  ) {

  }

damage(e) {
  console.log("Damage");
  var hp -= 1;
  animate(".barcontent", {
    flex: hp/5,
    duration: 1000
  });
  console.log(hp);
};

}

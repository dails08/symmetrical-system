import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IPlayer } from '../../../../common/common';
// import { Chris } from '../../../../common/examples';
import { Study } from './study/study';
import { CharacterSheet } from './character-sheet/character-sheet';
import { ColyseusService } from './services/colyseusService';
import { CentralService } from './services/central-service';
import { Player } from '../../../../server/src/SlayerRoomState';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'slayers-client';

  constructor(
    public cjs: ColyseusService,
    public cs: CentralService
  ){
    // this.cs.player = new Player();
    // Object.assign(this.cs.player, Chris);
  }

}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IPlayer } from '../../../../common/common';
import { Chris } from '../../../../common/examples';
import { Study } from './study/study';
import { CharacterSheet } from './character-sheet/character-sheet';
import { ColyseusService } from './services/colyseusService';
import { CentralService } from './services/central-service';

@Component({
  selector: 'app-root',
  imports: [ CharacterSheet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'slayers-client';

  constructor(
    public colyseus: ColyseusService,
    public centralService: CentralService
  ){
    this.centralService.player = Chris;
  }

}

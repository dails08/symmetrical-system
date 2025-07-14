import { Component } from '@angular/core';
import { ColyseusService } from '../services/colyseusService';

@Component({
  selector: 'app-join-screen',
  imports: [],
  templateUrl: './join-screen.html',
  styleUrl: './join-screen.scss'
})
export class JoinScreen {

  constructor(
    protected cjs: ColyseusService
  ) {

  }

  async join(displayName: string, playerId: string, campaignId: string){
    await this.cjs.joinRoom({id: playerId, displayName: displayName, campaignId: campaignId});
  }
}

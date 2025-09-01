import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate } from 'animejs';
import { Arcanist, KnownSpell } from '../../../../../../server/src/SlayerRoomState';
import { CentralService } from '../../services/central-service';
import { ColyseusService } from '../../services/colyseusService';
import { getStateCallbacks } from 'colyseus.js';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { TitleCasePipe, NgClass } from '@angular/common';
import { EMessageTypes, ICastSpellMsg, ISetFavoredSpell } from '../../../../../../common/messageFormat';
import { CdkDropList } from "@angular/cdk/drag-drop";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule, MatButtonToggle } from '@angular/material/button-toggle';

@Component({
  selector: 'app-char-sheet-arcanist',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatSelectModule,
    DragDropModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatButtonToggleModule
  ],
  templateUrl: './char-sheet-arcanist.html',
  styleUrl: './char-sheet-arcanist.scss'
})
export class CharSheetArcanist {

  @Input({required: true}) slayer!: Arcanist;

  @ViewChild("favoredSpellSelect") favoredSpellSelect!: MatSelect;
  fresh = true;
  favoredSpellSpellId: string | undefined;
  favoredSpellName: string | undefined;

  spellIconURLBase = "icons/spells/";

  constructor(
    protected cs: CentralService,
    protected cjs: ColyseusService
  ){

  }

  updateFavoredSpell(selection: KnownSpell){
    this.favoredSpellSpellId = selection.spellId;
    const msg: ISetFavoredSpell = {
      kind: EMessageTypes.setFavoredSpell,
      favoredSpell: selection.name,
      slayerId: this.slayer.id
    };
    this.cjs.sendMessage(msg);
  }


  animateCorruptionChange() {
    if (this.slayer){
      console.log("Actual animation");

      animate(".corruption-healthbar-barcontent", {
        right: 100 * (1 - this.slayer.corruption/6) + '%',
        duration: 1000
        }
      );
      this.fresh = false;

    }

  }

  castSpell(spell: KnownSpell, boost: boolean, DNA: MatButtonToggle | MatButtonToggle[]){
    const singleDNA = DNA as MatButtonToggle;
    const msg: ICastSpellMsg = {
      kind: EMessageTypes.castSpell,
      spell: spell,
      boost: boost,
      DNA: singleDNA.value || "N"
    };
    this.cjs.sendMessage(msg);

  }
  ngAfterViewInit(): void {
    const room = this.cjs.room.then((room) => {
      const $ = getStateCallbacks(room);
      console.log("Adding listeners")
      // Add listeners
      $(this.slayer).listen("corruption", (newValue, previousValue) => {
        console.log("Correcting corruption: " + this.slayer.corruption + "/6");
        // this.cs.slayer!.currentHP = newValue;
        // console.log("Damage: " + this.cs.slayer!.currentHP);

        if (this.fresh){
          setTimeout(()=> {
            this.animateCorruptionChange();
          }, 100);
        } else {
          this.animateCorruptionChange();
        }
      })
    });
    this.cjs.getAssignmentChange().subscribe(([newSlayer]) => {
      const room = this.cjs.room.then((room) => {
        const $ = getStateCallbacks(room);
        console.log("Adding listeners")
        // Add listeners
        $(this.slayer).listen("corruption", (newValue, previousValue) => {
          console.log("Correcting corruption: " + this.slayer.corruption + "/6");
          // this.cs.slayer!.currentHP = newValue;
          // console.log("Damage: " + this.cs.slayer!.currentHP);

          if (this.fresh){
            setTimeout(()=> {
              this.animateCorruptionChange();
            }, 100);
          } else {
            this.animateCorruptionChange();
          }
        });

        $(this.slayer).listen("favoredSpell", (newValue, previousValue) => {
          this.slayer.favoredSpell = newValue;
        });
      });
    });
  }
}

import { Component, Input } from '@angular/core';
import { injectTippyRef } from '@ngneat/helipopper';

@Component({
  selector: 'app-roller',
  imports: [],
  templateUrl: './roller.html',
  styleUrl: './roller.scss'
})
export class Roller {
  tippy = injectTippyRef();
  @Input() name!: string;
  kind!: "d" | "n" | "a";
  @Input() size!: number;

  constructor(){
    const {
      name = "Null",
      kind = "n",
      size = 4
    } = this.tippy.data ?? {};
    console.log(this.tippy.data ?? "No data");
  }

  sendRoll(kind: string){
    console.log("Rolling " + kind);
  }

}

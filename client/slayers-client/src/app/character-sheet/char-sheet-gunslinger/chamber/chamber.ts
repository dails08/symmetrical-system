import { Component, Input } from '@angular/core';
import { ERunes } from '../../../../../../../common/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chamber',
  imports: [CommonModule],
  templateUrl: './chamber.html',
  styleUrl: './chamber.scss'
})
export class Chamber {

  @Input({required: true})
  rune!: ERunes;
  
  @Input({required: true})
  loaded!: boolean;

  unstaged = true;

  ERunes = ERunes;

}

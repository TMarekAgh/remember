import { animate, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { fadeInOut } from '../../animations/fade';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.sass'],
  animations: [
    trigger('fadeInOut', [
      transition('void => *', [
        style({ opacity: '0' }),
        animate('0.25s ease-out', style({ opacity: '1' }))
      ]),
      transition('* => void', [
        animate('0.25s ease-out', style({ opacity: '0' }))
      ])
    ])
  ]
})
export class LoaderComponent implements OnInit {

  @Input() visible = true;
  @Input() fixed = false;
  @Input() background = false;

  constructor() {}

  ngOnInit(): void {}

}

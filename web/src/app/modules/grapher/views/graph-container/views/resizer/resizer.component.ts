import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NodeService } from 'src/app/modules/grapher/services/node.service';

@Component({
  selector: 'app-resizer',
  templateUrl: './resizer.component.html',
  styleUrls: ['./resizer.component.sass']
})
export class ResizerComponent implements OnInit {

  _direction: ResizerDirection = ResizerDirection.Both;

  ResizerPosition = ResizerPosition;

  left: boolean = false;
  right: boolean = false;
  toggle: boolean = false;
  dragging: boolean = false;

  dragViewData: any;
  dragData: any;

  @Output() onStepChange = new EventEmitter();
  @Output() onResizerDrag = new EventEmitter();

  @ViewChild('resizer') resizer: any;

  @Input() set direction(val: ResizerDirection) {
    this._direction = val;

    if(this._direction == ResizerDirection.Both) {
      this.left = true;
      this.right = true;
    } else if(this._direction == ResizerDirection.Left) {
      this.left = true;
    } else if(this._direction == ResizerDirection.Right) {
      this.right = true;
    }

    this.toggle = this._direction == ResizerDirection.Left || this._direction == ResizerDirection.Right;
  };

  @Input() position!: ResizerPosition;

  @Input() steps: number = 2;

  @Input() initialStep: number = 1;

  currentStep!: number;

  constructor(private nodeService: NodeService) {}

  ngOnInit(): void {
    this.currentStep = this.initialStep;
  }

  toggleStep() {
    if(this.currentStep == this.steps) this.currentStep -= 1;
    else this.currentStep += 1;
    this.onStepChange.emit(this.currentStep);
  }

  mouseDown(ev: MouseEvent) {
    this.startDrag(ev);
  }

  mouseMove(ev: MouseEvent) {
    this.moveDrag(ev);
  }

  mouseUp(ev: MouseEvent) {
    this.endDrag(ev);
  }

  startDrag(ev: MouseEvent) {
    this.dragging = true;

    window.onmousemove = this.moveDrag.bind(this);
    window.onmouseup = this.endDrag.bind(this);

    this.nodeService.state.mouseEventActive = true;
    this.onResizerDrag.emit(ev);
  }

  moveDrag(ev: MouseEvent) {
    if(!this.dragging) return;

    this.onResizerDrag.emit(ev);
  }

  endDrag(ev: MouseEvent) {
    this.dragging = false;

    this.onResizerDrag.emit(ev);

    window.onmousemove = null;
    window.onmouseup = null;
    this.nodeService.state.mouseEventActive = false;
  }
}

export enum ResizerDirection {
  Left,
  Right,
  Both
}

export enum ResizerPosition {
  Top,
  Left,
  Right,
  Bottom
}

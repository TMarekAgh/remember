import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NodeService } from '../../services/node.service';
import { ResizerDirection, ResizerPosition } from './views/resizer/resizer.component';

@Component({
  selector: 'app-graph-container',
  templateUrl: './graph-container.component.html',
  styleUrls: ['./graph-container.component.sass'],
  animations: [
    trigger('foldInOutHorizontal', [
      transition('void => *', [
        style({ width: '0', overflow: 'hidden'}),
        animate('0.5s ease-out', style({
          width: '*',
          overflow: '*'
        }))
      ]),
      transition('* => void', [
        style({ overflow: 'hidden' }),
        animate('0.5s ease-out', style({
          width: '0'
        }))
      ])
    ]),
    trigger('blockChildren', [
      transition(':enter', [])
    ])
  ]
})
export class GraphContainerComponent implements OnInit, OnDestroy {

  constructor(
    public readonly nodeService: NodeService,
    private route: ActivatedRoute
  ) {}

  nodeId: string | null = null;
  sub!: Subscription;

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.nodeId = params['id'];
      this.nodeService.state.init(this.nodeId);
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  nodeMenuExtended = true;
  nodeContentExtended = true;

  menuWidth = 350;
  contentWidth = 350;

  ResizerDirection = ResizerDirection;
  ResizerPosition = ResizerPosition;

  onMenuResizerChange(step: number) {
    this.nodeMenuExtended = step == 2;
  }

  onContentResizerChange(step: number) {
    this.nodeContentExtended = step == 2;
  }

  onContentResizerDrag(ev: MouseEvent) {
    const totalWidth = window.innerWidth;

    let left = ev.screenX;

    if(left < this.menuWidth + 100) {
      left = this.menuWidth + 100;
    }

    this.contentWidth = totalWidth - left;
  }

  onMenuResizerDrag(ev: MouseEvent) {
    const totalWidth = window.innerWidth;

    let left = ev.screenX;

    if(left > (totalWidth - this.contentWidth - 100)) {
      left = totalWidth - this.contentWidth - 100;
    }

    this.menuWidth = left;
  }
}

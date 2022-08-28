import { animate, group, query, sequence, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { NodeType } from '@nihil/remember-common';
import { filter } from 'rxjs';
import { NodeAction } from 'src/app/modules/grapher/enums/node-action.enum';
import { NodeService } from 'src/app/modules/grapher/services/node.service';
import { Node } from '../../../../models/node';

@Component({
  selector: 'app-node-view',
  templateUrl: './node-view.component.html',
  styleUrls: ['./node-view.component.sass'],
  animations: [
    trigger('switchFade', [
      transition('* => *', [
        animate('0.5s ease-out', style({
          opacity: '0'
        })),
        animate('0.5s ease-out', style({
          opacity: '1'
        }))
      ])
    ]),
    trigger('fadeInOut', [
      transition('* => void', [
        style({ 'opacity': '1' }),
        animate('0.5s ease-out', style({
          opacity: '0'
        }))
      ]),
      transition('void => *', [
        sequence([
          style({ opacity: '1', height: '0', overflow: 'hidden'}),
          animate('0.5s', style({ opacity: '0' })),
          style({ height: '*', overflow: 'visible' }),
          animate('0.5s ease-out', style({
            opacity: '0'
          }))
        ])
      ])
    ]),
    trigger('fadeInOutSwap', [
      transition('* => *', [
        group([
          query(':enter', [
            style({ opacity: '0', height: '0', overflow: 'hidden' }),
            animate('0.5s', style({ opacity: '0' })),
            style({ opacity: '0', height: '*', overflow: 'visible' }),
            animate('0.5s ease-out', style({
              opacity: '1'
            }))
          ]),
          query(':leave', [
            animate('0.5s ease-out', style({
              opacity: '0'
            }))
          ])
        ])
      ]),
    ]),
  ]
})
export class NodeViewComponent implements OnInit {

  _node!: Node;
  nodeChanged!: Node;
  view!: any;
  viewNode!: Node;
  loading: boolean = true;

  @Input() set node(val: Node) {
    if(!val || this._node == val) return;

    // this.nodeChanged = val;
    this.loading = true;

    setTimeout(() => {
      // this.view = null;

      this._node = val;
      this.loadView(this._node);
    }, 1000)
  }

  @Input() set hasView(val: boolean) {
    if(val) {
      // this.view = null;
      this.loading = true;

      this.loadView(this._node);
    } else {
      this.view = null;
    }
  }

  get node() {
    return this._node;
  }
  onViewChanged: any;

  constructor(
    public nodeService: NodeService
  ) {
    this.onViewChanged = this.nodeService.onAction.pipe(
      filter(x => x.action == NodeAction.ViewEdited && x.context.id == this._node.id))

    this.onViewChanged.subscribe((_: any) => {
      this.loadView(this._node);
    })
  }

  ngOnInit(): void {}

  checkViewExists() {
    return this._node.children?.find(x => x.type == NodeType.View);
  }

  async loadView(node: Node) {
    try {
      const view = await this.nodeService.getView(node.id);

      if(!view) {
        this.view = null;
        this.loading = false;
        return;
      }

      this.node.hasView = true;
      this.viewNode = view;
      this.view = view;
      setTimeout(() => this.loading = false, 0);
    } catch(ex) {
      setTimeout(() => this.loading = false, 0);
    }
  }

  async downloadView() {
    if(!this.view) return;

    const link = document.createElement('a')
    const url = URL.createObjectURL(this.view);

    link.href = url;
    link.download = `${this.node.name}_View`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

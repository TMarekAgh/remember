import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { NodeType } from '@nihil/remember-common';
import { NodeAction } from 'src/app/modules/grapher/enums/node-action.enum';
import { Node } from '../../../../models/node';

@Component({
  selector: 'app-graph-viewer-node',
  templateUrl: './graph-viewer-node.component.html',
  styleUrls: ['./graph-viewer-node.component.sass']
})
export class GraphViewerNodeComponent implements OnInit {

  @Input() item: Node & any;
  @Input() left!: number;
  @Input() top!: number;
  @Input() width!: number;
  @Input() height!: number;
  @Input() zoom!: number;
  @Input() active!: boolean;
  @Input() actions = true;
  @Input() filter = false;
  @Input() noTransition!: boolean;
  @Input() positionTransition!: boolean;

  @Output() nodeAction = new EventEmitter<{ action: NodeAction, value: string }>();

  _showActions = false;

  @ContentChild('customContent') customContent!: TemplateRef<any>

  onNodeClick(ev: any) {}

  constructor() { }

  ngOnInit(): void {}

  showActions(ev: any) {
    this._showActions = true;
    ev.preventDefault();
  }

  hideActions() {
    this._showActions = false;
  }

  nodeTypeIconMap: { [key: string | number]: string } = {
    [NodeType.Container]: 'folder',
    [NodeType.File]: 'article',
    [NodeType.Root]: 'home',
    [NodeType.View]: 'panorama'
  }

  NodeAction = NodeAction;

  actionClick(ev: any, action: NodeAction) {
    this.nodeAction.emit({ action, value: this.item.id });
    ev.stopPropagation();
  }
}

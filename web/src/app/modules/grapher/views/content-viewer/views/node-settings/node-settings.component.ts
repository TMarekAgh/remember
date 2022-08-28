import { Component, Input, OnInit } from '@angular/core';
import { NodeAction } from 'src/app/modules/grapher/enums/node-action.enum';
import { NodeService } from 'src/app/modules/grapher/services/node.service';

@Component({
  selector: 'app-node-settings',
  templateUrl: './node-settings.component.html',
  styleUrls: ['./node-settings.component.sass']
})
export class NodeSettingsComponent implements OnInit {

  constructor(private nodeService: NodeService) { }

  ngOnInit(): void {}

  @Input() _node: Node | null = null;

  async editNode() {
    this.nodeService.action({
      value: this._node,
      action: NodeAction.OpenEditNode,
      context: null as any
    })
  }

  async deleteNode() {
    this.nodeService.action({
      value: this._node,
      action: NodeAction.OpenDeleteNode,
      context: null as any
    })
  }
}

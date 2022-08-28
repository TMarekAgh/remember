import { Component, OnInit } from '@angular/core';
import { NodeAction } from 'src/app/modules/grapher/enums/node-action.enum';
import { NodeService } from 'src/app/modules/grapher/services/node.service';

@Component({
  selector: 'app-graph-menu-tools',
  templateUrl: './graph-menu-tools.component.html',
  styleUrls: ['./graph-menu-tools.component.sass']
})
export class GraphMenuToolsComponent implements OnInit {

  constructor(
    public nodeService: NodeService
  ) { }

  ngOnInit(): void {}

  addNode() {
    this.nodeService.action({
      action: NodeAction.OpenAddNode,
      value: null,
      context: null as any
    })
  }

  deleteNode() {
    this.nodeService.action({
      action: NodeAction.OpenDeleteNode,
      value: null,
      context: null as any
    })
  }

  editNode() {
    this.nodeService.action({
      action: NodeAction.OpenEditNode,
      value: null,
      context: null as any
    })
  }
}

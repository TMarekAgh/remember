import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NodeEvent } from 'src/app/modules/grapher/classes/viewer-state';
import { Action } from 'src/app/modules/grapher/enums/action.enum';
import { NodeAction } from 'src/app/modules/grapher/enums/node-action.enum';
import { NodeService } from 'src/app/modules/grapher/services/node.service';
import { Node } from '../../../../models/node';

@Component({
  selector: 'app-graph-menu-tree',
  templateUrl: './graph-menu-tree.component.html',
  styleUrls: ['./graph-menu-tree.component.sass']
})
export class GraphMenuTreeComponent implements OnInit {

  constructor(
    public readonly nodeService: NodeService
  ) { }

  @Input() node!: Node;
  @Input() activeNode!: Node;

  @Output() onItemClicked = new EventEmitter();
  @Output() onAction = new EventEmitter<NodeEvent>();

  Section = Section;
  Action = Action;

  ngOnInit(): void {}

  itemClicked(item: Node) {
    this.onItemClicked.emit(item);
  }

  actionClick(ev: any, section: Section, action: Action, value: any) {
    ev.stopPropagation();

    const nodeAction = actionMapping[section][action];

    this.nodeService.action({
      ...nodeAction,
      context: this.node,
      value: [value]
    })
  }
}

enum Section {
  Children,
  Parents,
  Links
}

const actionMapping: { [section: number]: { [action: number]: any }} = {
  [Section.Children]: {
    [Action.Add]: { action: NodeAction.OpenAddChildren },
    [Action.Delete]: { action: NodeAction.RemoveChildren },
    [Action.Edit]: { action: NodeAction.OpenEditChildren }
  },
  [Section.Parents]: {
    [Action.Add]: { action: NodeAction.OpenAddParents },
    [Action.Delete]: { action: NodeAction.RemoveParents },
    [Action.Edit]: { action: NodeAction.OpenEditParents }
  },
  [Section.Links]: {
    [Action.Add]: { action: NodeAction.OpenAddLinks },
    [Action.Delete]: { action: NodeAction.RemoveLinks },
    [Action.Edit]: { action: NodeAction.OpenEditLinks }
  }
}


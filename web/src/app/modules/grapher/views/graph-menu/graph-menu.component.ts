import { animate, sequence, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action } from 'rxjs/internal/scheduler/Action';
import { NodeAction } from '../../enums/node-action.enum';
import { Node } from '../../models/node';

@Component({
  selector: 'app-graph-menu',
  templateUrl: './graph-menu.component.html',
  styleUrls: ['./graph-menu.component.sass'],
  animations: [
    trigger('fadeInOut', [
      transition('void => *', [
        sequence([
          style({ opacity: '0', height: '0', overflow: 'hidden' }),
          animate('0.5s', style({ opacity: '0' })),
          style({ opacity: '0', height: '*', overflow: 'visible' }),
          animate('0.5s ease-out', style({
            opacity: '1'
          }))
        ])
      ]),
      transition('* => void', [
        animate('0.5s ease-out', style({
          opacity: '0'
        }))
      ]),
    ]),
  ]
})
export class GraphMenuComponent implements OnInit {

  constructor() { }

  Section = Section;

  _node!: Node;
  @Input() activeNode!: Node;

  currentSection: Section = Section.Tree;

  @Input() public set node(val: Node) {
    if(!val) return;
    this._node = val;
  }

  get node() {
    return this._node;
  }

  @Output() onNavigateToNode = new EventEmitter();

  ngOnInit(): void {}

  toggleSection(section: Section) {
    if(this.currentSection == section) return;

    this.currentSection = section;
  }

  navigateToNode(node: Node) {
    this.onNavigateToNode.emit(node);
  }

  onNodeAction(nodeAction: { action: NodeAction, context: Node, value: any }) {

  }

}

enum Section {
  Tree,
  Search,
  Tools,
  Tags,
  Users
}

import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FilterOperation, NodeProjection } from '@nihil/remember-common';
import { User } from 'src/app/modules/auth/models/user.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { NodeAction } from 'src/app/modules/grapher/enums/node-action.enum';
import { NodeService } from 'src/app/modules/grapher/services/node.service';
import { Tag, TagService } from 'src/app/modules/grapher/services/tag.service';
import { UserService } from 'src/app/modules/user/services/user.service';
import { MinifiedNode, Node } from './../../../../models/node';

@Component({
  selector: 'app-graph-menu-search',
  templateUrl: './graph-menu-search.component.html',
  styleUrls: ['./graph-menu-search.component.sass'],
  animations: [
    trigger('foldInOutVertical', [
      transition('void => *', [
        style({ height: '0', overflow: 'hidden', paddingTop: '0', paddingBottom: '0' }),
        animate('0.5s ease-out', style({
          height: '*',
          paddingTop: '*',
          paddingBottom: '*'
        })),
        style({ 'overflow': '*' })
      ]),
      transition('* => void', [
        style({ overflow: 'hidden' }),
        animate('0.5s ease-out', style({
          height: '0',
          paddingTop: '0',
          paddingBottom: '0',
        }))
      ])
    ])
  ]
})
export class GraphMenuSearchComponent implements OnInit {

  constructor(
    public nodeService: NodeService,
    public userService: UserService,
    public authService: AuthService,
    public tagService: TagService
  ) { }

  async ngOnInit(): Promise<void> {
    this.getUsers();
    this.getTags();
    this.filters.user = (await this.userService.getCurrentUser()).id;
  }

  @Output() onAction = new EventEmitter();

  searchExpanded = true;
  searchedNodes: MinifiedNode[] | null = null;

  filters = {
    name: '',
    description: '',
    type: '',
    user: this.userService.currentUser?.id ?? '',
    tag: '',
  }

  users: User[] = [];
  tags: Tag[] = [];

  NodeAction = NodeAction;

  async search() {
    const { name, description, type, user, tag } = this.filters;

    const data: any = {
      getAdjacent: false,
      project: NodeProjection.Minified
    };

    if(!!name) data.name = {
      value: name,
      operation: FilterOperation.Contains
    };

    if(!!description) data.description = {
      value: description,
      operation: FilterOperation.Contains
    };

    if(!!type) data.type = {
      value: +type,
      operation: FilterOperation.Equals
    };

    if(!!user) data.creator = {
      value: user,
      operation: FilterOperation.Equals
    }

    if(!!tag) data.tags = {
      value: tag,
      operation: 4 //FilterOperation.Includes
    }

    const result = await this.nodeService.filter(data);

    if(!result) return;

    this.searchedNodes = result.map(x => Node.fromApiNode(x, NodeProjection.Minified) as MinifiedNode);
  }

  action(ev: any, action: NodeAction, value: MinifiedNode) {
    ev.stopPropagation();

    this.nodeService.action(actionMap[action](value))
  }

  clearFilters() {
    this.filters = {
      name: '',
      description: '',
      type: '',
      user: this.filters.user,
      tag: ''
    }

    this.searchedNodes = null;
  }

  toggleSearchExpanded() {
    this.searchExpanded = !this.searchExpanded;
  }

  async getUsers() {
    const associatedUsers = await this.userService.getAssociated();
    const currentUser = await this.userService.getCurrentUser();

    this.users = [{ _id: currentUser.id, displayName: 'Me' }, ...associatedUsers];
  }

  async getTags() {
    const tags = await this.tagService.getCurrentUserTags();

    this.tags = tags;
  }
}

const actionMap: { [action: number]: any } = {
  [NodeAction.Navigate]: (value: MinifiedNode) => ({
    action: NodeAction.Navigate,
    value: value.id
  }),
  [NodeAction.Preview]: (value: MinifiedNode) => ({
    action: NodeAction.Preview,
    value: value.id
  })
}

import { animate, sequence, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/modules/auth/models/user.model';
import { nodeContentTypeMap, nodeTypeMap } from 'src/app/modules/grapher/classes/navigator';
import { Node } from 'src/app/modules/grapher/models/node';
import { Tag, TagService } from 'src/app/modules/grapher/services/tag.service';
import { UserService } from 'src/app/modules/user/services/user.service';

@Component({
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.sass'],
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
        animate('0.5s ease-out', style({
          opacity: '1'
        }))
      ]),
      transition('void => *', [
        sequence([
          style({ opacity: '0'}),
          animate('0.5s', style({ opacity: '0' })),
          animate('0.5s ease-out', style({
            opacity: '1'
          }))
        ])
      ])
    ])
  ]
})
export class NodeInfoComponent implements OnInit {

  _node!: Node;
  nodeChanged!: Node;

  constructor(
    private tagService: TagService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  tags: Tag[] = [];
  allowedUsers: User[] = []

  @Input() set node(val: Node) {
    this.nodeChanged = val;
    setTimeout(() => {
      this._node = val;
      this.getTags();
      this.getPermissions();
    }, 500)
  };

  get node() {
    return this._node
  }

  async getTags() {
    const tags = await this.tagService.getTags(this._node.tagIds);
    this.tags = tags;
  }

  async getPermissions() {
    const associatedUsers: User[] = await this.userService.getAssociated();

    this.allowedUsers = associatedUsers.filter(x => this._node.permissions.includes(x._id))
  }

  nodeContentTypeMap = nodeContentTypeMap
  nodeTypeMap = nodeTypeMap

}

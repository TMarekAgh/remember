import { Component } from '@angular/core';
import { FilterOperation, NodeProjection } from '@nihil/remember-common';
import { NodeService } from '../../../services/node.service';
import { SelectorComponent } from '../selector/selector.component';
import { Node } from '../../../models/node';
import { UserService } from 'src/app/modules/user/services/user.service';

@Component({
  selector: 'app-node-selector',
  templateUrl: '../selector/selector.component.html',
  styleUrls: ['../selector/selector.component.sass']
})
export class NodeSelectorComponent extends SelectorComponent {

  constructor(
    public nodeService: NodeService,
    public userService: UserService
  ) {
    super()
  }

  public override getItemId = (item: Node) => item.id;

  public override getItemName = (item: Node) => item.name;

  public override getValues = async (value: string) => {

    const currentUser = await this.userService.getCurrentUser();

    const filter = {
      project: NodeProjection.Minified,
      getAdjacent: false,
      name: {
        property: 'name',
        operation: FilterOperation.Contains,
        value: value
      },
      creatorId: {
        property: 'creatorId',
        operation: FilterOperation.Equals,
        value: currentUser.id
      }
    }

    const result = await this.nodeService.filter(filter);

    return result;
  }
}

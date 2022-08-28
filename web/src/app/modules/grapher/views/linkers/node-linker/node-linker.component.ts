import { Component } from '@angular/core';
import { NodeService } from '../../../services/node.service';
import { LinkerComponent } from '../linker/linker.component';
import { Node } from '../../../models/node';
import { FilterOperation, NodeProjection } from '@nihil/remember-common';
import { UserService } from 'src/app/modules/user/services/user.service';

@Component({
  selector: 'app-node-linker',
  templateUrl: '../linker/linker.component.html',
  styleUrls: ['../linker/linker.component.sass']
})
export class NodeLinkerComponent extends LinkerComponent {

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

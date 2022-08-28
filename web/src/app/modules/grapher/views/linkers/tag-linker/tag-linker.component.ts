import { Component } from '@angular/core';
import { FilterOperation } from '@nihil/remember-common';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { UserService } from 'src/app/modules/user/services/user.service';
import { Tag, TagService } from '../../../services/tag.service';
import { LinkerComponent } from '../linker/linker.component';

@Component({
  selector: 'app-tag-linker',
  templateUrl: '../linker/linker.component.html',
  styleUrls: ['../linker/linker.component.sass']
})
export class TagLinkerComponent extends LinkerComponent {

  constructor(
    private tagService: TagService,
    private userService: UserService
  ) {
    super()
  }

  public override getItemId = (item: Tag) => item._id;

  public override getItemName = (item: Tag) => item.name;

  public override getValues = async (value: string) => {
    const currentUser = await this.userService.getCurrentUser();

    const result = await this.tagService.filterTags({
      name: {
        operation: FilterOperation.Contains,
        value,
        property: 'name'
      },
      creator: {
        property: 'creator',
        value: currentUser.id ?? '',
        operation: FilterOperation.Equals
      }
    });

    return result;
  }

}

import { Component, Input } from '@angular/core';
import { User } from 'src/app/modules/auth/models/user.model';
import { UserService } from 'src/app/modules/user/services/user.service';
import { LinkerComponent } from '../linker/linker.component';

@Component({
  selector: 'app-user-linker',
  templateUrl: '../linker/linker.component.html',
  styleUrls: ['../linker/linker.component.sass']
})
export class UserLinkerComponent extends LinkerComponent {

  constructor(
    private userService: UserService
  ) {
    super()
  }

  public override getItemId = (item: User) => item._id;

  public override getItemName = (item: User) => item.displayName;

  public override getValues = async (value: string) => {
    const result = await this.userService.getAssociated();

    return result;
  }

}

import { Component, OnInit } from '@angular/core';
import { FilterOperation } from '@nihil/remember-common';
import { User } from 'src/app/modules/auth/models/user.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { FilterUsersProps, UserService } from 'src/app/modules/user/services/user.service';

@Component({
  selector: 'app-graph-menu-users',
  templateUrl: './graph-menu-users.component.html',
  styleUrls: ['./graph-menu-users.component.sass']
})
export class GraphMenuUsersComponent implements OnInit {

  filters = {
    displayName: ''
  }

  users: User[] = [];

  searched: User[] = [];

  filterActive: boolean = false;

  clearFilters() {
    this.filters = {
      displayName: ''
    }

    this.searched = [];
    this.filterActive = false;
  }

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.getAssociatedUsers()
  }

  async getAssociatedUsers() {
    this.users = await this.userService.getAssociated();
  }

  async addUserAssociation(userId: string) {
    const result = await this.userService.addUserAssociation(userId);

    if(result) {
      this.snackBarService.openSuccess('User association added succesfully');
    } else {
      this.snackBarService.openError('There was an error while adding user association');
    }

    return result;
  }

  async removeUserAssociation(userId: string) {
    const result = await this.userService.removeUserAssociation(userId);

    if(result) {
      this.snackBarService.openSuccess('User association removed succesfully');
    } else {
      this.snackBarService.openError('There was an error while removing user association');
    }

    return result;
  }

  async itemClicked(user: User) {
    const result = await this.addUserAssociation(user._id);

    if(!result) return;

    this.users = [...this.users, user];
    this.searched = [];
    this.filterActive = false;
    this.clearFilters();
  }

  async removeClicked(ev: any, user: User) {
    ev.stopPropagation();
    const result = await this.removeUserAssociation(user._id);

    if(!result) return;

    this.users = this.users.filter(x => x != user);
  }

  async searchInput(ev: any) {
    if(!this.filters.displayName) {
      this.filterActive = false;
      return;
    }

    this.search();
  }

  async search() {
    const currentUser = await this.userService.getCurrentUser();

    const data: FilterUsersProps = {};

    if(this.filters.displayName) data.displayName = {
      property: 'displayName',
      operation: FilterOperation.Contains,
      value: this.filters.displayName
    };

    const result = await this.userService.filterUsers(data);

    this.searched = result.filter((x: any) => x._id != currentUser.id && !this.users.find(y => x._id == y._id));
    this.filterActive = true;
  }
}

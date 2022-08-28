import { Injectable, OnDestroy } from '@angular/core';
import { FilterOperation } from '@nihil/remember-common';
import { stringify } from 'querystring';
import { filter, Subscription } from 'rxjs';
import { User } from '../../auth/models/user.model';
import { AuthService } from '../../auth/services/auth.service';
import { HttpService } from '../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  private basePath = '/user';
  private loginSub: Subscription;

  public currentUser: any | null = null;

  constructor(
    authService: AuthService,
    private readonly http: HttpService,
  ) {
    this.loginSub = authService.onLoginStatusChange
      .pipe(filter((x: boolean) => !!x))
      .subscribe(async x => {
        this.currentUser = await this.getDetails();
      })
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }

  public async getDetails() {
    const response = await this.http.get<any>(`${this.basePath}/details`);

    return response;
  }

  public async getCurrentUser() {
    if(this.currentUser) return this.currentUser;

    return await this.getDetails();
  }

  public async getAssociated() {
    const response = await this.http.get<any>(`${this.basePath}/associated`);

    return response;
  }

  public async filterUsers(props: FilterUsersProps) {
    const response = await this.http.post<any>(`${this.basePath}/filter`, props);

    return response;
  }

  public async getAllUsers() {
    const response = await this.filterUsers({});

    return response;
  }

  public async addUserAssociation(userId: string) {
    const response = await this.http.post(`${this.basePath}/associated`, {
      userId
    });

    return response;
  }

  public async removeUserAssociation(userId: string) {
    const response = await this.http.delete(`${this.basePath}/associated`, {
      userId
    });

    return response;
  }

  //? User icon?
}

export type FilterUsersProps = {
  displayName?: {
    property: string;
    operation: FilterOperation;
    value: string;
  } // Filter
}

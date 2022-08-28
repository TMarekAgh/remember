import { Injectable } from "@angular/core";
import { UserData } from "@nihil/remember-common";
import { AuthService } from "../../auth/services/auth.service";
import { HttpService } from "../../shared/services/http.service";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  constructor(
    private http: HttpService,
    private authService: AuthService
  ) {}

  public userData!: UserData;

  private baseApiPath = '/user-data'

  public async getUserData(id: string) {
    const data = await this.http.get<UserData>(`${this.baseApiPath}/${id}`);

    this.userData = data;

    return data;
  }
}

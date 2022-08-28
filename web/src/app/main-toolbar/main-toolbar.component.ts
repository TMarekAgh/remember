import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../modules/auth/services/auth.service';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.sass']
})
export class MainToolbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  accountPanelOpen = false;

  ngOnInit(): void {}

  toggleAccountPanel() {
    this.accountPanelOpen = !this.accountPanelOpen;
  }

  logout() {
    this.authService.logout()
    this.accountPanelOpen = false;
  }

}

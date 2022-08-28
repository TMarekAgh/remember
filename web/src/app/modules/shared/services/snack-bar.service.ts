import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private _snackBar: MatSnackBar) {}

  openError(message: string) {
    this._snackBar.open(message, undefined, {
      panelClass: 'snack__error',
      duration: 2000
    });
  }

  openSuccess(message: string) {
    this._snackBar.open(message, undefined, {
      panelClass: 'snack__success',
      duration: 2000
    })
  }

  openInfo(message: string) {
    this._snackBar.open(message, undefined, {
      panelClass: 'snack__info',
      duration: 2000
    })
  }
}

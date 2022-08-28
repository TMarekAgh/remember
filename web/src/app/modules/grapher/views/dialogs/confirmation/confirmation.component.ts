import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.sass']
})
export class ConfirmationComponent implements OnInit {

  actionDescription: string = 'proceed with the action';
  confirmationText: string = '';
  canProceed: boolean = true;
  confirm: boolean = false;
  confirmationInput: string = '';
  permanent: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmationComponent>
  ) {
    if(!data) return;

    let {
      actionDescription,
      confirm,
      confirmationText,
      permanent
    } = data;

    if(actionDescription)
      this.actionDescription = actionDescription;

    if(confirm) {
      this.confirm = confirm;
      this.confirmationText = confirmationText ?? 'delete';
    }

    this.permanent = !!permanent;

    this.checkConfirmationInput();
  }

  ngOnInit(): void {}

  accept() {
    this.dialogRef.close(true);
  }

  checkConfirmationInput() {
    this.canProceed = !this.confirm ? true : this.confirmationInput == this.confirmationText;
  }

  confirmationInputChange(value: string) {
    this.confirmationInput = value;
    this.checkConfirmationInput();
  }
}

import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AddImageComponent } from "./add-image.component";

@Component({
  selector: 'app-edit-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.sass']
})
export class EditImageComponent extends AddImageComponent {

  constructor(
    private dialogRef: MatDialogRef<EditImageComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    super()
    this.title = 'Edit Image';
    this.url = data;
  }
}

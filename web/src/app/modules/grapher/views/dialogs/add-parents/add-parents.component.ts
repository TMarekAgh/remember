import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { NodeService } from '../../../services/node.service';
import { Node } from '../../../models/node';

@Component({
  selector: 'app-add-parents',
  templateUrl: './add-parents.component.html',
  styleUrls: ['./add-parents.component.sass']
})
export class AddParentsComponent implements OnInit {

  existing: string[] = [];
  parents: Node[] = [];
  node: Node;

  constructor(
    private nodeService: NodeService,
    private dialogRef: MatDialogRef<AddParentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackService: SnackBarService
  ) {
    this.node = data.node;
    console.log(this.node);
    this.existing = [ this.node.id, ...this.node.parents.map((x: any) => x.id)];
  }

  ngOnInit(): void {}

  onParentsChange(parents: Node[]) {
    this.parents = parents;
  }

  async accept() {
    const newParentsIds = this.parents.map(x => x.id);

    const result = await this.nodeService.addParents(this.node.id, newParentsIds);

    if(!result) {
      this.snackService.openError('There was an error while adding parents')
      return;
    }

    this.dialogRef.close(newParentsIds);
  }
}

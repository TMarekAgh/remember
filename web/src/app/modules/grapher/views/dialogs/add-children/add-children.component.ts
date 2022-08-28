import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateNodeRequest } from '@nihil/remember-common';
import { lastValueFrom } from 'rxjs';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { NodeAction } from '../../../enums/node-action.enum';
import { NodeService } from '../../../services/node.service';
import { CreateNodeComponent } from '../create-node/create-node.component';
import { Node } from '../../../models/node';

@Component({
  selector: 'app-add-children',
  templateUrl: './add-children.component.html',
  styleUrls: ['./add-children.component.sass']
})
export class AddChildrenComponent implements OnInit {

  existing: string[] = [];
  existingChildren: Node[] = [];
  newChildren: CreateNodeRequest[] = [];
  node: Node;

  constructor(
    private nodeService: NodeService,
    private snackService: SnackBarService,
    private dialogRef: MatDialogRef<AddChildrenComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.node = data.node;
    this.existing = [this.node.id, ...this.node.children.map(x => x.id)];
  }

  ngOnInit(): void {}

  onExistingChildrenChange(children: Node[]) {
    this.existingChildren = children;
  }

  async accept() {
    const childrenIds = this.existingChildren.map(x => x.id);

    const result = await this.nodeService.action({
      action: NodeAction.AddChildren,
      value: childrenIds,
      context: this.node
    })

    const updated = await this.nodeService.addChildren(this.node.id, childrenIds);

    if(!updated) {
      this.snackService.openError('There was an error while adding children')
      return;
    }

    this.dialogRef.close(childrenIds);
  }

  async openAddChild() {
    const dialogRef = this.dialog.open(CreateNodeComponent, {
      width: '80%',
      data: { node: this.node }
    })

    const result = await lastValueFrom(dialogRef.afterClosed());

    if(!result) return;

    this.dialogRef.close();
  }

}

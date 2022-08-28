import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { NodeAction } from '../../../enums/node-action.enum';
import { Node } from '../../../models/node';
import { NodeService } from '../../../services/node.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-delete-node',
  templateUrl: './delete-node.component.html',
  styleUrls: ['./delete-node.component.sass']
})
export class DeleteNodeComponent implements OnInit {

  node!: Node;

  selectedOption: any = null;

  deleteOrphaned: boolean = false;
  reattachOrphaned: boolean = false;
  deleteAllChildren: boolean = false;
  select: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private nodeService: NodeService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DeleteNodeComponent>
  ) {
    if(data?.node)
      this.node = data.node;
    else this.select = true;
  }

  ngOnInit(): void {}

  onOptionChanged(value: number) {
    this.selectedOption = value;
    this.deleteOrphaned = false;
    this.reattachOrphaned = false;
    this.deleteAllChildren = false;
    switch(value) {
      case 1:
        this.deleteOrphaned = true;
        break;
      case 2:
        this.reattachOrphaned = true;
        break;
      case 3:
        this.deleteAllChildren = true;
        break;
    }
  }

  async delete() {

    const confirmationDialog = this.dialog.open(ConfirmationComponent, {
      data: {
        confirm: true,
        confirmationText: this.node.name,
        actionDescription: `delete ${this.node.name}?`,
        permanent: true,
      }
    })

    const confirmation = await lastValueFrom(confirmationDialog.afterClosed());

    if(!confirmation) return;

    const result = await this.nodeService.action({
      action: NodeAction.DeleteNode,
      value: {
        id: this.node.id
      },
      context: this.node
    })

    if(!result) return;

    this.dialogRef.close(result);
  }
}

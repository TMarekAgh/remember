import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NodeService } from '../../../services/node.service';
import { Node } from './../../../models/node';

@Component({
  selector: 'app-delete-view',
  templateUrl: './delete-view.component.html',
  styleUrls: ['./delete-view.component.sass']
})
export class DeleteViewComponent implements OnInit {

  node!: Node;

  deleteOrphaned: boolean = false;
  reattachOrphaned: boolean = false;
  deleteAllChildren: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private nodeService: NodeService,
    private dialog: MatDialog
  ) {
    this.node = data.node;
  }

  ngOnInit(): void {}

  onDeleteOrphanedChange(value: boolean) {
    this.deleteOrphaned = value;
  }

  onReattachOrphanedChange(value: boolean) {
    this.reattachOrphaned = value;
  }

  onDeleteAllChange(value: boolean) {
    this.deleteAllChildren = value;
  }

  async delete() {
    // const deleteData: DeleteNodeRequest = {
    //   id: this.node.id,
    //   ids: [],
    //   cascade: false
    // }

    const result = await this.nodeService.deleteView(this.node.id);

    if(!!result) {
      this.dialog.closeAll();
    }
  }
}

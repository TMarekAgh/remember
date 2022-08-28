import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NodeService } from '../../../services/node.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NodeAction } from '../../../enums/node-action.enum';
import { Node } from '../../../models/node';
import { GetNodeRequest, NodeProjection } from '@nihil/remember-common';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { nodeTypeMap } from '../../../classes/navigator';

//** Dialog used to create new node */
@Component({
  selector: 'app-preview-node',
  templateUrl: './preview-node.component.html',
  styleUrls: ['./preview-node.component.sass']
})
export class PreviewNodeComponent implements OnInit {

  node!: Node;

  constructor(
    private nodeService: NodeService,
    private dialogRef: MatDialogRef<PreviewNodeComponent>,
    private snackService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.getNodePreview(data.id);
  }

  async getNodePreview(id: string) {

    const data: GetNodeRequest = {
      getAdjacent: false
    }

    try {
      const res = await this.nodeService.get(id, data);

      if(!res) throw new Error('No such node');

      this.node = Node.fromGetNodeResponse(res, NodeProjection.Minified, NodeProjection.Minified);
    } catch(err) {
      this.snackService.openError('There was an error while loading preview');
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {}

  navigate() {
    this.nodeService.action({
      value: this.node.id,
      action: NodeAction.Navigate,
      context: null as any
    })

    this.dialogRef.close();
  }

  nodeTypeMap = nodeTypeMap

}

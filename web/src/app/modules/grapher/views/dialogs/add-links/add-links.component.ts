import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { NodeService } from '../../../services/node.service';
import { Node } from '../../../models/node';

@Component({
  selector: 'app-add-links',
  templateUrl: './add-links.component.html',
  styleUrls: ['./add-links.component.sass']
})
export class AddLinksComponent implements OnInit {

  existing: string[] = [];
  links: Node[] = [];
  node: Node;

  constructor(
    private nodeService: NodeService,
    public dialogRef: MatDialogRef<AddLinksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackService: SnackBarService
  ) {
    this.node = data.node;
    this.existing = [this.node.id, ...this.node.links.map(x => x.id)];
    this.links = data.linkIds ?? [];
  }

  ngOnInit(): void {}

  onLinksChange(links: Node[]) {
    this.links = links;
  }

  async accept() {
    const updated = await this.nodeService.addLinks(this.node.id, this.links.map(x => x.id));

    if(!updated) {
      this.snackService.openError('There was an error while creating links')
      return;
    }

    this.dialogRef.close(this.links.map(x => x.id));
  }
}

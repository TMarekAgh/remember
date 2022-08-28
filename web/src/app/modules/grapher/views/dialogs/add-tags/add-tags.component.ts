import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { NodeService } from '../../../services/node.service';
import { Node } from '../../../models/node';
import { Tag } from '../../../services/tag.service';

@Component({
  selector: 'app-add-tags',
  templateUrl: './add-tags.component.html',
  styleUrls: ['./add-tags.component.sass']
})
export class AddTagsComponent implements OnInit {

  tags: Tag[] = [];
  node: Node;

  constructor(
    private nodeService: NodeService,
    private dialogRef: MatDialogRef<AddTagsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackService: SnackBarService
  ) {
    this.node = data.node;
  }

  ngOnInit(): void {}

  onTagsChange(tags: Tag[]) {
    this.tags = tags;
  }

  async accept() {
    const newTagsIds = this.tags.map(x => x._id);

    const result = await this.nodeService.addTags(this.node.id, newTagsIds);

    if(!result) {
      this.snackService.openError('There was an error while adding tags')
      return;
    }

    this.dialogRef.close(newTagsIds);
  }
}

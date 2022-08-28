import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateNodeRequest, NodeContentType, NodeType } from '@nihil/remember-common';
import { firstValueFrom, take } from 'rxjs';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { v4 } from 'uuid';
import { NodeAction } from '../../../enums/node-action.enum';
import { Node } from '../../../models/node';
import { NodeService } from '../../../services/node.service';
import { EditorComponent } from '../../editor/editor.component';
import { ReplaceNodeContentRequest } from '../upload-content/upload-content.component';

@Component({
  selector: 'replace-add-view',
  templateUrl: './replace-view.component.html',
  styleUrls: ['./replace-view.component.sass']
})
export class ReplaceViewComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: any;

  node!: Node;
  filename = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private nodeService: NodeService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ReplaceViewComponent>,
    private snackService: SnackBarService
  ) {
    this.node = data.node;
  }

  ngOnInit(): void {}

  async create() {
    let fileData = this.fileInput.nativeElement.files?.[0]  ?? null;
    const fileId = v4();

    let contentData = {
      file: fileId, //Generated file name to correctly associate on backend
      type: fileData.type, //Original file extension //? Mimetype?
      originalName: fileData.name //Original file name
    }

    fileData = fileData ? new File([fileData], fileId, { type: fileData.type }) : null; //Create new file based on passed to overwrite name

    const data: ReplaceNodeContentRequest = {
      contentType: NodeContentType.File,
      contentData,
      file: fileData ? fileData.originalName : 'View'
    }

    const result = await this.nodeService.action({
      action: NodeAction.ReplaceView,
      value: { ...data, fileData },
      context: this.node
    })

    if(!result) {
      this.snackService.openError('There was an error while replacing a view');
      return;
    }

    this.dialogRef.close(result);
  }

  async openEditor() {
    const dialogRef = this.dialog.open(EditorComponent, {
      width: '100%',
      height: '90%',
    })

    const createdView = await firstValueFrom(dialogRef.afterClosed());

    if(!createdView) return;

    const blob = new Blob([createdView], {
      type: 'text/html'
    });

    const filename = 'View_File.html';

    const list = new DataTransfer();

    const view = new File([blob], filename, { type: 'text/html' })

    list.items.add(view);

    this.fileInput.nativeElement.files = list.files;

    this.filename = filename;
  }

  async onFileSelected(ev: any) {
    this.filename = ev.target.files?.[0].name ?? '';
  }
}

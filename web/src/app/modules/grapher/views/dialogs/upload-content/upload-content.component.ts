import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateNodeContentRequest, NodeContentType } from '@nihil/remember-common';
import { v4 } from 'uuid';
import { NodeAction } from '../../../enums/node-action.enum';
import { NodeService } from '../../../services/node.service';

@Component({
  selector: 'app-upload-content',
  templateUrl: './upload-content.component.html',
  styleUrls: ['./upload-content.component.sass']
})
export class UploadContentComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UploadContentComponent>,
    private nodeService: NodeService
  ) { }

  ngOnInit(): void {}

  @ViewChild('fileInput') fileInput!: any;

  uploadContentForm = this.fb.group({
    contentType: [null],
    contentData: [null],
    file: [null]
  })

  fileName = '';

  async create() {

    const {
      contentType,
      file
    } = this.uploadContentForm.getRawValue();

    let fileData = this.fileInput?.nativeElement.files?.[0]  ?? null;
    let contentData = {};

    const fileId = v4();

    contentData = {
      file: fileId, //Generated file name to correctly associate on backend
      type: fileData.type, //Original file extension //? Mimetype?
      originalName: fileData.name //Original file name
    }

    //Create new file based on passed to overwrite name
    fileData = fileData ? new File([fileData], fileId, { type: fileData.type }) : null;

    const data: ReplaceNodeContentRequest = {
      contentType,
      contentData,
      file: fileData ? fileData.originalName : undefined
    }

    this.dialogRef.close({ ...data, fileData } );
  }

  async onFileSelected(ev: any) {
    this.fileName = ev.target.files?.[0].name ?? '';
  }
}

export type ReplaceNodeContentRequest = {
  contentType: NodeContentType;
  contentData?: CreateNodeContentRequest;
  file?: any;
}

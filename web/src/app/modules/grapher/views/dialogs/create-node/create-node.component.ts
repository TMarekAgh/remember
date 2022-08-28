import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateNodeRequest, NodeType } from '@nihil/remember-common';
import { NodeService } from '../../../services/node.service';
import { v4 } from 'uuid';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NodeAction } from '../../../enums/node-action.enum';
import { TagService } from '../../../services/tag.service';

//** Dialog used to create new node */
@Component({
  selector: 'app-create-node',
  templateUrl: './create-node.component.html',
  styleUrls: ['./create-node.component.sass']
})
export class CreateNodeComponent implements OnInit {

  parents: any[] = [];
  children: any[] = [];
  links: any[] = [];
  tags: any[] = [];
  allowedUsers: any[] = [];
  filename = '';

  constructor(
    private fb: FormBuilder,
    private nodeService: NodeService,
    public tagService: TagService,
    private dialogRef: MatDialogRef<CreateNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const parent = data.node;
    this.parents = [{ name: parent.name, id: parent.id }];
    this.createNodeForm.patchValue({ parents: [ parent.id ]});
  }

  @ViewChild('fileInput') fileInput!: any;

  createNodeForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    parents: [[], Validators.required],
    existingChildren: [[], Validators.required],
    newChildren: [[], Validators.required],
    links: [[], Validators.required],
    tags: [[]],
    permissions: [[]],
    type: [null],
    contentType: [null],
    contentData: [null],
    file: [null]
  })

  ngOnInit(): void {}

  async create() {

    const {
      name,
      description,
      parents,
      existingChildren,
      newChildren,
      links,
      type,
      contentType,
      tags,
      permissions,
      file
    } = this.createNodeForm.getRawValue();

    let fileData = this.fileInput?.nativeElement.files?.[0]  ?? null;
    let contentData = {};

    //Handle content type
    switch(+type) {
      case NodeType.File:
        const fileId = v4();

        contentData = {
          file: fileId, //Generated file name to correctly associate on backend
          type: fileData.type, //Original file extension //? Mimetype?
          originalName: fileData.name //Original file name
        }

        //Create new file based on passed to overwrite name
        fileData = fileData ? new File([fileData], fileId, { type: fileData.type }) : null;
        break;
    }

    const data: CreateNodeRequest = {
      name,
      description,
      parents,
      existingChildren,
      newChildren,
      links,
      type,
      contentType,
      contentData,
      tags,
      permissions,
      file: fileData ? fileData.originalName : undefined
    }

    const result = await this.nodeService.action({
      action: NodeAction.AddNode,
      value: { ...data, fileData } ,
      context: null as any
    })

    // const result = await this.nodeService.create(data, fileData);

    this.dialogRef.close(result);
  }

  onParentsChange(parents: any[]) {
    this.createNodeForm.patchValue({ parents: parents.map(x => x.id) });
  }

  onLinksChange(links: any[]) {
    this.createNodeForm.patchValue({ links: links.map(x => x.id) });
  }

  onChildrenChange(children: any[]) {
    this.createNodeForm.patchValue({ children: children.map(x => x.id) });
  }

  onTagsChange(tags: any[]) {
    this.createNodeForm.patchValue({ tags: tags.map(x => x._id) });
  }

  onAllowedUsersChange(users: any[]) {
    this.createNodeForm.patchValue({ permissions: users.map(x => x._id) })
  }

  async onFileSelected(ev: any) {
    this.filename = ev.target.files?.[0].name ?? '';
  }

}

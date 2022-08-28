import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateNodeRequest, NodeType, UpdateNodeRequest } from '@nihil/remember-common';
import { NodeService } from '../../../services/node.service';
import { v4 } from 'uuid';
import { getFileExtension } from 'src/app/util/file';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArrayUtil } from 'src/app/util/array';
import { UserService } from 'src/app/modules/user/services/user.service';
import { NodeAction } from '../../../enums/node-action.enum';

@Component({
  selector: 'app-edit-node',
  templateUrl: './edit-node.component.html',
  styleUrls: ['./edit-node.component.sass']
})
export class EditNodeComponent implements OnInit {

  initial: any;

  parents: any[] = [];
  children: any[] = [];
  links: any[] = [];
  tags: any[] = [];
  allowedUsers: any[] = [];
  permissions: string[] = [];
  filename = '';

  constructor(
    private fb: FormBuilder,
    private nodeService: NodeService,
    private userService: UserService,
    private dialogRef: MatDialogRef<EditNodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    const node = data.node;

    this.initial = node;
    this.parents = node.parents;
    this.children = node.children;
    this.links = node.links;
    this.tags = node.tags;
    this.permissions = node.permissions;

    this.getUsers(node.permissions) //Get allowed users

    this.editNodeForm.setValue({
      name: node.name,
      description: node.description,
      parents: node.parents ?? [],
      children: node.children ?? [],
      links: node.links ?? [],
      type: node.type?.toString() ?? null,
      contentType: node.contentType?.toString() ?? null,
      contentData: null,
      tags: node.tags ?? [],
      permissions: node.permissions ?? [],
      file: ''
    })
  }

  @ViewChild('fileInput') fileInput!: any;

  editNodeForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    parents: [[], Validators.required],
    children: [[], Validators.required],
    links: [[], Validators.required],
    type: [null],
    contentType: [null],
    contentData: [null],
    tags: [],
    permissions: [],
    file: [null]
  });

  ngOnInit(): void {}

  async edit() {
    // let fileData = this.fileInput?.nativeElement.files?.[0] ?? null;

    const {
      name,
      description,
      parents,
      children,
      links,
      type,
      tags,
      permissions,
      contentType,
      file
    } = this.editNodeForm.getRawValue();

    const difference = this.checkForChanges({
      name,
      description,
      parents,
      links,
      children,
      type: +type,
      tags,
      permissions
    });

    if(!difference) return; //TODO add notification

    // const fileId = v4();

    // let contentData = null;

    // switch(type) {
    //   case NodeType.File:
    //     contentData = {
    //       file: fileId, //Generated file name to correctly associate on backend
    //       type: getFileExtension(file), //Original file extension //? Mimetype?
    //       originalName: file //Original file name
    //     }
    // }

    // fileData = fileData ? new File([fileData], fileId) : null; //Create new file based on passed to overwrite name

    const data: UpdateNodeRequest = {
      id: this.initial.id,
      ...difference
    }

    // if(contentData) data.contentData = contentData

    // const result = await this.nodeService.update(data);
    const result = await this.nodeService.action({
      action: NodeAction.EditNode,
      value: data,
      context: this.initial
    })

    this.dialogRef.close(result);
  }

  checkForChanges(data: any) {
    const updateModel: any = {}

    if(data.name != this.initial.name)
      updateModel.name = data.name;

    if(data.description != this.initial.description)
      updateModel.description = data.description;

    if(data.type != this.initial.type)
      updateModel.type = data.type;

    if(!ArrayUtil.equal(data.parents, this.initial.parentIds)) {
      updateModel.parents = data.parents;
    }

    if(!ArrayUtil.equal(data.children, this.initial.childrenIds)) {
      updateModel.children = data.children;
    }

    if(!ArrayUtil.equal(data.links, this.initial.linkIds)) {
      updateModel.links = data.links;
    }

    if(!ArrayUtil.equal(data.tags, this.initial.tagIds)) {
      updateModel.tags = data.tags;
    }

    if(!ArrayUtil.equal(data.permissions, this.initial.permissions)) {
      updateModel.permissions = data.permissions;
    }

    return Object.keys(updateModel).length > 0 ? updateModel : null;
  }

  onParentsChange(parents: any[]) {
    this.editNodeForm.patchValue({ parents: parents.map(x => x.id) });
  }

  onLinksChange(links: any[]) {
    this.editNodeForm.patchValue({ links: links.map(x => x.id) });
  }

  onChildrenChange(children: any[]) {
    this.editNodeForm.patchValue({ children: children.map(x => x.id) });
  }

  onTagsChange(tags: any[]) {
    this.editNodeForm.patchValue({ tags: tags.map(x => x._id) });
  }

  onAllowedUsersChange(users: any[]) {
    this.editNodeForm.patchValue({ permissions: users.map(x => x._id) })
  }

  async getUsers(users: string[]) {
    this.allowedUsers = (await this.userService.getAssociated()).filter((x: any) => this.permissions.includes(x._id));
  }

  async onFileSelected(ev: any) {
    this.filename = ev.target.files?.[0].name ?? '';
  }
}


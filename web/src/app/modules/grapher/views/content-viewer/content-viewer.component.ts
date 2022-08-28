import { animate, group, query, sequence, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodeContentType } from '@nihil/remember-common';
import { lastValueFrom } from 'rxjs';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { v4 } from 'uuid';
import { NodeAction } from '../../enums/node-action.enum';
import { Node } from '../../models/node';
import { NodeService } from '../../services/node.service';
import { AddViewComponent } from '../dialogs/add-view/add-view.component';
import { ReplaceViewComponent } from '../dialogs/replace-view/replace-view.component';
import { ReplaceNodeContentRequest } from '../dialogs/upload-content/upload-content.component';
import { EditorComponent } from '../editor/editor.component';
import { NodeContentComponent } from './views/node-content/node-content.component';
import { NodeViewComponent } from './views/node-view/node-view.component';

@Component({
  selector: 'app-content-viewer',
  templateUrl: './content-viewer.component.html',
  styleUrls: ['./content-viewer.component.sass'],
  animations: [
    trigger('initial', [
      transition(':enter', [
        style({ opacity: '1' }),
        animate('0.5s ease-out', style({ opacity: '0' }))
      ])
    ]),
    trigger('disableInitial', [
      transition(':enter', [])
    ]),
    trigger('fadeInOut', [
      transition('void => *', [
        sequence([
          style({ opacity: '0', height: '0', overflow: 'hidden' }),
          animate('0.5s', style({ opacity: '0' })),
          style({ opacity: '0', height: '*', overflow: 'visible' }),
          animate('0.5s ease-out', style({
            opacity: '1'
          }))
        ])
      ]),
      transition('* => void', [
        animate('0.5s ease-out', style({
          opacity: '0'
        }))
      ]),
    ]),
    trigger('foldInOutVertical', [
      transition('void => *', [
        style({ height: '0', overflow: 'hidden'}),
        animate('0.5s ease-out', style({
          height: '*',
          overflow: '*'
        }))
      ]),
      transition('* => void', [
        style({ overflow: 'hidden' }),
        animate('0.5s ease-out', style({
          height: '0'
        }))
      ])
    ])
  ]
})
export class ContentViewerComponent implements OnInit {

  currentSection: Section = Section.View;
  Section = Section;

  @ViewChild('contentViewer') contentViewer!: NodeContentComponent;
  @ViewChild('nodeViewer') nodeViewer!: NodeViewComponent;

  @Output() nodeModified = new EventEmitter<any>();

  @Input() _node!: Node;

  @Input() set node(val: Node | null) {
    if(!val) return;

    this._node = val;
  }

  get node() {
    return this._node;
  }

  constructor(
    public nodeService: NodeService,
    public snackService: SnackBarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  setSection(section: Section) {
    if(this.currentSection == section) return;

    this.currentSection = section;
  }

  downloadContent() {
    this.contentViewer.downloadFile();
  }

  uploadContent() {
    this.contentViewer.uploadFile();
  }

  deleteContent() {
    this.contentViewer.deleteFile();
  }

  async addView() {
    const dialog = this.dialog.open(AddViewComponent, {
      width: '500px',
      data: { node: this._node }
    })

    const value = await lastValueFrom(dialog.afterClosed());

    if(!value) return;

    this.nodeService.action({
      action: NodeAction.ViewAdded,
      value: [value],
      context: this._node
    })
  }

  async uploadView() {
    const dialog = this.dialog.open(AddViewComponent, {
      width: '500px',
      data: { node: this._node }
    })

    const value = await lastValueFrom(dialog.afterClosed());

    if(!value) return;

    this.nodeService.action({
      action: NodeAction.ViewEdited,
      value: [value],
      context: this._node
    })
  }

  async replaceView() {
    const dialog = this.dialog.open(ReplaceViewComponent, {
      width: '500px',
      data: { node: this._node }
    })

    const value = await lastValueFrom(dialog.afterClosed());

    if(!value) return;

    // const blob = new Blob([value], {
    //   type: 'text/html'
    // });

    // const view = new File([blob], 'View_File.html', { type: 'text/html' })

    // let fileData = view;
    // const fileId = v4();

    // let contentData = {
    //   file: fileId, //Generated file name to correctly associate on backend
    //   type: fileData.type, //Original file extension //? Mimetype?
    //   originalName: fileData.name //Original file name
    // }

    // fileData = new File([fileData], fileId, { type: fileData.type }); //Create new file based on passed to overwrite name

    // const data: ReplaceNodeContentRequest = {
    //   contentType: NodeContentType.File,
    //   contentData,
    //   file: contentData ? contentData.originalName : 'View'
    // }

    // this.nodeService.action({
    //   action: NodeAction.ReplaceView,
    //   value: { ...data, fileData },
    //   context: this._node
    // })
  }

  async editView() {
    const view = await this.nodeService.getView(this._node.id);

    const html = await view.text();

    const dialog = this.dialog.open(EditorComponent, {
      data: { html },
      width: '100%',
      height: '90%',
    });

    const value = await lastValueFrom(dialog.afterClosed());

    if(!value) return;

    const blob = new Blob([value], {
      type: 'text/html'
    });

    const file = new File([blob], 'View_File.html', { type: 'text/html' })

    let fileData = file;
    const fileId = v4();

    let contentData = {
      file: fileId, //Generated file name to correctly associate on backend
      type: fileData.type, //Original file extension //? Mimetype?
      originalName: fileData.name //Original file name
    }

    fileData = new File([fileData], fileId, { type: fileData.type }); //Create new file based on passed to overwrite name

    const data: ReplaceNodeContentRequest = {
      contentType: NodeContentType.File,
      contentData,
      file: contentData ? contentData.originalName : 'View'
    }

    this.nodeService.action({
      action: NodeAction.ReplaceView,
      value: { ...data, fileData },
      context: this._node
    })
  }

  downloadView() {
    this.nodeViewer.downloadView()
  }

  async deleteView() {

    if(!this._node.hasView) return;

    this.nodeService.action({
      action: NodeAction.RemoveView,
      value: this._node.id,
      context: this._node
    })
  }

  async editNode() {
    this.nodeService.action({
      value: this._node,
      action: NodeAction.OpenEditNode,
      context: null as any
    })
  }

  async deleteNode() {
    this.nodeService.action({
      value: this._node,
      action: NodeAction.OpenDeleteNode,
      context: null as any
    })
  }
}

enum Section {
  View,
  Content,
  Settings,
  Info
}

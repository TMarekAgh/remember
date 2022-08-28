import { animate, sequence, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, lastValueFrom, Subscription } from 'rxjs';
import { NodeAction } from 'src/app/modules/grapher/enums/node-action.enum';
import { Node } from 'src/app/modules/grapher/models/node';
import { NodeService } from 'src/app/modules/grapher/services/node.service';
import { UploadContentComponent } from '../../../dialogs/upload-content/upload-content.component';

@Component({
  selector: 'app-node-content',
  templateUrl: './node-content.component.html',
  styleUrls: ['./node-content.component.sass'],
  animations: [
    trigger('fadeInOut', [
      transition('* => void', [
        animate('0.5s ease-out', style({
          opacity: '1'
        }))
      ]),
      transition('void => *', [
        sequence([
          style({ opacity: '0', height: '0', overflow: 'hidden'}),
          animate('0.5s', style({ opacity: '0' })),
          style({ height: '*', overflow: 'visible' }),
          animate('0.5s ease-out', style({
            opacity: '1'
          }))
        ])
      ])
    ]),
  ]
})
export class NodeContentComponent implements OnInit, OnDestroy {

  _node!: Node;
  content: any;
  viewerType: any;
  loading = false;

  ViewerType = ViewerType;

  @Input() set node(val: Node) {
    this._node = val;
    this.loading = true;
    this.getContent();
  };

  get node() {
    return this._node
  }

  onContentChanged: Subscription;
  onContentDeleted: Subscription;

  constructor(
    public nodeService: NodeService,
    public changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
    this.nodeService.onAction.subscribe(x => {
      console.log(x);
      console.log(this._node);
      console.log(x.action == NodeAction.ContentDeleted && this._node.id == x.context.id);
    })

    this.onContentChanged = this.nodeService.onAction.pipe(
      filter(x => x.action == NodeAction.ContentUploaded && this._node.id == x.context.id)
    ).subscribe((x: any) => this.getContent());

    this.onContentDeleted = this.nodeService.onAction.pipe(
      filter(x => x.action == NodeAction.ContentDeleted && this._node.id == x.context.id)
    ).subscribe((x: any) => {
      this.content = null;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.onContentChanged.unsubscribe();
    this.onContentDeleted.unsubscribe();
  }

  async getContent() {
    try {
      const content = await this.nodeService.getContent(this.node.id);

      if(!content) {
        this.content = null;
        this.loading = false;
        return;
      }

      this.content = content;
      this.viewerType = ViewerTypeMap[content.type] ?? ViewerType.Unknown;
      this._node.content = this.content;
      setTimeout(() => { this.loading = false; })
    } catch {
      setTimeout(() => { this.loading = false; })
    }

  }

  mapContentTypeToViewer() {
    return
  }

  downloadFile() {
    const link = document.createElement('a')
    const url = URL.createObjectURL(this.content);

    link.href = url;
    link.download = this.node.name;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  async uploadFile() {
    const dialog = this.dialog.open(UploadContentComponent, {
      width: '300px'
    });

    const data = await lastValueFrom(dialog.afterClosed());

    if(!data) return;

    const result = await this.nodeService.action({
      action: NodeAction.UploadContent,
      value: data,
      context: this._node
    })
  }

  async deleteFile() {
    const result = await this.nodeService.action({
      action: NodeAction.DeleteContent,
      value: this._node.id,
      context: this._node
    })
  }

}

export enum ViewerType {
  PlainText,
  HTML,
  Image,
  Unknown
}

const ContentTypes = {
  PlainText: 'text/plain',
  HTML: 'text/html',
  PNG: 'image/png',
  JPG: 'image/jpg',
  JPEG: 'image/jpeg',
  PDF: 'application/pdf'
}

const ViewerTypeMap = {
  [ContentTypes.PlainText]: ViewerType.PlainText,
  [ContentTypes.HTML]: ViewerType.HTML,
  [ContentTypes.PDF]: ViewerType.PlainText,
  [ContentTypes.PNG]: ViewerType.Image,
  [ContentTypes.JPG]: ViewerType.Image,
  [ContentTypes.JPEG]: ViewerType.Image,
}



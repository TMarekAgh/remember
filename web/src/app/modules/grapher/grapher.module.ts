import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { CreateNodeComponent } from './views/dialogs/create-node/create-node.component';
import { GraphContainerComponent } from './views/graph-container/graph-container.component';
import { GraphViewerComponent } from './views/graph-viewer/graph-viewer.component';
import { GrapherRoutingModule } from './grapher-routing.module';
import { ContentViewerComponent } from './views/content-viewer/content-viewer.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditNodeComponent } from './views/dialogs/edit-node/edit-node.component';
import { DeleteNodeComponent } from './views/dialogs/delete-node/delete-node.component';
import { NodeSettingsComponent } from './views/content-viewer/views/node-settings/node-settings.component';
import { NodeInfoComponent } from './views/content-viewer/views/node-info/node-info.component';
import { NodeContentComponent } from './views/content-viewer/views/node-content/node-content.component';
import { NodeViewComponent } from './views/content-viewer/views/node-view/node-view.component';
import { ContentPlainTextViewerComponent } from './views/content-viewer/views/node-content/views/content-plain-text-viewer/content-plain-text-viewer.component';
import { ContentUnknownViewerComponent } from './views/content-viewer/views/node-content/views/content-unknown-viewer/content-unknown-viewer.component';
import { ContentHtmlViewerComponent } from './views/content-viewer/views/node-content/views/content-html-viewer/content-html-viewer.component';
import { AddViewComponent } from './views/dialogs/add-view/add-view.component';
import { EditorComponent } from './views/editor/editor.component';
import { GraphViewerNodeComponent } from './views/graph-viewer/views/graph-viewer-node/graph-viewer-node.component';
import { GraphMenuComponent } from './views/graph-menu/graph-menu.component';
import { GraphMenuTreeComponent } from './views/graph-menu/views/graph-menu-tree/graph-menu-tree.component';
import { GraphMenuSearchComponent } from './views/graph-menu/views/graph-menu-search/graph-menu-search.component';
import { GraphMenuToolsComponent } from './views/graph-menu/views/graph-menu-tools/graph-menu-tools.component';
import { AddChildrenComponent } from './views/dialogs/add-children/add-children.component';
import { AddLinksComponent } from './views/dialogs/add-links/add-links.component';
import { AddParentsComponent } from './views/dialogs/add-parents/add-parents.component';
import { ResizerComponent } from './views/graph-container/views/resizer/resizer.component';
import { DeleteViewComponent } from './views/dialogs/delete-view/delete-view.component';
import { PreviewNodeComponent } from './views/dialogs/preview-node/preview-node.component';
import { GraphMenuTagsComponent } from './views/graph-menu/views/graph-menu-tags/graph-menu-tags.component';
import { NodeLinkerComponent } from './views/linkers/node-linker/node-linker.component';
import { AddTagsComponent } from './views/dialogs/add-tags/add-tags.component';
import { GraphMenuUsersComponent } from './views/graph-menu/views/graph-menu-users/graph-menu-users.component';
import { AddImageComponent } from './views/dialogs/add-image/add-image.component';
import { UploadContentComponent } from './views/dialogs/upload-content/upload-content.component';
import { ContentImageViewerComponent } from './views/content-viewer/views/node-content/views/content-image-viewer/content-image-viewer.component';
import { EditImageComponent } from './views/dialogs/add-image/edit-image.component';
import { ReplaceViewComponent } from './views/dialogs/replace-view/replace-view.component';
import { LinkerComponent } from './views/linkers/linker/linker.component';
import { TagLinkerComponent } from './views/linkers/tag-linker/tag-linker.component';
import { UserLinkerComponent } from './views/linkers/user-linker/user-linker.component';
import { ConfirmationComponent } from './views/dialogs/confirmation/confirmation.component';
import { SelectorComponent } from './views/selectors/selector/selector.component';
import { NodeSelectorComponent } from './views/selectors/node-selector/node-selector.component';



@NgModule({
  declarations: [
    CreateNodeComponent,
    GraphContainerComponent,
    GraphViewerComponent,
    LinkerComponent,
    ContentViewerComponent,
    EditNodeComponent,
    DeleteNodeComponent,
    NodeSettingsComponent,
    NodeInfoComponent,
    NodeContentComponent,
    NodeViewComponent,
    ContentPlainTextViewerComponent,
    ContentUnknownViewerComponent,
    ContentHtmlViewerComponent,
    AddViewComponent,
    EditorComponent,
    GraphViewerNodeComponent,
    GraphMenuComponent,
    GraphMenuTreeComponent,
    GraphMenuSearchComponent,
    GraphMenuToolsComponent,
    AddChildrenComponent,
    AddLinksComponent,
    AddParentsComponent,
    ResizerComponent,
    DeleteViewComponent,
    PreviewNodeComponent,
    GraphMenuTagsComponent,
    NodeLinkerComponent,
    TagLinkerComponent,
    AddTagsComponent,
    GraphMenuUsersComponent,
    UserLinkerComponent,
    AddImageComponent,
    EditImageComponent,
    UploadContentComponent,
    ContentImageViewerComponent,
    ReplaceViewComponent,
    ConfirmationComponent,
    SelectorComponent,
    NodeSelectorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    GrapherRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GrapherModule { }

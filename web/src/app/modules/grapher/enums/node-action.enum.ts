export enum NodeAction {

  Navigate,
  Preview,

  // Node

  OpenAddNode,
  AddNode,
  NodeAdded,
  NodeAddError,

  OpenEditNode,
  EditNode,
  NodeEdited,
  NodeEditError,

  OpenDeleteNode,
  DeleteNode,
  NodeDeleted,
  NodeDeleteError,

  // Links

  OpenAddLinks,
  AddLinks,
  LinksAdded,
  LinksAddError,

  OpenEditLinks,
  EditLinks,
  LinksEdited,
  LinksEditError,

  OpenRemoveLinks,
  RemoveLinks,
  LinksRemoved,
  LinksRemoveError,

  // Parents

  OpenAddParents,
  AddParents,
  ParentsAdded,
  ParentsAddError,

  OpenEditParents,
  EditParents,
  ParentsEdited,
  ParentsEditError,

  OpenRemoveParents,
  RemoveParents,
  ParentsRemoved,
  ParentsRemoveError,

  // Children

  OpenAddChildren,
  AddChildren,
  ChildrenAdded,
  ChildrenAddError,
  NewChildAdded,
  NewChildAddedError,

  OpenEditChildren,
  EditChildren,
  ChildrenEdited,
  ChildrenEditError,

  OpenRemoveChildren,
  RemoveChildren,
  ChildrenRemoved,
  ChildrenRemoveError,

  // View
  OpenAddView,
  AddView,
  ViewAdded,
  AddViewError,

  OpenEditView,
  EditView,
  ViewEdited,
  EditViewError,

  ReplaceView,
  ViewReplaced,
  ReplaceViewError,

  RemoveView,
  ViewRemoved,
  RemoveViewError,

  DeleteContent,
  ContentDeleted,
  DeleteContentError,

  UploadContent,
  ContentUploaded,
  UploadContentError
}

export const successMap: { [key: number]: number } = {
  [NodeAction.AddNode]: NodeAction.NodeAdded,
  [NodeAction.EditNode]: NodeAction.NodeEdited,
  [NodeAction.DeleteNode]: NodeAction.NodeDeleted,

  [NodeAction.AddLinks]: NodeAction.LinksAdded,
  [NodeAction.EditLinks]: NodeAction.LinksEdited,
  [NodeAction.RemoveLinks]: NodeAction.LinksRemoved,

  [NodeAction.AddParents]: NodeAction.ParentsAdded,
  [NodeAction.EditParents]: NodeAction.ParentsEdited,
  [NodeAction.RemoveParents]: NodeAction.ParentsRemoved,

  [NodeAction.AddChildren]: NodeAction.ChildrenAdded,
  [NodeAction.EditChildren]: NodeAction.ChildrenEdited,
  [NodeAction.RemoveChildren]: NodeAction.ChildrenRemoved,

  [NodeAction.AddView]: NodeAction.ViewAdded,
  [NodeAction.ReplaceView]: NodeAction.ViewEdited,
  [NodeAction.EditView]: NodeAction.ViewEdited
}

export const errorMap: { [key: number]: number } = {
  [NodeAction.AddNode]: NodeAction.NodeAddError,
  [NodeAction.EditNode]: NodeAction.NodeEditError,
  [NodeAction.DeleteNode]: NodeAction.NodeDeleteError,

  [NodeAction.AddLinks]: NodeAction.LinksAddError,
  [NodeAction.EditLinks]: NodeAction.LinksEditError,
  [NodeAction.RemoveLinks]: NodeAction.LinksRemoveError,

  [NodeAction.AddParents]: NodeAction.ParentsAddError,
  [NodeAction.EditParents]: NodeAction.ParentsEditError,
  [NodeAction.RemoveParents]: NodeAction.ParentsRemoveError,

  [NodeAction.AddChildren]: NodeAction.ChildrenAddError,
  [NodeAction.EditChildren]: NodeAction.ChildrenEditError,
  [NodeAction.RemoveChildren]: NodeAction.ChildrenRemoveError,

  [NodeAction.AddView]: NodeAction.AddViewError,
  [NodeAction.ReplaceView]: NodeAction.ReplaceViewError,
  [NodeAction.EditView]: NodeAction.EditViewError
}

import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AddImageComponent } from '../dialogs/add-image/add-image.component';
import { EditImageComponent } from '../dialogs/add-image/edit-image.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent implements OnInit {

  preview: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditorComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data?.html) {
      try {
        this.tryParseHtml(data.html);
      } catch(ex) {
        this.dialogRef.close({ error: 'Cannot parse html' })
      }
    }
  }

  ngOnInit(): void {}

  @ViewChild('workspace') workspace!: any;

  elements: any[] = [];

  tempIndex: number = 0;
  elementSelectionVisible: boolean = false;

  addHeader() {
    this.elements.push({
      type: 'header'
    });
  }

  async addElement(type: string) {
    let additional = {} as any;

    switch(type) {
      case 'list':
        additional.items = [{ type: 'list-item' }];
        break;
      case 'paragraph':
        additional.value = "Paragraph";
        break;
      case 'header':
        additional.value = "Header";
        break;
      case 'image':
        const dialogRef = this.dialog.open(AddImageComponent, {
          width: '300px'
        });
        let url = await lastValueFrom(dialogRef.afterClosed());
        additional.value = url;
        break;
    }
    this.elements.push({
      type,
      ...additional
    })
  }

  async editElement(element: any) {
    switch(element.type) {
      case 'image':
        const dialogRef = this.dialog.open(EditImageComponent, {
          data: element.value
        });
        let url = await lastValueFrom(dialogRef.afterClosed());
        if(!url) return;
        element.value = url;
        break;
    }
  }

  async showElementSelection(index: number) {
    this.tempIndex = index;
    this.elementSelectionVisible = true;
  }

  async hideElementSelection() {
    this.elementSelectionVisible = false;
  }

  async removeElement(element: any) {
    this.elements = this.elements.filter(x => x != element);
  }

  async insertElement(ev: any, type: string, index: number) {
    ev.preventDefault();

    let additional = {} as any;

    switch(type) {
      case 'list':
        additional.items = [{ type: 'list-item', value: 'Item' }];
        break;
      case 'paragraph':
        additional.value = "Paragraph";
        break;
      case 'header':
        additional.value = "Header";
        break;
      case 'image':
        const dialogRef = this.dialog.open(AddImageComponent, {
          width: '300px'
        });
        let url = await lastValueFrom(dialogRef.afterClosed());
        if(!url) return;
        additional.value = url;
        break;
    }

    this.elementSelectionVisible = false;

    this.elements.splice(index, 0, {
      type,
      ...additional
    })

    console.log(this.elements);

    this.changeDetectorRef.detectChanges();
  }

  setElementValue(ev: any, element: any) {
    element.value = ev.value;
  }

  addListItem(element: any) {
    if(!element.items) element.items = [];
    element.items.push({ type: 'list-item' })
    this.changeDetectorRef.detectChanges();
  }

  removeListItem(element: any, item: any) {
    if(!element.items) element.items = [];
    element.items = element.items.filter((x: any) => x != item);
  }

  save() {
    let workspace = this.workspace.nativeElement as HTMLElement;

    let splitters = workspace.querySelectorAll('.remove');
    splitters.forEach(x => x.remove());

    let editable = workspace.querySelectorAll('*[contenteditable]');
    editable.forEach(x => x.removeAttribute('contenteditable'));

    let body = document.createElement('body');
    let head = document.createElement('head');
    let html = document.createElement('html');

    var cssLink = document.createElement("link");
    cssLink.href = "http://localhost:4200/assets/view.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";

    head.appendChild(cssLink);

    body.appendChild(workspace);
    html.appendChild(body);
    html.appendChild(head);

    this.dialogRef.close(html.innerHTML);
  }

  tryParseHtml(html: string) {
    let additional = {} as any;

    var div = document.createElement('div');
    div.innerHTML = html;

    const elements = Array.from(div.querySelectorAll('*[data-element]'));

    for(let element of elements) {
      const type = element.getAttribute('data-type');
      const valueElement = element.querySelector('*[data-value]');

      if(!valueElement) throw 'Cannot parse html'

      switch(type) {
        case 'list':
          const itemElements = Array.from(element.querySelectorAll('*[data-type="list-item"]'));
          const itemValues = itemElements.map(x => x.querySelector('*[data-value]')?.textContent);
          additional.items = itemValues.map(x => ({ type: 'list-item', value: x }));
          break;
        case 'paragraph':
          additional.value = valueElement.textContent;
          break;
        case 'header':
          additional.value = valueElement.textContent;
          break;
        case 'image':
          let url = valueElement?.getAttribute('src');
          additional.value = url;
          break;
      }

      this.elements.push({
        type,
        ...additional
      })
    }

    this.elements = [...this.elements];
  }
}

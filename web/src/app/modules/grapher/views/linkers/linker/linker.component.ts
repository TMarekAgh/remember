import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-linker',
  templateUrl: './linker.component.html',
  styleUrls: ['./linker.component.sass']
})
export class LinkerComponent implements OnInit {

  constructor() { }

  @Input() set selected(data: any[]) {
    this._selected = data ?? [];
  }

  public _selected!: any[];
  public single: boolean = false;
  public filter: string = '';
  public searched: any[] = [];

  @Output() selectedChange = new EventEmitter<any[]>();

  @Input() public data: any[] = [];

  @Input() public getItemName = (item: any) => item;

  @Input() public getItemId = (item: any) => item;

  @Input() public getValues = async (value: string) =>  {
    return this.data.filter(x => this.getItemName(x).toLowerCase().includes(this.search).toLowerCase())
  }

  @Input() public static: boolean = false;

  @Input() public ignore: string[] = [];

  ngOnInit(): void {}

  async valueChange(ev: any) {
    this.filter = ev.target.value;

    this.search();
  }

  async search() {
    if(this.filter == '') this.searched = [];
    else {
      const searched = await this.getValues(this.filter);
      this.searched = searched.filter(x =>
        !this._selected.find(y => this.getItemId(y) == this.getItemId(x)) &&
        !this.ignore.includes(this.getItemId(x))
      );
    }
  }

  itemClicked(item: any) {
    this.addSelected(item);
    this.searched = [];
    this.filter = '';
  }

  addSelected(item: any) {
    this._selected = [...this._selected, item];
    this.selectedChange.emit(this._selected);
  }

  removeSelected(item: any) {
    this._selected = this._selected.filter(x => this.getItemId(x) != this.getItemId(item));
    this.selectedChange.emit(this._selected);
  }

  onFocus() {
    if(!this.filter) return;

    this.search();
  }

  onBlur() {
    setTimeout(() => { this.searched = []; }, 100)
  }

}

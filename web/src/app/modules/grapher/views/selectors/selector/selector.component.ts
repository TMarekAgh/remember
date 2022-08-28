import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.sass']
})
export class SelectorComponent implements OnInit {

  constructor() { }

  @Input() set selected(data: any) {
    this._selected = data;
  }

  get isSelected() {
    return !!this._selected;
  }

  public _selected!: any;
  public search: string = '';
  public searched: any[] = [];

  @Output() selectedChange = new EventEmitter<any[]>();

  @Input() public data: any[] = [];

  @Input() public getItemName = (item: any) => item;

  @Input() public getItemId = (item: any) => item;

  @Input() public getValues = async (value: string) =>  {
    return this.data.filter(x => this.getItemName(x).toLowerCase().includes(this.search).toLowerCase())
  }

  @Input() public ignore: string[] = [];

  ngOnInit(): void {}

  async valueChange(ev: any) {
    this._selected = null;
    this.search = ev.target.value;

    if(this.search == '') this.searched = [];
    else {
      const searched = await this.getValues(this.search); //TODO optimize (call on observable after 0.5s since last update)
      this.searched = searched.filter(x => !this.ignore.includes(this.getItemId(x)));
    }
  }

  itemClicked(item: any) {
    this.addSelected(item);
    this.searched = [];
    this.search = this.getItemName(item);
  }

  addSelected(item: any) {
    this._selected = item;
    this.selectedChange.emit(this._selected);
  }

}

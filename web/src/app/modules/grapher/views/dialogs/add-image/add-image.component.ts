import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.sass']
})
export class AddImageComponent implements OnInit {

  title: string;
  url = '';

  constructor() {
    this.title = 'Add Image'
  }

  ngOnInit(): void {}

}

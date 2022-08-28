import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-content-image-viewer',
  templateUrl: './content-image-viewer.component.html',
  styleUrls: ['./content-image-viewer.component.sass']
})
export class ContentImageViewerComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {}

  url: SafeResourceUrl = '';
  _content!: File;

  @Input() set content(val: File) {
    if(!val) return;
    this._content = val;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(val)) ?? '';
  }

}

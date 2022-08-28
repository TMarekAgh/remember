import { Component, Input, OnInit, Sanitizer, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-content-plain-text-viewer',
  templateUrl: './content-plain-text-viewer.component.html',
  styleUrls: ['./content-plain-text-viewer.component.sass']
})
export class ContentPlainTextViewerComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }

  url!: SafeResourceUrl;

  ngOnInit(): void {}

  _content!: File;

  @Input() set content(val: File) {
    if(!val) return;
    this._content = val;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(val)) ?? '';
  }

  get content() {
    return this._content
  }



}

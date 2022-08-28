import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-content-html-viewer',
  templateUrl: './content-html-viewer.component.html',
  styleUrls: ['./content-html-viewer.component.sass']
})
export class ContentHtmlViewerComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }

  url!: SafeResourceUrl;
  loading: boolean = false;

  ngOnInit(): void {}

  _content!: File;

  @Input() set content(val: File) {
    if(!val) return;
    this.loading = true;
    this._content = val;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(val)) ?? '';
  }

  get content() {
    return this._content
  }


  onIFrameLoaded() {
    var cssLink = document.createElement("link");
    cssLink.href = "http://localhost:4200/styles.css";
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    var fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    fontLink.rel = "stylesheet";
    fontLink.type = "text/css";
    var base = document.createElement('base');
    let html_content_frame = frames['html_content' as any];
    html_content_frame.document.head.appendChild(base);
    html_content_frame.document.head.appendChild(cssLink);
    html_content_frame.document.head.appendChild(fontLink);

    setTimeout(() => { this.loading = false; }, 500)
  }
}

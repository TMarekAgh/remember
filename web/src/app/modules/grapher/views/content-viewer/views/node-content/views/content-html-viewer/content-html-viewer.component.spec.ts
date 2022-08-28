import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentHtmlViewerComponent } from './content-html-viewer.component';

describe('ContentHtmlViewerComponent', () => {
  let component: ContentHtmlViewerComponent;
  let fixture: ComponentFixture<ContentHtmlViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentHtmlViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentHtmlViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

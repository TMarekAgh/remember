import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPlainTextViewerComponent } from './content-plain-text-viewer.component';

describe('ContentPlainTextViewerComponent', () => {
  let component: ContentPlainTextViewerComponent;
  let fixture: ComponentFixture<ContentPlainTextViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentPlainTextViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlainTextViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentUnknownViewerComponent } from './content-unknown-viewer.component';

describe('ContentUnknownViewerComponent', () => {
  let component: ContentUnknownViewerComponent;
  let fixture: ComponentFixture<ContentUnknownViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentUnknownViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentUnknownViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentImageViewerComponent } from './content-image-viewer.component';

describe('ContentImageViewerComponent', () => {
  let component: ContentImageViewerComponent;
  let fixture: ComponentFixture<ContentImageViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentImageViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

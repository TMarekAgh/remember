import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewNodeComponent } from './preview-node.component';

describe('PreviewNodeComponent', () => {
  let component: PreviewNodeComponent;
  let fixture: ComponentFixture<PreviewNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

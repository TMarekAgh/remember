import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphViewerNodeComponent } from './graph-viewer-node.component';

describe('GraphViewerNodeComponent', () => {
  let component: GraphViewerNodeComponent;
  let fixture: ComponentFixture<GraphViewerNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphViewerNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphViewerNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

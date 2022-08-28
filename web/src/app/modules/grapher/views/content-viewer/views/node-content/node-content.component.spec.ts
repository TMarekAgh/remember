import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeContentComponent } from './node-content.component';

describe('NodeContentComponent', () => {
  let component: NodeContentComponent;
  let fixture: ComponentFixture<NodeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

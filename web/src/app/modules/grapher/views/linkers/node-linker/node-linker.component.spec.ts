import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeLinkerComponent } from './node-linker.component';

describe('NodeLinkerComponent', () => {
  let component: NodeLinkerComponent;
  let fixture: ComponentFixture<NodeLinkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeLinkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeLinkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

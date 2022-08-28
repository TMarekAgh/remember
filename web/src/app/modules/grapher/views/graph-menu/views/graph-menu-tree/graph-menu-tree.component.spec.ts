import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphMenuTreeComponent } from './graph-menu-tree.component';

describe('GraphMenuTreeComponent', () => {
  let component: GraphMenuTreeComponent;
  let fixture: ComponentFixture<GraphMenuTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphMenuTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphMenuTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

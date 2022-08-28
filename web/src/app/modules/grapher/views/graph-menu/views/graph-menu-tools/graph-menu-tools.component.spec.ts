import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphMenuToolsComponent } from './graph-menu-tools.component';

describe('GraphMenuToolsComponent', () => {
  let component: GraphMenuToolsComponent;
  let fixture: ComponentFixture<GraphMenuToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphMenuToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphMenuToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

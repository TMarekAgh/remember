import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphMenuSearchComponent } from './graph-menu-search.component';

describe('GraphMenuSearchComponent', () => {
  let component: GraphMenuSearchComponent;
  let fixture: ComponentFixture<GraphMenuSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphMenuSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphMenuSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

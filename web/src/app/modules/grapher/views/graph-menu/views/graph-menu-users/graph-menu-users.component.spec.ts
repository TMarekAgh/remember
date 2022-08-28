import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphMenuUsersComponent } from './graph-menu-users.component';

describe('GraphMenuUsersComponent', () => {
  let component: GraphMenuUsersComponent;
  let fixture: ComponentFixture<GraphMenuUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphMenuUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphMenuUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

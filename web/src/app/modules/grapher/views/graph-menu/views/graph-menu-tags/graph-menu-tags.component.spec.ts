import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphMenuTagsComponent } from './graph-menu-tags.component';

describe('GraphMenuTagsComponent', () => {
  let component: GraphMenuTagsComponent;
  let fixture: ComponentFixture<GraphMenuTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphMenuTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphMenuTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

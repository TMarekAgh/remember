import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagLinkerComponent } from './tag-linker.component';

describe('TagLinkerComponent', () => {
  let component: TagLinkerComponent;
  let fixture: ComponentFixture<TagLinkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagLinkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagLinkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

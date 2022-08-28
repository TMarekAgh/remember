import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteViewComponent } from './delete-view.component';

describe('DeleteViewComponent', () => {
  let component: DeleteViewComponent;
  let fixture: ComponentFixture<DeleteViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

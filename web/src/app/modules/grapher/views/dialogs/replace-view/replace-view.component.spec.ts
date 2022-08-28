import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceViewComponent } from './replace-view.component';

describe('ReplaceViewComponent', () => {
  let component: ReplaceViewComponent;
  let fixture: ComponentFixture<ReplaceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplaceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

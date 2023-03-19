import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivelogComponent } from './divelog.component';

describe('DivelogComponent', () => {
  let component: DivelogComponent;
  let fixture: ComponentFixture<DivelogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivelogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DivestatComponent } from './divestat.component';

describe('DivelogComponent', () => {
  let component: DivestatComponent;
  let fixture: ComponentFixture<DivestatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivestatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivestatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

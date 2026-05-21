import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselorRegister } from './counselor-register';

describe('CounselorRegister', () => {
  let component: CounselorRegister;
  let fixture: ComponentFixture<CounselorRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounselorRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CounselorRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

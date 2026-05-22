import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselorDashboard } from './counselor-dashboard';

describe('CounselorDashboard', () => {
  let component: CounselorDashboard;
  let fixture: ComponentFixture<CounselorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounselorDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CounselorDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

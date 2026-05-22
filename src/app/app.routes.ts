import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin';
import { CounselorDashboard } from './counselor-dashboard/counselor-dashboard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'counselor-dashboard',
    component: CounselorDashboard
  }
];
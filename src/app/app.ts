import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminComponent } from './admin/admin';
import { CounselorRegister } from './counselor-register/counselor-register';
import { CounselorDashboard } from './counselor-dashboard/counselor-dashboard';
@Component({
  
  selector: 'app-root',
  standalone: true,
  imports: [
  CommonModule,
  FormsModule,
  AdminComponent,
  CounselorRegister,
  CounselorDashboard
],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})

export class AppComponent implements OnInit {
  constructor(private firestore: Firestore) {}

  isAdminPage = false;
  isCounselorRegisterPage = false;
  isCounselorDashboardPage = false;
  showSuccess = false;
  liveMessage = '🔥 Students are getting free counseling now';

  // =========================
  // STUDENT FORM
  // =========================

  student = {
    name: '',
    email: '',
    mobile: '',
    state: '',
    city: '',
    level: '',
    course: '',
    agree: false
  };

  // =========================
  // STATES
  // =========================

  states: string[] = [
    'Bihar',
    'Uttar Pradesh',
    'Delhi',
    'Maharashtra',
    'West Bengal',
    'Jharkhand',
    'Punjab',
    'Rajasthan',
    'Gujarat',
    'Haryana'
  ];

  // =========================
  // CITIES
  // =========================

  cities: string[] = [];

  // =========================
  // COURSES
  // =========================

  courses: string[] = [];

  // =========================
  // STATE CHANGE
  // =========================

  onStateChange() {

    if (this.student.state === 'Bihar') {

      this.cities = [
        'Patna',
        'Gaya',
        'Muzaffarpur',
        'Bhagalpur',
        'Darbhanga'
      ];

    }

    else if (this.student.state === 'Uttar Pradesh') {

      this.cities = [
        'Lucknow',
        'Kanpur',
        'Noida',
        'Varanasi',
        'Prayagraj'
      ];

    }

    else if (this.student.state === 'Delhi') {

      this.cities = [
        'New Delhi',
        'South Delhi',
        'North Delhi',
        'East Delhi'
      ];

    }

    else if (this.student.state === 'Maharashtra') {

      this.cities = [
        'Mumbai',
        'Pune',
        'Nagpur',
        'Nashik'
      ];

    }

    else {

      this.cities = [];

    }

    this.student.city = '';

  }

  // =========================
  // LEVEL CHANGE
  // =========================

  onLevelChange() {

    if (this.student.level === 'Diploma') {

      this.courses = [
        'Polytechnic CSE',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering'
      ];

    }

    else if (this.student.level === 'UG') {

      this.courses = [
        'B.Tech',
        'BCA',
        'BBA',
        'B.Com'
      ];

    }

    else if (this.student.level === 'PG') {

      this.courses = [
        'MBA',
        'MCA',
        'M.Tech'
      ];

    }

    else {

      this.courses = [];

    }

    this.student.course = '';

  }

  // =========================
  // SUBMIT FORM
  // =========================

ngOnInit() {
  const path = window.location.pathname;

  this.isAdminPage = path === '/admin';
  this.isCounselorRegisterPage = path === '/counselor-register';
  this.isCounselorDashboardPage = path === '/counselor-dashboard';
}

  submitForm(student: any) {

    if (
      !student.name ||
      !student.email ||
      !student.mobile ||
      !student.state ||
      !student.city ||
      !student.level ||
      !student.course
    ) {

      alert('Please fill all required fields.');
      return;

    }

    if (!student.agree) {

      alert('Please accept the agreement checkbox.');
      return;

    }

     const leadsRef = collection(this.firestore, 'student_leads');

addDoc(leadsRef, {
  name: student.name,
  email: student.email,
  mobile: student.mobile,
  state: student.state,
  city: student.city,
  level: student.level,
  course: student.course,
  admissionStatus: 'Not Started',
  createdAt: serverTimestamp()
});


    alert('Form submitted successfully 😄🔥');

    // RESET FORM

    this.student = {
      name: '',
      email: '',
      mobile: '',
      state: '',
      city: '',
      level: '',
      course: '',
      agree: false
    };

    this.cities = [];
    this.courses = [];

  }

}
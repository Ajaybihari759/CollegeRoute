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
    customState: '',
    city: '',
    level: '',
    course: '',
    customCourse: '',
    agree: false
  };

  // =========================
  // STATES
  // =========================

  states: string[] = [
    'Bihar',
    'Uttar Pradesh',
    'Jharkhand',
    'Other'
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


    districtsByState: any = {
  Bihar: [
    'Araria','Arwal','Aurangabad','Banka','Begusarai',
    'Bhagalpur','Bhojpur','Buxar','Darbhanga','East Champaran',
    'Gaya','Gopalganj','Jamui','Jehanabad','Kaimur',
    'Katihar','Khagaria','Kishanganj','Lakhisarai','Madhepura',
    'Madhubani','Munger','Muzaffarpur','Nalanda','Nawada',
    'Patna','Purnia','Rohtas','Saharsa','Samastipur',
    'Saran','Sheikhpura','Sheohar','Sitamarhi','Siwan',
    'Supaul','Vaishali','West Champaran'
  ],

  Jharkhand: [
    'Bokaro','Chatra','Deoghar','Dhanbad','Dumka',
    'East Singhbhum','Garhwa','Giridih','Godda','Gumla',
    'Hazaribagh','Jamtara','Khunti','Koderma','Latehar',
    'Lohardaga','Pakur','Palamu','Ramgarh','Ranchi',
    'Sahibganj','Seraikela Kharsawan','Simdega','West Singhbhum'
  ],

  'Uttar Pradesh': [
    'Agra','Aligarh','Ambedkar Nagar','Amethi','Amroha',
    'Auraiya','Ayodhya','Azamgarh','Baghpat','Bahraich',
    'Ballia','Balrampur','Banda','Barabanki','Bareilly',
    'Basti','Bhadohi','Bijnor','Budaun','Bulandshahr',
    'Chandauli','Chitrakoot','Deoria','Etah','Etawah',
    'Farrukhabad','Fatehpur','Firozabad','Gautam Buddha Nagar','Ghaziabad',
    'Ghazipur','Gonda','Gorakhpur','Hamirpur','Hapur',
    'Hardoi','Hathras','Jalaun','Jaunpur','Jhansi',
    'Kannauj','Kanpur Dehat','Kanpur Nagar','Kasganj','Kaushambi',
    'Kheri','Kushinagar','Lalitpur','Lucknow','Maharajganj',
    'Mahoba','Mainpuri','Mathura','Mau','Meerut',
    'Mirzapur','Moradabad','Muzaffarnagar','Pilibhit','Pratapgarh',
    'Prayagraj','Raebareli','Rampur','Saharanpur','Sambhal',
    'Sant Kabir Nagar','Shahjahanpur','Shamli','Shrawasti','Siddharthnagar',
    'Sitapur','Sonbhadra','Sultanpur','Unnao','Varanasi'
  ]

};

  // =========================
  // LEVEL CHANGE
  // =========================


  onStateChange() {

  if (this.student.state === 'Other') {
    this.cities = [];
    this.student.city = '';
    return;
  }

  this.cities =
    this.districtsByState[this.student.state] || [];

  this.student.city = '';
}

  onLevelChange() {

    if (this.student.level === 'Diploma') {

      this.courses = [
        'Polytechnic CSE',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'Other'
      ];

    }

    else if (this.student.level === 'UG') {

      this.courses = [
        'B.Tech',
        'BCA',
        'BBA',
        'B.Com',
        'MBBS',
        'GNM',
        'NURSING',
        'PHARMACY',
        'HOTAL MGT',
        'BHMCT',
        'LLB',
        'Other'
      ];

    }

    else if (this.student.level === 'PG') {

      this.courses = [
        'MBA',
        'MCA',
        'LLB',
        'M.Tech',
        'Other'
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
  (student.state === 'Other' && !student.customState) ||
  !student.city ||
  !student.level ||
  !student.course ||
  (student.course === 'Other' && !student.customCourse) ||
  !student.agree
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
  state: student.state === 'Other' ? student.customState : student.state,
  city: student.city,
  level: student.level,
  course: student.course === 'Other' ? student.customCourse : student.course,
  admissionStatus: 'Not Started',
  createdAt: serverTimestamp()
});


    this.showSuccess = true;

    // RESET FORM

    this.student = {
      name: '',
      email: '',
      mobile: '',
      state: '',
      customState: '',
      city: '',
      level: '',
      course: '',
      customCourse: '',
      agree: false
    };

    this.cities = [];
    this.courses = [];

  }

  

}
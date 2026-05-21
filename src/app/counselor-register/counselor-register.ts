import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp
} from '@angular/fire/firestore';

@Component({
  selector: 'app-counselor-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './counselor-register.html',
  styleUrl: './counselor-register.scss'
})
export class CounselorRegister {

  constructor(private firestore: Firestore) {}

  counselor = {
  name: '',
  mobile: '',
  email: '',
  password: '',
  department: 'Engineering',
  role: 'Counselor'
};
  showSuccess = false;
  errorMessage = '';

 async registerCounselor() {

  this.errorMessage = '';

  const name = this.counselor.name?.trim();
  const mobile = this.counselor.mobile?.trim();
  const email = this.counselor.email?.trim();
  const password = this.counselor.password?.trim();

  if (!name || !mobile || !email || !password || !this.counselor.department || !this.counselor.role) {
    this.errorMessage = 'Please complete all required fields before registering the counselor.';
    return;
  }

  if (mobile.length !== 10) {
    this.errorMessage = 'Please enter a valid 10-digit mobile number.';
    return;
  }

  if (!email.includes('@')) {
    this.errorMessage = 'Please enter a valid email address.';
    return;
  }

  await addDoc(collection(this.firestore, 'counselors'), {
    ...this.counselor,
    name,
    mobile,
    email,
    password,
    status: 'Active',
    createdAt: serverTimestamp()
  });

  this.showSuccess = true;

  this.counselor = {
    name: '',
    mobile: '',
    email: '',
    password: '',
    department: 'Engineering',
    role: 'Counselor'
  };
}
}
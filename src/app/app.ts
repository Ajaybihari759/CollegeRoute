import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { AdminComponent } from './admin/admin';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class AppComponent {
  protected readonly title = signal('college-route');

  isAdminPage = window.location.pathname === '/admin';
  constructor(private firestore: Firestore) {}

  student = {
  name: '',
  mobile: '',
  whatsapp: '',
  cityState: '',
  stream: '',
  board: '',
  passingYear: '',
  percentage: '',
  course: '',
  budget: '',
  educationLoan: '',
  gender: ''
};

   showSuccess = false;


  async submitForm(form: any) {
    if (form.invalid) {
  alert('Please complete all required fields before submitting the form.');
  return;
}

if (this.student.mobile.length !== 10) {
  alert('Please complete all required fields before submitting the form.');
  return;
}

if (this.student.whatsapp.length !== 10) {
  alert('Please enter a valid 10-digit WhatsApp number.');
  return;
}

const percentage = Number(this.student.percentage);

if (percentage < 33 || percentage > 100) {
  alert('Please enter a valid 12th percentage between 33 and 100.');
  return;
}
  if (form.invalid) {
    alert('Please fill the all required fields.');
    return;
  }

  try {
    await addDoc(collection(this.firestore, 'student_leads'), {
      ...this.student,
      status: 'New Lead',
      counselor: '',
      admissionStatus: 'Not Started',
      createdAt: serverTimestamp()
    });

    this.showSuccess = true;

    form.resetForm();

    this.student = {
      name: '',
      mobile: '',
      whatsapp: '',
      cityState: '',
      stream: '',
      board: '',
      passingYear: '',
      percentage: '',
      course: '',
      budget: '',
      educationLoan: '',
      gender: ''
    };

  } catch (error) {
    console.error(error);
    alert('Kuch error aaya. Please try again.');
  }
}
}
import * as XLSX from 'xlsx';
import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { collection, collectionData,doc,updateDoc  } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-counselor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './counselor-dashboard.html',
  styleUrl: './counselor-dashboard.scss'
})

export class CounselorDashboard implements OnInit {
  leads: any[] = [];
  filteredLeads: any[] = [];
  groupedLeads: any[] = [];
   selectedStatus = 'All';
   searchText = '';

  counselorName = 'Ajay Kumar';
  profileImage: string = '';

 constructor(
  private firestore: Firestore,
  private ngZone: NgZone
) {}
  ngOnInit(): void {

    const savedImage = localStorage.getItem('counselorProfile');

if (savedImage) {
  this.profileImage = savedImage;
}

    const leadsRef = collection(
      this.firestore,
      'student_leads'
    );

   collectionData(leadsRef, {
  idField: 'id'
}).subscribe((data: any) => {
  

  this.ngZone.run(() => {

  this.leads = data;
this.filteredLeads = [...data];
this.makeGroups();

});


});
  }

  

  getStatusCount(status: string) {
  return this.leads.filter((lead: any) =>
    lead.status === status
  ).length;
}

getConversionRate() {

  if (this.leads.length === 0) {
    return 0;
  }

  const converted = this.leads.filter((lead: any) =>

    lead.status === 'Converted' ||
    lead.status === 'Admission Completed'

  ).length;

  return Math.round(
    (converted / this.leads.length) * 100
  );

}

async updateLeadStatus(lead: any) {

  const leadRef = doc(
    this.firestore,
    'student_leads',
    lead.id
  );

  await updateDoc(leadRef, {
    status: lead.status
  });

}

async updateRemark(lead: any) {

  const leadRef = doc(
    this.firestore,
    'student_leads',
    lead.id
  );

  await updateDoc(leadRef, {
    remark: lead.remark
  });

}

async updatePriority(lead: any) {

  const leadRef = doc(
    this.firestore,
    'student_leads',
    lead.id
  );

  await updateDoc(leadRef, {
    priority: lead.priority
  });

}

async updateFollowUpDate(lead: any) {

  const leadRef = doc(
    this.firestore,
    'student_leads',
    lead.id
  );

  await updateDoc(leadRef, {
    followUpDate: lead.followUpDate
  });

}

getTodayLeadsCount() {

  const today = new Date().toDateString();

  return this.leads.filter((lead: any) => {

    if (!lead.createdAt) return false;

    return new Date(lead.createdAt).toDateString() === today;

  }).length;

}

filterTable(status: string) {

  this.selectedStatus = status;

 if (status === 'All') {

  this.filteredLeads = [...this.leads];

}

else if (status === 'Today') {

  const today = new Date().toDateString();

  this.filteredLeads = this.leads.filter((lead: any) => {

    if (!lead.createdAt?.toDate) return false;

    return lead.createdAt
      .toDate()
      .toDateString() === today;

  });

}

else {

  this.filteredLeads = [...this.leads.filter((lead: any) =>
    lead.status === status
  )];

}
this.makeGroups();
  setTimeout(() => {
    const table = document.getElementById('counselorLeadTable');

    if (table) {
      table.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, 100);

}

searchLeads() {

  const text = this.searchText.toLowerCase();

  this.filteredLeads = this.leads.filter((lead: any) =>

    lead.name?.toLowerCase().includes(text) ||

    lead.mobile?.toString().includes(text) ||

    lead.course?.toLowerCase().includes(text)

  );

  this.makeGroups();

}

makeGroups() {
  const grouped: any = {};

  this.filteredLeads.forEach((lead: any) => {
    let date = 'Unknown Date';

    if (lead.createdAt?.toDate) {
      date = lead.createdAt.toDate().toDateString();
    }

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(lead);
  });

  this.groupedLeads = Object.keys(grouped).map(date => ({
    date,
    leads: grouped[date]
  }));
}

onProfileSelect(event: any) {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {

    this.ngZone.run(() => {

      this.profileImage = reader.result as string;

localStorage.setItem(
  'counselorProfile',
  this.profileImage
);

    });

  };

  reader.readAsDataURL(file);

}

exportExcel() {

  console.log('Export leads:', this.leads);
console.log('Filtered leads:', this.filteredLeads);

  const exportData = this.leads.map((lead: any) => ({

    Name: lead.name,
    Gender: lead.gender,
    Mobile: lead.mobile,
    WhatsApp: lead.whatsapp,
    City: lead.cityState,
    Stream: lead.stream,
    Board: lead.board,
    PassingYear: lead.passingYear,
    Percentage: lead.percentage,
    Course: lead.course,
    Budget: lead.budget,
    EducationLoan: lead.educationLoan,
    Status: lead.status,
    Remark: lead.remark || ''

  }));

 const worksheet: XLSX.WorkSheet =
  XLSX.utils.json_to_sheet(exportData);

const workbook: XLSX.WorkBook = {
  Sheets: {
    data: worksheet
  },
  SheetNames: ['data']
};

XLSX.writeFile(
  workbook,
  'Counselor-Leads.xlsx'
);

}

isFollowUpDue(date: string): boolean {

  if (!date) return false;

  const followUp = new Date(date);

  const now = new Date();

  return followUp <= now;

}

}
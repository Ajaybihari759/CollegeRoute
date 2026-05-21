import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {

 scrollToTable() {
  this.showCounselors = false;

  const table = document.getElementById('leadTable');

  if (table) {
    table.scrollIntoView({
      behavior: 'smooth'
    });
  }

}

scrollToCounselors() {

  setTimeout(() => {

    const section = document.getElementById('counselorTable');

    if (section) {

      section.scrollIntoView({
        behavior: 'smooth'
      });

    }

  }, 100);

}

  leads: any[] = [];
  counselors: any[] = [];
  filteredLeads: any[] = [];
  groupedLeads: any[] = [];

  todayLeads = 0;
  searchText = '';

  selectedStatus = 'All Leads';
  showCounselors = false;

statusCards = [
  'All Leads',
  'New Lead',
  'Contacted',
  'Interested',
  'Call Back',
  'Admission In Progress',
  'Counselor Assigned',
  'Converted',
  'Not Interested',
  'Fake Lead'
];

  constructor(
    private firestore: Firestore,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const leadsCollection = collection(this.firestore, 'student_leads');
    const counselorsCollection = collection(this.firestore, 'counselors');

collectionData(counselorsCollection, { idField: 'id' }).subscribe((data: any) => {
  this.counselors = data;
});

    collectionData(leadsCollection, { idField: 'id' }).subscribe((data: any) => {

      this.leads = data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      this.filteredLeads = this.leads;

      const today = new Date().toDateString();

this.todayLeads = this.leads.filter((lead: any) => {

  if (!lead.createdAt || !lead.createdAt.seconds) {
    return false;
  }

  const leadDate = new Date(
    lead.createdAt.seconds * 1000
  ).toDateString();

  return leadDate === today;

}).length;

      this.makeGroups();
      this.cdr.detectChanges();
    });
  }

  searchLeads() {
    
    const text = this.searchText.toLowerCase();

    this.filteredLeads = this.leads.filter((lead: any) => {
      return (
        lead.name?.toLowerCase().includes(text) ||
        lead.mobile?.includes(text) ||
        lead.cityState?.toLowerCase().includes(text)
      );
    });

    this.makeGroups();
  }

 filterByStatus(status: string) {

  this.showCounselors = false;

  this.selectedStatus = status;

  if (status === 'All Leads') {
    this.filteredLeads = this.leads;
  } else {
    this.filteredLeads = this.leads.filter((lead: any) =>
      lead.status === status
    );
  }

  this.makeGroups();

  setTimeout(() => {
    this.scrollToTable();
  }, 100);

}

getStatusCount(status: string) {

  if (status === 'All Leads') {
    return this.leads.length;
  }

  return this.leads.filter((lead: any) =>
    lead.status === status
  ).length;

}

 makeGroups() {
  const tempGroups: any = {};

  this.filteredLeads.forEach((lead: any) => {
    let dateKey = 'Unknown Date';

    if (lead.createdAt?.seconds) {
      const d = new Date(lead.createdAt.seconds * 1000);
      dateKey = d.toDateString();
    }

    if (!tempGroups[dateKey]) {
      tempGroups[dateKey] = {
        date: dateKey,
        leads: []
      };
    }

    tempGroups[dateKey].leads.push(lead);
  });

  this.groupedLeads = Object.values(tempGroups);
}

 async updateStatus(lead: any) {
  const leadDoc = doc(this.firestore, `student_leads/${lead.id}`);

  await updateDoc(leadDoc, {
    status: lead.status
  });
}

async updateRemark(lead: any) {
  const leadDoc = doc(this.firestore, `student_leads/${lead.id}`);

  await updateDoc(leadDoc, {
    remark: lead.remark || ''
  });
}

async updateCallback(lead: any) {
  const leadDoc = doc(this.firestore, `student_leads/${lead.id}`);

  await updateDoc(leadDoc, {
    callbackDate: lead.callbackDate || ''
  });
}

}
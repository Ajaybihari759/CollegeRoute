import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Firestore,
  collection,
  collectionData
} from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {

  leads: any[] = [];
  filteredLeads: any[] = [];
  groupedLeads: any[] = [];

  todayLeads = 0;
  searchText = '';

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    const leadsCollection = collection(this.firestore, 'student_leads');

    collectionData(leadsCollection, { idField: 'id' }).subscribe((data: any) => {
      console.log('Firebase Leads:', data);

      this.leads = data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      this.filteredLeads = this.leads;

      const today = new Date().toDateString();

      this.todayLeads = this.leads.filter((lead: any) => {
        if (!lead.createdAt) return false;
        return lead.createdAt.toDate().toDateString() === today;
      }).length;

      this.makeGroups();
    });
  }

  searchLeads() {
    const text = this.searchText.toLowerCase();

    this.filteredLeads = this.leads.filter((lead: any) =>
      lead.name?.toLowerCase().includes(text) ||
      lead.mobile?.includes(text) ||
      lead.cityState?.toLowerCase().includes(text)
    );

    this.makeGroups();
  }

  makeGroups() {
    this.groupedLeads = [];

    this.filteredLeads.forEach((lead: any) => {
      const date = lead.createdAt
        ? lead.createdAt.toDate().toDateString()
        : 'Unknown Date';

      let group = this.groupedLeads.find((g: any) => g.date === date);

      if (!group) {
        group = { date, leads: [] };
        this.groupedLeads.push(group);
      }

      group.leads.push(lead);
    });
  }
}
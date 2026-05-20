import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Firestore,
  collection,
  collectionData
} from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})

export class AdminComponent implements OnInit {

  leads: any[] = [];
  groupedLeads: any[] = [];
  todayLeads = 0;

  constructor(private firestore: Firestore){}

  ngOnInit(): void {

    const leadsCollection = collection(
      this.firestore,
      'student_leads'
    );

    collectionData(leadsCollection, {
      idField: 'id'
    }).subscribe((data: any) => {

      this.leads = data;
      this.groupedLeads = [];

this.leads.forEach((lead: any) => {
  const date = lead.createdAt
    ? lead.createdAt.toDate().toDateString()
    : 'Unknown Date';

  let group = this.groupedLeads.find((g: any) => g.date === date);

  if (!group) {
    group = {
      date: date,
      leads: []
    };

    this.groupedLeads.push(group);
  }

  group.leads.push(lead);
});
      const today = new Date().toDateString();

this.todayLeads = this.leads.filter((lead: any) => {

  if (!lead.createdAt) return false;

  const leadDate = lead.createdAt.toDate().toDateString();

  return leadDate === today;

}).length;

      console.log(this.leads);

    });

  }

}
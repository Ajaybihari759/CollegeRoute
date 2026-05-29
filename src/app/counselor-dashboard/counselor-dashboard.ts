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
  selector: 'app-counselor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './counselor-dashboard.html',
  styleUrls: ['./counselor-dashboard.scss']
})
export class CounselorDashboard implements OnInit {

  leads: any[] = [];
  filteredLeads: any[] = [];

   selectedLead: any = null;

openLeadDetails(lead: any) {
  this.selectedLead = lead;
}

closeLeadDetails() {
  this.selectedLead = null;
}

  searchTerm = '';
  activeFilter = 'All';

  todayLeads = 0;

 constructor(
  private firestore: Firestore,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    const leadsRef = collection(this.firestore, 'student_leads');

    collectionData(leadsRef, { idField: 'id' }).subscribe((data: any[]) => {

      this.leads = data.map((lead: any) => ({
        ...lead,
        admissionStatus: lead.admissionStatus || 'Not Started'
      }));

      this.leads.sort((a: any, b: any) => {
        return this.getLeadTime(b) - this.getLeadTime(a);
      });

      this.todayLeads = this.leads.filter((lead: any) =>
        this.isTodayLead(lead)
      ).length;

      this.filterTable(this.activeFilter);

      this.cdr.detectChanges();

    });
  }

  getLeadTime(lead: any): number {
    if (lead.createdAt?.seconds) {
      return lead.createdAt.seconds * 1000;
    }

    if (lead.createdAt) {
      return new Date(lead.createdAt).getTime();
    }

    return 0;
  }

  isTodayLead(lead: any): boolean {
    const time = this.getLeadTime(lead);
    if (!time) return false;

    const leadDate = new Date(time);
    const today = new Date();

    return (
      leadDate.getDate() === today.getDate() &&
      leadDate.getMonth() === today.getMonth() &&
      leadDate.getFullYear() === today.getFullYear()
    );
  }

  filterTable(type: string) {
    this.activeFilter = type;

    if (type === 'All') {
      this.filteredLeads = [...this.leads];
      return;
    }

    if (type === 'Today') {
      this.filteredLeads = this.leads.filter((lead: any) =>
        this.isTodayLead(lead)
      );
      return;
    }

    this.filteredLeads = this.leads.filter((lead: any) =>
      (lead.admissionStatus || 'Not Started') === type
    );
  }

  searchLead() {
    const term = this.searchTerm.toLowerCase();

    this.filteredLeads = this.leads.filter((lead: any) =>
      lead.name?.toLowerCase().includes(term) ||
      lead.email?.toLowerCase().includes(term) ||
      lead.mobile?.includes(term) ||
      lead.city?.toLowerCase().includes(term) ||
      lead.state?.toLowerCase().includes(term)
    );
  }

  getStatusCount(status: string) {
    return this.leads.filter((lead: any) =>
      (lead.admissionStatus || 'Not Started') === status
    ).length;
  }

  async updateLeadStatus(lead: any) {
  if (!lead.id) return;

  const leadRef = doc(this.firestore, 'student_leads', lead.id);

  await updateDoc(leadRef, {
    admissionStatus: lead.admissionStatus,
    remark: lead.remark || ''
  });
}

  getStatusClass(status: string) {
    if (status === 'Converted') return 'status-converted';
    if (status === 'Admission In Progress') return 'status-progress';
    if (status === 'Contacted') return 'status-contacted';
    if (status === 'Call Back') return 'status-callback';
    if (status === 'Interested') return 'status-interested';
    if (status === 'Not Interested') return 'status-not-interested';

    return 'status-default';
  }

  async updateLeadRemark(lead: any) {
  if (!lead.id) return;

  const leadRef = doc(this.firestore, 'student_leads', lead.id);

  await updateDoc(leadRef, {
    remark: lead.remark || ''
  });
}

exportExcel() {
  const dataToExport = this.filteredLeads;

  if (!dataToExport.length) {
    alert('No data available to export');
    return;
  }

  const headers = [
    'Name',
    'Email',
    'Mobile',
    'State',
    'City',
    'Level',
    'Course',
    'Status',
    'Remark'
  ];

  const rows = dataToExport.map((lead: any) => [
    lead.name || '',
    lead.email || '',
    lead.mobile || '',
    lead.state || '',
    lead.city || '',
    lead.level || '',
    lead.course || '',
    lead.admissionStatus || 'Not Started',
    lead.remark || ''
  ]);

  const csvContent =
    [headers, ...rows]
      .map(row => row.map(value => `"${value}"`).join(','))
      .join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${this.activeFilter || 'leads'}-leads.csv`;
  link.click();
}

}
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
   selectedStatus = 'All';

  counselorName = 'Ajay Kumar';

 constructor(
  private firestore: Firestore,
  private ngZone: NgZone
) {}
  ngOnInit(): void {

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
  } else {
   this.filteredLeads = [...this.leads.filter((lead: any) =>
  lead.status === status
)];
  }

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
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EntryService } from '../services/entry';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-entry.html',
  styleUrls: ['./add-entry.css']
})
export class AddEntry implements OnInit {

  date!: string;

  songTitle: string = '';
  artist: string = '';
  entryText: string = '';

  constructor(
    private route: ActivatedRoute,
    private entryService: EntryService,
    private router: Router
  ) {}

ngOnInit(): void {
  const routeDate = this.route.snapshot.paramMap.get('date');
  this.date = routeDate ?? new Date().toISOString().split('T')[0];
}




  saveEntry(): void {
 const payload = {
    date: this.date,
    songTitle: this.songTitle,
    artist: this.artist,
    entryText: this.entryText
  };

  console.log('SENDING ENTRY:', payload);

  this.entryService.createEntry(payload).subscribe({
    next: res => {
      console.log('ENTRY SAVED:', res);
      this.router.navigate(['/calendar']);
    },
    error: err => {
      console.error('SAVE FAILED:', err);
    }
  });




  }
}



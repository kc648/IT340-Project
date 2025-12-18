import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EntryService } from '../services/entry';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogService } from '../services/log';

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
    private router: Router,
    private log: LogService
  ) {}

ngOnInit(): void {
  const routeDate = this.route.snapshot.queryParamMap.get('date');
  this.date = routeDate ?? this.getLocalDate();
}

getLocalDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
      this.log.log('CREATED_ENTRY', {date: this.date});
      console.log('ENTRY SAVED:', res);
      this.router.navigate(['/archive'], { queryParams: { date: this.date } } 
      );
    },
    error: err => {
      this.log.log('FAILED_TO_CREATE_ENTRY');
      console.error('SAVE FAILED:', err);
    }
  });




  }
}



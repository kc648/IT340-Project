import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EntryService } from '../services/entry';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './archive.html',
  styleUrls: ['./archive.css']
})
export class Archive implements OnInit {

  entries: any[] = [];
  selectedDate: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private entryService: EntryService
  ) {}

  ngOnInit(): void {
    this.selectedDate = this.route.snapshot.queryParamMap.get('date');

    if (this.selectedDate) {
      this.loadEntriesForDate(this.selectedDate);
    } else {
      this.loadAllEntries();
    }
  }

  loadEntriesForDate(date: string): void {
    this.entryService.getEntries().subscribe(entries => {
      this.entries = entries.filter(
        e => e.date.split('T')[0] === date
      );
    });
  }

  loadAllEntries(): void {
    this.entryService.getEntries().subscribe(entries => {
      this.entries = entries;
    });
  }
}



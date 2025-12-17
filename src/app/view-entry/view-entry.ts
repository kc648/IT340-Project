import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EntryService } from '../services/entry';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-entry',
  imports: [RouterModule, CommonModule],
  templateUrl: './view-entry.html',
  styleUrl: './view-entry.css',
})
export class ViewEntry implements OnInit {
  entry: any;
  entryId!: string;

  constructor(
    private route: ActivatedRoute,
    private entryService: EntryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.entryId = this.route.snapshot.paramMap.get('id')!;

    this.entryService.getEntryById(this.entryId).subscribe({
      next: (data:any) => this.entry = data,
      error: (err:any) => console.error(err)
    });
  }

  deleteEntry(): void {
    if(!this.entry?._id) return;

    const confirmed = confirm('Are you sure you want to delete this entry? This action cannot be undone.');

    if(!confirmed) return;

    this.entryService.deleteEntry(this.entryId).subscribe({
      next: () => {
        this.router.navigate(['/archive']);
      },
      error: (err) => console.error(err),
    });
  }
}


import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
    private entryService: EntryService
  ) {}

  ngOnInit(): void {
    this.entryId = this.route.snapshot.paramMap.get('id')!;

    this.entryService.getEntryById(this.entryId).subscribe({
      next: (data:any) => this.entry = data,
      error: (err:any) => console.error(err)
    });
  }

}

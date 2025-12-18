import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { EntryService } from '../services/entry';
import { CommonModule } from '@angular/common';
import { LogService } from '../services/log';

@Component({
  selector: 'app-view-entry',
  imports: [RouterModule, CommonModule],
  templateUrl: './view-entry.html',
  styleUrl: './view-entry.css',
})
export class ViewEntry implements OnInit {
  entry: any;
  entryId!: string;
  returnTo: string = '/archive';

  constructor(
    private route: ActivatedRoute,
    private entryService: EntryService,
    private router: Router,
    private log: LogService
  ) {}

  ngOnInit(): void {
    this.entryId = this.route.snapshot.paramMap.get('id')!;

    const returnParam = this.route.snapshot.queryParamMap.get('returnTo');
    if(returnParam) {
      this.returnTo = returnParam;
    }

    this.entryService.getEntryById(this.entryId).subscribe({
      next: (data:any) => this.entry = data,
      error: (err:any) => console.error(err)
    });
  }

deleteEntry(): void {
  if (!this.entry?._id) return;

  const confirmed = confirm(
    'Are you sure you want to delete this entry? This action cannot be undone.'
  );
  if (!confirmed) return;

  this.entryService.deleteEntry(this.entryId).subscribe({
    next: () => {
      this.log.log('ENTRY_DELETE', { entryId: this.entryId });
      this.router.navigate(['/archive']);
    },
    error: (err) => {
      this.log.log('FAILED_TO_DELETE_ENTRY', { entryId: this.entryId });
      console.error(err);
    }
  });
}




  goBack(): void {
    this.router.navigateByUrl(this.returnTo);
  }
}


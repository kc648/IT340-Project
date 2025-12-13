import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntryService } from '../services/entry'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-archive',
  imports: [RouterModule, CommonModule],
  templateUrl: './archive.html',
  styleUrl: './archive.css',
})
export class Archive implements OnInit {
  
  entries: any[] = [];

  constructor(private entryService: EntryService) {}

  ngOnInit(): void {
    this.entryService.getEntries().subscribe({
      next: (data: any) => {
        this.entries = data;
        console.log(this.entries);
      },
      error: (err: any) => console.error(err)
    });
  }
}

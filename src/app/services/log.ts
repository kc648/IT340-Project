import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private api = 'http://192.168.10.40:4000/api/log';

  constructor(private http: HttpClient) {}

  log(event: string, metadata: any = {}): void {
    console.log('LOG SERVICE CALLED:', event, metadata);

    const userId = localStorage.getItem('userId');

    this.http.post(this.api, {
      event,
      source: 'frontend',
      userId,
      metadata
    }).subscribe({
      next: () => console.log('LOG SENT'),
      error: (err) => console.error('LOG FAILED', err)
    });
  }
}




import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private apiUrl = 'http://192.168.10.40:3000/api/entries';

  constructor(private http: HttpClient) {}

  createEntry(entry: any) {
    return this.http.post(
      this.apiUrl,
      entry,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

deleteEntry(id: string) {
  return this.http.delete(
    `http://192.168.10.40:3000/api/entries/${id}`
  );
}

  getEntries() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getEntryById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

}



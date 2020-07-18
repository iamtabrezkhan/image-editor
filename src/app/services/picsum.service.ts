import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const PICSUM_URL = 'https://picsum.photos/v2/list';

@Injectable({
  providedIn: 'root',
})
export class PicsumService {
  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 10) {
    const url = `${PICSUM_URL}?page=${page}&limit=${limit}`;
    return this.http.get(url);
  }
}

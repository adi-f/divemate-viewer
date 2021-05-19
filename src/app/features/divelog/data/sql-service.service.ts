import { Injectable } from '@angular/core';
import {Database} from 'sql.js';
import {HttpClient} from '@angular/common/http';
import { loadavg } from 'os';

@Injectable({
  providedIn: 'root'
})
export class SqlServiceService {

private db: Database;

  constructor(private httpClient: HttpClient) { }
  

  load(): Promise<this> {
    return this.httpClient.get('data/DiveMate.ddb', {responseType: 'arraybuffer'})
    .toPromise()
    .then(arraybuffer => new Uint8Array(arraybuffer))
    .then(array => this.db = new Database(array))
    .then (() => this);
  }
}

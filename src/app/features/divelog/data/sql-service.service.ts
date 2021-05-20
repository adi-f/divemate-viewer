
(window as any).require = () => ({});
import { Injectable } from '@angular/core';
import {Database, SqlJsStatic} from 'sql.js';
import {HttpClient} from '@angular/common/http';
import { Dive } from '../model';

@Injectable({
  providedIn: 'root'
})
export class SqlService {

private db: Database = null as any;

  constructor(private httpClient: HttpClient) { }
  


  async readAllDives(): Promise<Dive[]> {
    return await this.read(
      "select Number, Divedate, Place from Logbook order by Number desc",
      column => ({
        number: column[0],
        date: column[1],
        location: column[2]
      })
    );
  }

  private async read<T>(sqlQuery: string, mapper: (row: any[]) => T): Promise<T[]> {
    await this.checkDb();
    return this.db.exec(sqlQuery)[0].values.map(row => mapper(row))
  }

  private async checkDb(): Promise<void> {
    if(!this.db) {
      await this.load();
    }
  }

  private async load(): Promise<void> {
    if(!(window as any).initSqlJs) {
      await this.includeSqlJs();
    }
    const sql: SqlJsStatic = await (window as any).initSqlJs({locateFile: (file: string) => `/assets/sql-js/${file}`});
    const data: ArrayBuffer = await this.httpClient.get('data/DiveMate.ddb', {responseType: 'arraybuffer'}).toPromise();
    this.db = new sql.Database(new Uint8Array(data));
  }

  private includeSqlJs(): Promise<void> {
    // unfortunately, Sql.js fails loading as a module...
    const script: HTMLScriptElement = document.createElement('script');
    const scriptLoaded:Promise<any> = new Promise(resolve => script.onload = resolve);
    script.setAttribute('src','/assets/sql-js/sql-wasm.js')
    document.head.appendChild(script);
    return scriptLoaded;
  }
}

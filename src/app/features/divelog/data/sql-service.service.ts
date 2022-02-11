
(window as any).require = () => ({});
import { Injectable } from '@angular/core';
import {Database, SqlJsStatic} from 'sql.js';
import {HttpClient} from '@angular/common/http';
import { Dive } from '../model';
import { CacheService } from 'src/app/shared/cache/cache.service';

const enum DiveStatus {
  MANUAL = 0,
  IMPORTED = 1,
  DELETED = 2
}

@Injectable({
  providedIn: 'root'
})
export class SqlService {

  private sqlJs: SqlJsStatic = null as any
  private db: Database = null as any;

  constructor(private cacheService: CacheService) { }

  async readAllDives(): Promise<Dive[]> {
    return await this.read(
      `select Number, Divedate, Place, Divetime from Logbook where Status <> ${DiveStatus.DELETED} order by Number desc`,
      column => ({
        number: column[0],
        date: column[1],
        location: column[2],
        durationMinutes: column[3]
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

  private async checkSqlJs(): Promise<void> {
    if(!this.sqlJs) {
      await this.initSqlJs();
    }
  }

  private async initSqlJs(): Promise<void> {
    if(!(window as any).initSqlJs) {
      await this.includeSqlJs();
    }
    this.sqlJs = await (window as any).initSqlJs({locateFile: (file: string) => `/assets/sql-js/${file}`});
  }

  private async load(): Promise<void> {
    await this.checkSqlJs();
    const data: ArrayBuffer = await this.cacheService.readDivelog();
    this.db = new this.sqlJs.Database(new Uint8Array(data));
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


(window as any).require = () => ({});
import { Injectable } from '@angular/core';
import {Database, SqlJsStatic} from 'sql.js';
import { Buddy, CountStat, Dive, DivesByCountry, DiveSiteStat, Equipment, Tank } from '../model';
import { CacheService } from 'src/app/shared/cache/cache.service';
import { Observable, map } from 'rxjs';

const SAFE_SQL_STRING_LITERAL = /^\w*$/;

const enum DiveStatus {
  MANUAL = 0,
  IMPORTED = 1,
  DELETED = 2
}

export const enum StatColumns {
  DECO = 'Deco',
  ENTRY = 'Entry',
  SALINITY = 'Water'
}

export const enum Decompression {
  ZERO_TIME = 0,
  DECOMPRESSION = 1
}

export const enum Entry {
  SHORE = 1,
  BOAT = 2
}

export const enum Salinity {
  SALT = 1,
  FRESH = 2,
  BRACKISH = 3 // <- unproofed guess
}

export const enum EquipmentType {
  EQUIPMENT = 0,
  TANK = 11,
  COMPUTER = 17
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
      `select Number, Divedate, Place, Divetime, Depth from Logbook where Status <> ${DiveStatus.DELETED} order by Number desc`,
      column => ({
        number: column[0],
        date: column[1],
        location: column[2],
        durationMinutes: column[3],
        depthMeters: column[4]
      })
    );
  }

  async readDiveSitesGroupedByDiveCount(): Promise<DiveSiteStat[]> {
    return await this.read(
      `select PlaceID, Place, Country, count(PlaceID) as Count from Logbook where Status <> ${DiveStatus.DELETED} group by PlaceID order by count(PlaceID) desc`,
      column => ({
        id: column[0],
        name: column[1],
        country: column[2],
        count: column[3]
      })
    );
  }

  async readDivesGroupedByCountry(): Promise<DivesByCountry[]> {
    return await this.read(
      `select Country, count(Country) as Count from Logbook where Status <> ${DiveStatus.DELETED} group by Country order by count(Country) desc`,
      column => ({
        country: column[0],
        count: column[1]
      })
    );
  }

  async countAllDives(): Promise<number> {
    const resultAsList =  await this.read(`select count(*) from Logbook where Status <> ${DiveStatus.DELETED}`,
      column => column[0]
    );
    return resultAsList[0];
  }

  async countBy(columnName: string, value: any): Promise<number> {
    const resultAsList =  await this.read(`select count(*) from Logbook where Status <> ${DiveStatus.DELETED} and ${this.sanitizeColumnName(columnName)} = ${this.sanitizeValue(value)}`,
      column => column[0]
    );
    return resultAsList[0];
  }

  async readDivesByBuddyRawIds(): Promise<CountStat[]> {
    return await this.read(
      `select BuddyIDs, count(*) as count from Logbook where BuddyIDs is not null and BuddyIDs <> '' and Status <> ${DiveStatus.DELETED} group by BuddyIDs`,
      column => ({
        description: column[0],
        count: column[1]
      })
    );
  }

  async readDivesByRawBuddyNames(): Promise<CountStat[]> {
    return await this.read(
      `select Buddy, count(*) as count from Logbook where Buddy is not null and Buddy <> '' and Status <> ${DiveStatus.DELETED} group by Buddy`,
      column => ({
        description: column[0],
        count: column[1]
      })
    );
  }
  
  async readDivesByRawMasterNames(): Promise<CountStat[]> {
    return await this.read(
      `select Divemaster, count(*) as count from Logbook where Divemaster is not null and Divemaster <> '' and Status <> ${DiveStatus.DELETED} group by Divemaster`,
      column => ({
        description: column[0],
        count: column[1]
      })
    );
  }

  async readBuddies(ids: number[]): Promise<Buddy[]> {
    const idString: string = ids.filter(id => typeof id === 'number').join(',')
    return await this.read(
      `select ID, FirstName, LastName from Buddy where ID in(${idString})`,
      column => ({
        id: column[0],
        firstName: column[1],
        lastName: column[2],
      })
    );
  }

  async readAllDivesWithProfileAndTanks(): Promise<number[]> {
    return await this.read(
      `select l.id from Logbook l
         where l.Status <> ${DiveStatus.DELETED}
         and l.ProfileInt is not null
         and l.Profile is not null
         and 0 < (select count(*) from Tank t where l.ID = t.LogID and PresS > PresE and Tanksize > 0)
      `,
      column => column[0]);
  }

  async readDiveProfile(logbookId: number): Promise<DiveProfile> {
    return (await this.read(
      `select ProfileInt, Profile from Logbook where ID = ${logbookId}`,
      column => ({
        intervalSeconds: column[0], 
        rawProfile: column[1]
      })))[0];
  }

  async readTanksOfDive(logbookId: number): Promise<Tank[]> {
    return await this.read(
      `select PresS, PresE, Tanksize from Tank where LogID = ${logbookId}`,
      column => ({
        pressureStartBar: column[0], 
        pressureEndBar: column[1],
        sizeLiter: column[2],
      }));
  }

  readAllDivesForRecordsLayz(): Observable<DiveWithDecoProfile> {
    return this.readLazy(`
    select Number, Divedate, Place, Divetime, Depth, Deco, Profile4
      from Logbook where Status <> ${DiveStatus.DELETED}
      order by Number asc`)
    .pipe(map( dive => ({
      number: dive.Number as number,
      date: dive.Divedate as string,
      location: dive.Place as string,
      durationMinutes: dive.Divetime as number,
      depthMeters: dive.Depth as number,
      isDeco: dive.Deco === Decompression.DECOMPRESSION,
      profile4: dive.Profile4 as string || null
    })))
  }

  async readAllEquipment(): Promise<Equipment[]> {
    return await this.read(`
    select ID, Object
      from Equipment
      where TypeID=${EquipmentType.EQUIPMENT}
      order by Object`,
    column => ({
      id: column[0], 
      name: column[1]
    }));
  }

  async readTotalDiveCountByEquipment(equipmentId: number): Promise<number> {
    // TODO: warn: works only with max one assigned equipment (maybe UsedEquip is a list)
    return (await this.read(`
    select count (*)
      from Logbook
      where UsedEquip = ${equipmentId}
      and Status <> 2`,
    column => column[0]))[0];
  }

  async readTotalDiveTimeMinutesByEquipment(equipmentId: number): Promise<number> {
    // TODO: warn: works only with max one assigned equipment (maybe UsedEquip is a list)
    return (await this.read(`
    select sum (Divetime)
      from Logbook
      where UsedEquip = ${equipmentId}
      and Status <> 2`,
    column => column[0]))[0];
  }

  private async read<T>(sqlQuery: string, mapper: (row: any[]) => T): Promise<T[]> {
    await this.checkDb();
    return this.db.exec(sqlQuery)[0].values.map(row => mapper(row))
  }

  private readLazy<T>(sqlQuery: string): Observable<Record<string, number | string | Uint8Array | null>> {
    return new Observable(subscriber => {
      this.checkDb().then(() =>  this.db.each(
          sqlQuery,
          (result: Record<string, number | string | Uint8Array | null>) => subscriber.next(result),
          () => subscriber.complete()
          ));
        });
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


  private sanitizeColumnName(name: string): string {
    if(typeof name === 'string' && SAFE_SQL_STRING_LITERAL.test(name)) {
      return '"' + name + '"';
    } else {
      throw 'String not save for SQL: ' + name;
    }
  }

  private sanitizeValue<T = string|number>(value: T): T {
    if(typeof value === 'number') {
      return value;
    } else {
      const valueAsString = String(value);
      if(!SAFE_SQL_STRING_LITERAL.test(valueAsString)) {
        throw 'String not save for SQL: ' + valueAsString;
      }
      return "'" + valueAsString + "'"  as unknown as T;
    }
  }
}

export interface DiveProfile {
    rawProfile: string,
    intervalSeconds: number
}

export interface DiveWithDecoProfile extends Dive {
  isDeco: boolean;
  profile4: string|null;
}

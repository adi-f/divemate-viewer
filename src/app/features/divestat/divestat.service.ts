import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from 'src/app/shared/config/config.service';
import { Decompression, Entry, Salinity, SqlService, StatColumns } from 'src/app/shared/data/sql-service.service';
import { CountStat, DiveSiteStat } from 'src/app/shared/model';

@Injectable({
  providedIn: 'root'
})
export class DivestatService {

  logReady$: Observable<boolean>;

  constructor(private sqlService: SqlService, private configService: ConfigService) {
    this.logReady$ = configService.divelogCachedAt$.pipe(map(cacheDate => !!cacheDate))
  }

  readDiveSiteStats(): Promise<DiveSiteStat[]> {
    return this.sqlService.readDiveSitesGroupedByDiveCount();
  }

  async readAllCountStats(): Promise<CountStat[]> {
    const counts = [
      {description: 'Decompression dives', read: () => this.readDecoDiveCount()},
      {description: 'Dives entered by shore', read: () => this.readShoreDiveCount()},
      {description: 'Dives entered by boat', read: () => this.readBoadDiveCount()},
      {description: 'Dives in fresh water', read: () => this.readFreshwaterDiveCount()},
      {description: 'Dives in salt water', read: () => this.readSaltwaterDiveCount()},
      
    ];

    const allResults = await Promise.all(counts.map(count => count.read()));

    return allResults.map((result: number, index: number) => ({
      description: counts[index].description,
      count: result
    }));
  }
  
  private readDecoDiveCount(): Promise<number> {
    return this.sqlService.countBy(StatColumns.DECO, Decompression.DECOMPRESSION);
  }

  private readShoreDiveCount(): Promise<number> {
    return this.sqlService.countBy(StatColumns.ENTRY, Entry.SHORE);
  }

  private readBoadDiveCount(): Promise<number> {
    return this.sqlService.countBy(StatColumns.ENTRY, Entry.BOAT);
  }

  private readFreshwaterDiveCount(): Promise<number> {
    return this.sqlService.countBy(StatColumns.SALINITY, Salinity.FRESH);
  }

  private readSaltwaterDiveCount(): Promise<number> {
    return this.sqlService.countBy(StatColumns.SALINITY, Salinity.SALT);
  }
}

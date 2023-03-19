import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from 'src/app/shared/config/config.service';
import { Decompression, Entry, Salinity, SqlService, StatColumns } from 'src/app/shared/data/sql-service.service';
import { DiveSiteStat } from 'src/app/shared/model';

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

  readDecoDiveCount(): Promise<number> {
    return this.sqlService.countBy(StatColumns.DECO, Decompression.DECOMPRESSION);
  }

  readShoreDiveCount(): Promise<number> {
    return this.sqlService.countBy(StatColumns.ENTRY, Entry.SHORE);
  }

  readBoadDiveCount(): Promise<number> {
    return this.sqlService.countBy(StatColumns.ENTRY, Entry.BOAT);
  }

  readFreshwaterDiveCount(): Promise<number> {
    return this.sqlService.countBy(StatColumns.SALINITY, Salinity.FRESH);
  }

  readSaltwaterDiveCount(): Promise<number> {
    return this.sqlService.countBy(StatColumns.SALINITY, Salinity.SALT);
  }
}

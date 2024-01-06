import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from 'src/app/shared/config/config.service';
import { Decompression, Entry, Salinity, SqlService, StatColumns } from 'src/app/shared/data/sql-service.service';
import { CountStat, DivesByCountry, DiveSiteStat } from 'src/app/shared/model';

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

  readDivesGroupedByCountry(): Promise<DivesByCountry[]> {
    return this.sqlService.readDivesGroupedByCountry();
  }

  async readAllCountStats(): Promise<CountStat[]> {
    const counts = [
      {description: 'Total number of dives', read: () => this.readTotalCount()},
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
  
  private readTotalCount(): Promise<number> {
    return this.sqlService.countAllDives();
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

  async readDivesByBuddy() {
    // buddies from list
    const rawBuddyIdStat: CountStat[] = await this.sqlService.readDivesByBuddyRawIds();
    const buddyIdStat: CountStat[] = this.normalizeCompactedStats(rawBuddyIdStat);
    const buddyIdsOfBuddyIdStat: number[] = this.extractBuddyIdsFromCountStatDescription(buddyIdStat)
    const buddyNamesById: Map<number, string> = await this.readBuddyNamesById(buddyIdsOfBuddyIdStat);
    const buddyIdNameResolvedStat = this.replaceIdWithName(buddyIdStat, buddyNamesById);

    // direct entered buddy names
    const rawBuddyNameStat: CountStat[] = await this.sqlService.readDivesByRawBuddyNames();
    const buddyNameStat: CountStat[] = this.normalizeCompactedStats(rawBuddyNameStat);

    // direct entered dive master names
    const rawDiveMasterNameStat: CountStat[] = await this.sqlService.readDivesByRawMasterNames();
    const buddyDiveMasterStat: CountStat[] = this.normalizeCompactedStats(rawDiveMasterNameStat);
    
    return this.merge(buddyIdNameResolvedStat, buddyNameStat, buddyDiveMasterStat);
  }

  private normalizeCompactedStats(compactedStat: CountStat[]): CountStat[] {
    const normalizedStats: Map<string, number> = new Map();
    for(const entry of compactedStat) {
      const keys = entry.description.split(/,|\n/).map(key => key.trim()).filter(key => !!key);
      for(const key of keys) {
        const newCount = (normalizedStats.get(key) || 0) + entry.count;
        normalizedStats.set(key, newCount);
      }
    }
    const result: CountStat[] = [];
    for(const [description, count] of normalizedStats.entries()) {
      result.push({
        description,
        count
      });
    }
    return result;
  }

  private extractBuddyIdsFromCountStatDescription(buddyIdStats: CountStat[]): number[] {
    const ids = new Set<number>();
    for(let buddyIdStat of buddyIdStats) {
      ids.add(parseInt(buddyIdStat.description, 10));
    }
    return [...ids];
  }

  private async readBuddyNamesById(buddyIdsOfBuddyIdStat: number[]): Promise<Map<number, string>> {
    const buddies = await this.sqlService.readBuddies(buddyIdsOfBuddyIdStat);
    const buddyNamesById = new Map<number, string>();
    for(let buddy of buddies) {
      const buddyName = (buddy.firstName + ' ' + buddy.lastName).trim();
      buddyNamesById.set(buddy.id, buddyName)
    }
    return buddyNamesById;
  }

  private replaceIdWithName(buddyIdStats: CountStat[], buddyNamesById: Map<number, string>): CountStat[] {
    return buddyIdStats.map( buddyIdStat => ({
      description: buddyNamesById.get(parseInt(buddyIdStat.description, 10)) || '<unknown>',
      count: buddyIdStat.count
    }));
  }

  private merge(...statistics: CountStat[][]): CountStat[]  {
    const resultingMap = new Map<string, number>();
    for(let stats of statistics) {
      for(let stat of stats) {
        resultingMap.set(
          stat.description,
          stat.count + (resultingMap.get(stat.description) || 0)
        )
      }
    }
    return Array.from(resultingMap, ([key, value])=> ({
      description: key,
      count: value
    })).sort((a, b) => b.count - a.count);
  }
}

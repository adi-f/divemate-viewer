import { Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { ConfigService } from 'src/app/shared/config/config.service';
import { Decompression, DiveWithDecoProfile, Entry, Salinity, SqlService, StatColumns } from 'src/app/shared/data/sql-service.service';
import { CountStat, DecoStat, Dive, DivesByCountry, DiveSiteStat, Equipment, EquipmentStat, Records } from 'src/app/shared/model';
import { DiveprofileService } from './specific/diveprofile-service';

@Injectable({
  providedIn: 'root'
})
export class DivestatService {

  logReady$: Observable<boolean>;

  constructor(private sqlService: SqlService, private configService: ConfigService, private diveprofileService: DiveprofileService) {
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

  async readRecords(): Promise<Records> {
    const diveprofileService = this.diveprofileService;

    return await lastValueFrom(this.sqlService.readAllDivesForRecordsLayz().pipe(
      map(toRecord),
      reduce(pickBest)
    ));

    function toRecord(dive: DiveWithDecoProfile): Records {
      const maxDeco: DecoStat | null = dive.isDeco && dive.profile4 && diveprofileService.getMaxDeco(dive.profile4) || null;
      const thisDive: Dive = {
        number: dive.number,
        date: dive.date,
        location: dive.location,
        durationMinutes: dive.durationMinutes,
        depthMeters: dive.depthMeters
      }
      return {
        maxDecoDepthMeter: maxDeco?.maxDecoDepthMeter || 0,
        maxDecoDepthDive: thisDive,
        maxDecoWaitMinutesAtDepth: maxDeco?.maxDecoWaitMinutesAtDepth || 0,
        maxDecoWaitAtDepthMeters: maxDeco?.maxDecoWaitAtDepthMeters || 0,
        maxDecoWaitDiveAtMaxDepth: thisDive,
        maxTimeToSurfaceMinutes: maxDeco?.maxTimeToSurfaceMinutes || 0,
        maxTimeToSurfaceDive: thisDive
      }
    }

    function pickBest(a: Records, b: Records): Records {
      let maxDecoDepthMeter: number;
      let maxDecoDepthDive: Dive;
      if(a.maxDecoDepthMeter < b.maxDecoDepthMeter) {
        maxDecoDepthMeter = b.maxDecoDepthMeter;
        maxDecoDepthDive = b.maxDecoDepthDive;
      } else {
        maxDecoDepthMeter = a.maxDecoDepthMeter;
        maxDecoDepthDive = a.maxDecoDepthDive;
      }

      let maxDecoWaitMinutesAtDepth: number;
      let maxDecoWaitAtDepthMeters: number;
      let maxDecoWaitDiveAtMaxDepth: Dive;
      if(a.maxDecoWaitMinutesAtDepth < b.maxDecoWaitMinutesAtDepth) {
        maxDecoWaitMinutesAtDepth = b.maxDecoWaitMinutesAtDepth;
        maxDecoWaitAtDepthMeters = b.maxDecoWaitAtDepthMeters;
        maxDecoWaitDiveAtMaxDepth = b.maxDecoWaitDiveAtMaxDepth;
      } else {
        maxDecoWaitMinutesAtDepth = a.maxDecoWaitMinutesAtDepth;
        maxDecoWaitAtDepthMeters = a.maxDecoWaitAtDepthMeters;
        maxDecoWaitDiveAtMaxDepth = a.maxDecoWaitDiveAtMaxDepth;
      }

      let maxTimeToSurfaceMinutes: number;
      let maxTimeToSurfaceDive: Dive;
      if(a.maxTimeToSurfaceMinutes < b.maxTimeToSurfaceMinutes) {
        maxTimeToSurfaceMinutes = b.maxTimeToSurfaceMinutes;
        maxTimeToSurfaceDive = b.maxTimeToSurfaceDive;
      } else {
        maxTimeToSurfaceMinutes = a.maxTimeToSurfaceMinutes;
        maxTimeToSurfaceDive = a.maxTimeToSurfaceDive;
      }

      return {
        maxDecoDepthMeter,
        maxDecoDepthDive,
        maxDecoWaitMinutesAtDepth,
        maxDecoWaitAtDepthMeters,
        maxDecoWaitDiveAtMaxDepth,
        maxTimeToSurfaceMinutes,
        maxTimeToSurfaceDive
      }
    }
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

  async readAllEquipment(): Promise<Equipment[]> {
    return this.sqlService.readAllEquipment();
  }

  async calculateEquipmentStat(equipmentId: number): Promise<EquipmentStat> {
    const numberOfDives = await this.sqlService.readTotalDiveCountByEquipment(equipmentId);
    const diveTimeInMinutes = await this.sqlService.readTotalDiveTimeMinutesByEquipment(equipmentId);

    const hours = Math.floor(diveTimeInMinutes/60);
    const minutes = Math.round(diveTimeInMinutes - hours*60);

    return {
      numberOfDives,
      diveTimeHours: hours,
      diveTimeMinutes: minutes
    }
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

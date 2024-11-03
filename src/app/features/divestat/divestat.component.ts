import { Component } from '@angular/core';
import { Observable, filter, switchMap, take } from 'rxjs';
import { CountStat, DivesByCountry, DiveSiteStat, Equipment, EquipmentStat, Histogram, HistogramMonthStat, HistogramYearStat, Record, Records } from 'src/app/shared/model';
import { DivestatService } from './divestat.service';
import { AmvService } from './specific/amv-service';
import { AvaregeDeptCalculationMode } from './specific/diveprofile-service';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

@Component({
  templateUrl: './divestat.component.html',
  styleUrls: ['./divestat.component.css']
})
export class DivestatComponent {
  readonly columnsDiveSiteStats = [
    'name', 'country', 'count'
  ];

  readonly columnsDivesByCountry = [
    'country', 'count'
  ];

  readonly columnsCountStats = [
    'description', 'count'
  ];

  readonly columnsBuddyStats = [
    'buddy', 'count'
  ];

  readonly columnsRecords = [
    'description', 'value', 'number', 'date', 'location'
  ];

  readonly columnsEquipmentStat = [
    'numberOfDives', 'totalDiveTime'
  ];

  readonly AvaregeDeptCalculationMode = AvaregeDeptCalculationMode;

  logReady$: Observable<boolean>;

  diveSiteStats: Promise<DiveSiteStat[]> = Promise.resolve([]);

  divesByCountry: Promise<DivesByCountry[]> = Promise.resolve([]);
  
  countStats: Promise<CountStat[]> = Promise.resolve([]);

  buddyStats: Promise<CountStat[]> = Promise.resolve([]);

  amv$: Promise<number> = Promise.resolve(0);

  amwCalculationMode: AvaregeDeptCalculationMode = AvaregeDeptCalculationMode.DONT_COUNT_SURFACE_TIME;

  equipment$: Observable<Equipment[]>;

  equipmentId: number|null = null;

  equipmentStat: Promise<EquipmentStat[]> = Promise.resolve([]);

  records: Promise<Record[]> = Promise.resolve([]);

  histogram : MatTreeFlatDataSource<Histogram, TreeEntry> = null as any;
  histogramTreeControl: FlatTreeControl<TreeEntry> = null as any;
  histogramIsExpandable = (index: number, entry: TreeEntry) => entry.expandable
  histogramTrackBy = (index: number, entry: TreeEntry) => entry.id;

  
  constructor(private divestatService: DivestatService, private amvService: AmvService) {
    this.logReady$ = this.divestatService.logReady$;
    this.equipment$ = this.logReady$.pipe(
      filter(status => status),
      take(1),
      switchMap(unused => this.divestatService.readAllEquipment())
      );

      ({histogram: this.histogram, histogramTreeControl: this.histogramTreeControl} = this.createHistogramDataSource());
      this.histogram.data = [];
  }

  calculateDiveSiteStats() {
    this.diveSiteStats = this.divestatService.readDiveSiteStats();
  }

  calculateDivesByCountry() {
    this.divesByCountry = this.divestatService.readDivesGroupedByCountry();
  }

  calculateCountStats() {
    this.countStats = this.divestatService.readAllCountStats();
  }

  calculateBuddyStats() {
    this.buddyStats = this.divestatService.readDivesByBuddy();
  }

  calculateAmv() {
    this.amv$ = this.amvService.calcutateAvarageAmvOverAllDives(this.amwCalculationMode as AvaregeDeptCalculationMode);
  }

  calculateEquipmentStat() {
    this.equipmentStat = this.divestatService.calculateEquipmentStat(this.equipmentId as number)
      .then(equipmentStat => [equipmentStat]);
  }

  calculateRecords() {
      this.records = this.divestatService.readRecords().then((records: Records) => {
        const recordsList: Record[] = [];
        if(records.maxDecoDepthMeter > 0) {
          recordsList.push({
            description: 'Deepest deco stop',
            value: records.maxDecoDepthMeter + 'm',
            ...records.maxDecoDepthDive
            
          });
        }

        if(records.maxDecoWaitMinutesAtDepth > 0) {
          recordsList.push({
            description: 'Longest deco stop wait time at level',
            value: records.maxDecoWaitMinutesAtDepth + 'min @ ' + records.maxDecoWaitAtDepthMeters + 'm',
            ...records.maxDecoWaitDiveAtMaxDepth
            
          });
        }

        if(records.maxTimeToSurfaceMinutes > 0) {
          recordsList.push({
            description: 'Longest TTS (time to surface)',
            value: records.maxTimeToSurfaceMinutes + 'min',
            ...records.maxTimeToSurfaceDive
            
          });
        }

        return recordsList;
      })
  }

  calculateHistogram() {
    this.divestatService.calculateHistogram().then((histogram: Histogram) => 
      this.histogram.data = histogram as any);
  }

  private createHistogramDataSource(): {histogram: MatTreeFlatDataSource<Histogram, TreeEntry, TreeEntry>,histogramTreeControl: FlatTreeControl<TreeEntry> } {
    function transformer(entry: any, level: number): TreeEntry {
      return {
        id: entry.month ?? entry.year,
        expandable: entry?.months?.length > 0,
        name: (entry.monthName ?? (entry.year + ''))
         + ` (${entry.count})`
         + (entry.isMax ? ' ⭐' :'')
         + (entry.isMaxOfYear ? ' ⭐' :'')
         + (entry.isMaxOfAll ? '⭐' :''),
        level: level,
      };
    }
    const treeFlattener = new MatTreeFlattener<Histogram, TreeEntry, TreeEntry>(
      transformer,
      entry => entry.level,
      entry => entry.expandable,
      entry => (entry as any).months,
    );

    const treeControl = new FlatTreeControl<TreeEntry>(
      entry => entry.level,
      entry => entry.expandable,
    )
    const dataSource = new MatTreeFlatDataSource<Histogram, TreeEntry, TreeEntry>(treeControl, treeFlattener);
    return {histogram: dataSource, histogramTreeControl: treeControl};
  }
}

interface TreeEntry {
  id: number;
  expandable: boolean,
  name: string,
  level: number
}

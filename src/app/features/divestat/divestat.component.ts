import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CountStat, DivesByCountry, DiveSiteStat } from 'src/app/shared/model';
import { DivestatService } from './divestat.service';
import { AmvService } from './specific/amv-service';
import { AvaregeDeptCalculationMode } from './specific/diveprofile-service';

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

  readonly AvaregeDeptCalculationMode = AvaregeDeptCalculationMode;

  logReady$: Observable<boolean>;

  diveSiteStats: Promise<DiveSiteStat[]> = Promise.resolve([]);

  divesByCountry: Promise<DivesByCountry[]> = Promise.resolve([]);
  
  countStats: Promise<CountStat[]> = Promise.resolve([]);

  buddyStats: Promise<CountStat[]> = Promise.resolve([]);

  amv$: Promise<number> = Promise.resolve(0);

  amwCalculationMode: AvaregeDeptCalculationMode = AvaregeDeptCalculationMode.DONT_COUNT_SURFACE_TIME;
  
  constructor(private divestatService: DivestatService, private amvService: AmvService) {
    this.logReady$ = this.divestatService.logReady$;
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

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CountStat, DivesByCountry, DiveSiteStat } from 'src/app/shared/model';
import { DivestatService } from './divestat.service';
import { AmvService } from './specific/amv-service';

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

  logReady$: Observable<boolean>;

  diveSiteStats: Promise<DiveSiteStat[]> = Promise.resolve([]);

  divesByCountry: Promise<DivesByCountry[]> = Promise.resolve([]);
  
  countStats: Promise<CountStat[]> = Promise.resolve([]);

  buddyStats: Promise<CountStat[]> = Promise.resolve([]);

  amv$: Promise<string> = Promise.resolve('');
  
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
    this.amv$ = this.amvService.calcutateAvarageAmvOverAllDives().then( amv => roundTo2Digits(amv) + ' l/min')

    function roundTo2Digits(num: number): number {
      return Math.round(num*100)/100;
    }
  }

}

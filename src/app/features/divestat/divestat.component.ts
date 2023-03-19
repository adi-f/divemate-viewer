import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CountStat, DiveSiteStat } from 'src/app/shared/model';
import { DivestatService } from './divestat.service';

@Component({
  templateUrl: './divestat.component.html',
  styleUrls: ['./divestat.component.css']
})
export class DivestatComponent {
  readonly columnsDiveSiteStats = [
    'name', 'country', 'count'
  ];

  readonly columnsCountStats = [
    'description', 'count'
  ];

  logReady$: Observable<boolean>;

  diveSiteStats: Promise<DiveSiteStat[]> = Promise.resolve([]);
  
  countStats: Promise<CountStat[]> = Promise.resolve([]);
  
  constructor(private divestatService: DivestatService) {
    this.logReady$ = this.divestatService.logReady$;
  }

  calculateDiveSiteStats() {
    this.diveSiteStats = this.divestatService.readDiveSiteStats();
  }

  calculateCountStats() {
    this.countStats = this.divestatService.readAllCountStats();
  }

}

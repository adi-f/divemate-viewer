import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DiveSiteStat } from 'src/app/shared/model';
import { DivestatService } from './divestat.service';

@Component({
  templateUrl: './divestat.component.html',
  styleUrls: ['./divelog.component.css']
})
export class DivestatComponent {
  readonly columnsDiveSiteStats = [
    'name', 'country', 'count'
  ];

  logReady$: Observable<boolean>;

  diveSiteStats: Promise<DiveSiteStat[]> = Promise.resolve([]);
  

  constructor(private divestatService: DivestatService) {
    this.logReady$ = this.divestatService.logReady$;
  }

  calculateDiveSiteStats() {
    this.diveSiteStats = this.divestatService.readDiveSiteStats();
  }

}

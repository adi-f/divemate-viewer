import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { ConfigService } from 'src/app/shared/config/config.service';
import { SqlService } from '../data/sql-service.service';
import { Dive } from '../model';

@Injectable({
  providedIn: 'root'
})
export class DivelogService {

  divelog$: Observable<Dive[]>
  
  constructor(sqlService: SqlService, configService: ConfigService) {
    this.divelog$ = configService.divelogCachedAt$.pipe(
      switchMap(divelogCachedAt => {
        if(divelogCachedAt) {
          return from(sqlService.readAllDives());
        } else {
          return of([]);
        }
      }),
      shareReplay(1)
    )
  }
}

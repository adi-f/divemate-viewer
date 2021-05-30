import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

const PREFIX = 'divemate-viewer-'

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  divelogCachedAt$: Subject<Date|null>;

  constructor() { 
    this.divelogCachedAt$ = new BehaviorSubject<Date|null>(this.getDivelogCachedAt());
  }

  setDivelogCachedAt(timestamp: Date): void {
    localStorage.setItem(PREFIX + 'divelogCachedAt', timestamp.toString())
    this.divelogCachedAt$.next(timestamp);
  }

  clearDivelogCachedAt(): void {
    localStorage.removeItem(PREFIX + 'divelogCachedAt');
    this.divelogCachedAt$.next(null);
  }

  private getDivelogCachedAt(): Date | null {
    const timestamp: string | null = localStorage.getItem(PREFIX + 'divelogCachedAt');
    return timestamp ? new Date(timestamp) : null;
  }
}

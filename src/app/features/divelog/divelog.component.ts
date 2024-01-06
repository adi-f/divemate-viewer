import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Dive } from 'src/app/shared/model';
import { DivelogService } from './divelog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  templateUrl: './divelog.component.html',
  styleUrls: ['./divelog.component.css']
})
export class DivelogComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly columns = [
    'number', 'date', 'location', 'durationMinutes', 'depthMeters'
  ];

  private destroy$ = new Subject<void>();
  dives = new MatTableDataSource<Dive>([]);

  constructor(private divelogService: DivelogService) { }

  @ViewChild(MatSort) sort: MatSort | null = null;

  ngAfterViewInit() {
    this.dives.sort = this.sort;
  }

  ngOnInit(): void {
    this.divelogService.divelog$.subscribe(dives => this.dives.data = dives) 
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

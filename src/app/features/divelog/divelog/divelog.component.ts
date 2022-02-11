import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SqlService } from '../data/sql-service.service';
import { Dive } from '../model';
import { DivelogService } from './divelog.service';

@Component({
  templateUrl: './divelog.component.html',
  styleUrls: ['./divelog.component.css']
})
export class DivelogComponent implements OnInit {
  readonly columns = [
    'number', 'date', 'location', 'duration'
  ];

  dives$?: Observable<Dive[]>;

  constructor(private divelogService: DivelogService) { }

  ngOnInit(): void {
    this.dives$ = this.divelogService.divelog$;
  }
}

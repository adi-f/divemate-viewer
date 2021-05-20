import { Component, OnInit } from '@angular/core';
import { SqlService } from '../data/sql-service.service';
import { Dive } from '../model';

@Component({
  templateUrl: './divelog.component.html',
  styleUrls: ['./divelog.component.css']
})
export class DivelogComponent implements OnInit {
  readonly columns = [
    'number', 'date', 'location'
  ];

  dives$?: Promise<Dive[]>;

  constructor(private sqlService: SqlService) { }

  ngOnInit(): void {
    this.dives$ = this.sqlService.readAllDives();
  }
}

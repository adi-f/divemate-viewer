import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './divelog.component.html',
  styleUrls: ['./divelog.component.css']
})
export class DivelogComponent implements OnInit {
  readonly columns = [
    'number', 'date', 'location'
  ];

  dives = [
    {
      number: 123,
      date: '2020-05-22',
      location: 'Tüscherz'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { Location } from './location';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  locations: Location[];
  selected: Location;

  ngOnInit(): void {
    this.locations = [
      {
        _index: 'locations',
        _type: '_doc',
        _id: 'kJMSj3UBYZnwOAaBRF2E',
        _score: 7.1943026,
        _source: { name: 'กศน.ตำบลเหมือง', location: [13.2683616, 100.968201] },
      },
      {
        _index: 'locations',
        _type: '_doc',
        _id: 'PpMSj3UBYZnwOAaBRFmE',
        _score: 6.2172985,
        _source: { name: 'กศน.ตำบลเมือง', location: [14.584854, 104668978] },
      },
      {
        _index: 'locations',
        _type: '_doc',
        _id: 'p5MSj3UBYZnwOAaBRGKF',
        _score: 6.2172985,
        _source: { name: 'กศน.ตำบลเมือง', location: [17.5571068, 101.709187] },
      },
    ];
  }

  // filterMyOptions(event: )
}

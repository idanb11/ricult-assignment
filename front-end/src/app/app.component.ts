import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Location } from './location';
import { LocationDataService } from './services/location-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public locations$: Observable<Location[]>;
  public selectedCtrl: FormControl = new FormControl();
  public searchCtrl: FormControl = new FormControl();
  public searching = false;

  constructor(private dataService: LocationDataService) {}

  ngOnInit(): void {
    this.locations$ = this.searchCtrl.valueChanges.pipe(
      tap(() => (this.searching = true)),
      debounceTime(200),
      switchMap((search) => this.dataService.getLocationData(search)),
      tap(() => (this.searching = false))
    );
  }
}

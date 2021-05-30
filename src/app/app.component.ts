import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './shared/config/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  divelogCachedAt$: Observable<Date|null>;
  
  constructor(configService: ConfigService) {
    this.divelogCachedAt$ = configService.divelogCachedAt$;
  }
}

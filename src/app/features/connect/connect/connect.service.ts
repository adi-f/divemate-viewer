import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheService } from 'src/app/shared/cache/cache.service';
import { ConfigService } from 'src/app/shared/config/config.service';
import { GoogleService, LoginState } from '../google/google.service';

@Injectable({
  providedIn: 'any'
})
export class ConnectService {

  loginState$: Observable<LoginState>

  constructor(private googleService: GoogleService, private cacheService: CacheService, private configService: ConfigService) { 
    this.loginState$ = googleService.loginState$;
  }

  async setup(): Promise<void> {
    this.googleService.setup();
  }

  login(): void {
    this.googleService.login();
  }

  async deleteDiveLogInLocalCache(): Promise<void> {
    await this.cacheService.deleteDivelog();
    this.configService.clearDivelogCachedAt();
  }

  async copyDiveLogDbToLocalCache(): Promise<void> {
    const db: ArrayBuffer = await this.googleService.readDiveMateDb();
    await this.cacheService.saveDivelog(db);
    this.configService.setDivelogCachedAt(new Date())
  }
}

import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private cookieName = 'cookie_consent';
  private consentSubject = new BehaviorSubject<boolean>(false);
  public consent$: Observable<boolean> = this.consentSubject.asObservable();

  constructor(private cookieService: CookieService) {
    this.initializeConsent();
  }

  private initializeConsent(): void {
    const hasConsent = this.cookieService.check(this.cookieName);
    this.consentSubject.next(hasConsent);
  }

  hasConsent(): boolean {
    return this.cookieService.check(this.cookieName);
  }

  giveConsent(): void {
    this.cookieService.set(this.cookieName, 'accepted', 365);
    this.consentSubject.next(true);
  }

  revokeConsent(): void {
    this.cookieService.delete(this.cookieName);
    this.consentSubject.next(false);
  }
}

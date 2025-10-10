import { Component, OnInit } from '@angular/core';
import {CookieConsentService} from "../cookie-consent/cookie-consent.service";

@Component({
  selector: 'app-keks-banner',
  templateUrl: './keks-banner.component.html',
  styleUrl: './keks-banner.component.css',
})
export class KeksBannerComponent implements OnInit {
  showBanner = false;

  constructor(private cookieConsentService: CookieConsentService) {}

  ngOnInit(): void {
    this.showBanner = !this.cookieConsentService.hasConsent();
  }

  acceptCookies(): void {
    this.cookieConsentService.giveConsent();
    this.showBanner = false;
  }
}

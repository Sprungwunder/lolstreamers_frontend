import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-keks-banner',
  providers: [CookieService],
  templateUrl: './keks-banner.component.html',
  styleUrl: './keks-banner.component.css',
})
export class KeksBannerComponent implements OnInit {
  showBanner = false;
  cookieName = 'cookie_consent';

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    this.showBanner = !this.cookieService.check(this.cookieName);
  }

  acceptCookies(): void {
    this.cookieService.set(this.cookieName, 'accepted', 365);
    this.showBanner = false;
  }
}

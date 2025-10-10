import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {NavigationComponent} from "./navigation/navigation.component";
import {FooterComponent} from "./footer/footer.component";
import {KeksBannerComponent} from "./cookie-banner/keks-banner.component";

@Component({
    selector: 'app-root',
    imports: [RouterModule, NavigationComponent, FooterComponent, KeksBannerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'searchtherift-app';
}

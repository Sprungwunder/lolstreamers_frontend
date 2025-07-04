import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import {NavigationComponent} from "./navigation/navigation.component";
import {FooterComponent} from "./footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavigationComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lolstreamers-app';
}

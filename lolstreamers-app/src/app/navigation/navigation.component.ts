import {Component} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../auth.service';
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-navigation',
    imports: [CommonModule, RouterModule],
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  constructor(public authService: AuthService, private router: Router) {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

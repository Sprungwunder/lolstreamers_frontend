import {Component} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../auth.service';


@Component({
    selector: 'app-navigation',
    imports: [RouterModule],
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

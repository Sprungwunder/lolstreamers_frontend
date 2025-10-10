import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from "../auth.service";

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  async onSubmit() {
    try {
      await this.authService.login(this.username, this.password);
      this.router.navigate(['']); // Redirect to home or another page after login
    } catch (error) {
      this.errorMessage = 'Invalid username or password';
    }
  }
}

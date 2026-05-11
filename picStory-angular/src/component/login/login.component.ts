import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  name = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {

    this.error = '';
    this.loading = true;

    this.authService.login(this.name, this.password)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          localStorage.setItem('token', res.token);

          this.router.navigate(['/dashboard']);
        },

        error: () => {
          this.loading = false;
          this.error = 'שם משתמש או סיסמה שגויים';
        }

      });
  }
}
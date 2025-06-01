import { Component, inject, OnInit } from '@angular/core';
import { LeftBoxComponent } from "./left-box/left-box.component";
import { HeaderComponent } from "./header/header.component";
import { MatPaginatorModule } from '@angular/material/paginator';
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [LeftBoxComponent, HeaderComponent, MatPaginatorModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  loggedIn = false;

  ngOnInit() {
    // Intenta refrescar el token si no está autenticado
    if (!this.authService.isAuthenticated()) {
      this.authService.refreshToken().subscribe({
        next: (res) => {
          this.authService.setAccessToken(res.accessToken);
          this.loggedIn = true;
        },
        error: () => {
          this.authService.logout();
          this.loggedIn = false;
        }
      });
    } else {
      this.loggedIn = true;
    }
  }

  getLoggedIn(loggedIn: boolean) {
    this.loggedIn = loggedIn;
  }
}

import { Component, inject, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../services/communication.service';
import { RegisterButtonComponent } from '../register-button/register-button.component';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-header',
  imports: [FormsModule, CommonModule, RegisterButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})



export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  searchTerm: string = '';
  message: string = 'user';
  constructor(@Inject(Router) private router: Router, private communicationService: CommunicationService) {}
  ngOnInit(): void {
    this.communicationService.currentMessage.subscribe(message => {
      this.message = message;
    });
  }
  search(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchTerm } });
    }
  }
  logout(): void {
    try {
      this.authService.logout();
      window.location.reload();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}



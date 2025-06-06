import { Component, inject, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../services/communication.service';
import { RegisterButtonComponent } from '../register-button/register-button.component';
import { AuthService } from '../services/auth.service';
import { PacketService } from '../services/packet.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-header',
  imports: [FormsModule, CommonModule, RegisterButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})



export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  filteredList: any[] = [];
  toastr = inject(ToastrService);
  searchTerm: string = '';
  message: string = 'user';
  constructor(@Inject(Router) private router: Router,
  private communicationService: CommunicationService,
  private packetService: PacketService,
  private userService: UserService) {}

  ngOnInit(): void {
    this.communicationService.currentMessage.subscribe(message => {
      this.message = message;
    });
  }
  filter(): void {


    if(this.message === 'packet'){
      this.filterPackets();
    }
    else{
      this.filterUsers();
    }
  }

  filterPackets(page: number = 1, limit: number = 100): void {
    this.packetService.getPackets(page, limit).subscribe({
      next: (response) => {
        const packets = response.data;
        if(this.searchTerm.trim() === 'almacén' ||this.searchTerm.trim() === 'almacen'){
          this.filteredList = packets.filter(packet =>
            packet.status.toLowerCase().includes('almacén')
          );
          this.communicationService.sendPacketsList(this.filteredList);
        }
        else if(this.searchTerm.trim() === 'entregado'){
          this.filteredList = packets.filter(packet =>
            packet.status.toLowerCase().includes('entregado')
          );
          this.communicationService.sendPacketsList(this.filteredList);
        }
        else if(this.searchTerm.trim() === 'reparto'){
          this.filteredList = packets.filter(packet =>
            packet.status.toLowerCase().includes('reparto')
          );
          this.communicationService.sendPacketsList(this.filteredList);
        }
        else if (this.searchTerm.includes('@')) {
          this.filteredList = packets.filter(packet =>
            packet.description.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.communicationService.sendPacketsList(this.filteredList);
        } else if (!isNaN(Number(this.searchTerm))) {
          this.filteredList = packets.filter(packet =>
            packet.status.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.communicationService.sendPacketsList(this.filteredList);
        } else {
          this.filteredList = packets.filter(packet =>
            packet.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.communicationService.sendPacketsList(this.filteredList);
        }
      },
      error: (err) => {
        this.toastr.error('Error en la búsqueda del paquete', 'Error',{
           positionClass: 'toast-top-center'
        });
      }
    });
  }

  filterUsers(page: number = 1, limit: number = 1000): void {
    this.userService.getUsers(page, limit).subscribe({
      next: (response) => {
        const users = response.data;
        if(this.searchTerm.trim() === 'admin'){
          this.filteredList = users.filter(user =>
            user.role.toLowerCase().includes('admin')
          );
          this.communicationService.sendUsersList(this.filteredList);
        }
        else if(this.searchTerm.trim() === 'user'){
          this.filteredList = users.filter(user =>
            user.role.toLowerCase().includes('user')
          );
          this.communicationService.sendUsersList(this.filteredList);
        }
        else if(this.searchTerm.trim() === 'delivery'){
          this.filteredList = users.filter(user =>
            user.role.toLowerCase().includes('delivery')
          );
          this.communicationService.sendUsersList(this.filteredList);
        }
        else if (this.searchTerm.includes('@')) {
          this.filteredList = users.filter(user =>
            user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.communicationService.sendUsersList(this.filteredList);
        } else if (!isNaN(Number(this.searchTerm))) {
          this.filteredList = users.filter(user =>
            user.phone.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.communicationService.sendUsersList(this.filteredList);
        } else {
          this.filteredList = users.filter(user =>
            user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.communicationService.sendUsersList(this.filteredList);
        }
      },
      error: (err) => {
        this.toastr.error('Error en la búsqueda de usuarios', 'Error',{
           positionClass: 'toast-top-center'
        });
      }
    });
  }

  search(): void {
    if (this.searchTerm.trim()) {

      this.searchTerm = this.searchTerm.toLowerCase(); // Pasa el searchTerm a minúsculas
      this.filter();
      if(this.message === 'packet'){
        this.router.navigate(['/packet-component']);
      }
      else{
        this.router.navigate(['/user-component']);
      }
    }
  }
  logout(): void {
    try {
      this.authService.logout();
      window.location.reload();
    } catch (error) {
      this.toastr.error('Error al cerrar sesión', 'Error',{
         positionClass: 'toast-top-center'
      });
    }
  }
}



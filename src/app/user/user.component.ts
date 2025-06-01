import { Component, EventEmitter, inject, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UserPackagesComponent } from '../user-packages/user-packages.component';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../services/communication.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [CommonModule, MatPaginatorModule, UserPackagesComponent, RouterLink, RouterLinkActive],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  standalone: true
})

export class UserComponent implements OnInit {
  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  usuarioSeleccionado: User = new User();
  usersList: User[] = [];
  displayedUsers: User[] = [];
  totalItems = 0;
  itemsPerPage = 3;
  currentPage = 0;

  mostrarModal = false; // Controla la visibilidad del modal
  paquetesSeleccionados: any[] = []; // Almacena los paquetes del usuario seleccionado

  constructor(private cdr: ChangeDetectorRef, private communicationService: CommunicationService) {
    this.usersList = [];
  }

  userService = inject(UserService);

  // Función que se usa cuando se hace click a listar usuarios
  obtenerUsuarios(): void {
    this.userService.getUsers(this.currentPage + 1, this.itemsPerPage).subscribe({
      next: (response) => {
        this.usersList = response.data.map(user => ({
          ...user,
          seleccionado: false // Inicializa la propiedad seleccionado en false
        }));
        this.displayedUsers = this.usersList;
        this.totalItems = response.totalUsers;
        console.log(this.usersList, this.totalItems);
        this.cdr.detectChanges(); // Detecta cambios para actualizar la vista
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.obtenerUsuarios();
  }

  trackByUserId(index: number, user: any): string {
    return user?._id || index.toString(); // Asegura que siempre se devuelva un valor válido
  }

  toggleSeleccion(usuario: User): void {
    usuario.seleccionado = !usuario.seleccionado;

  }

  confirmarEliminacion(): void {
    const usuariosSeleccionados = this.usersList.filter(usuario => usuario.seleccionado); // Filtra los usuarios seleccionados
    console.log('Usuarios seleccionados:', usuariosSeleccionados);
    if (usuariosSeleccionados.length === 0) {
      alert('No hay usuarios seleccionados para eliminar.');
      return;
    }

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar ${usuariosSeleccionados.length} usuario(s)?`);
    if (confirmacion) {
      this.eliminarUsuarios(usuariosSeleccionados, 1);
    }
  }
  sendUser(usuario: User){
    this.communicationService.sendUser(usuario);
    console.log('Usuario enviado:', usuario); // Verifica que el método se está llamando
  }

  eliminarUsuarios(usuariosSeleccionados: any[], opcion: number): void {
    usuariosSeleccionados.forEach(usuario => {
      if (opcion == 1) {
        this.userService.deleteUsuario(usuario._id).subscribe({
          next: () => {
            console.log(`Usuario con ID ${usuario._id} eliminado.`);
            this.usersList = this.usersList.filter(u => u.id !== usuario._id); // Eliminamos el usuario de la lista local
            this.displayedUsers = [...this.usersList]; // Actualizamos la lista mostrada
            this.cdr.detectChanges(); // Forzamos la detección de cambios para actualizar el DOM
          },
          error: (error) => {
            console.error(`Error al eliminar el usuario con ID ${usuario._id}:`, error);
          }
        });
      } else if (opcion === 2) {
        this.userService.deactivateUsuario(usuario._id, usuario).subscribe({
          next: (usuarioModificado) => {
            console.log(`Usuario con ID ${usuario._id} eliminado. ${usuario.available}`);
            const index = this.usersList.findIndex(u => u.id === usuarioModificado._id);
            if (index !== -1) {
              this.usersList[index] = usuarioModificado; // Actualizamos el usuario en la lista
            }
            this.displayedUsers = [...this.usersList]; // Actualizamos la lista mostrada
            this.cdr.detectChanges(); // Forzamos la detección de cambios para actualizar el DOM
          },
          error: (error) => {
            console.error(`Error al eliminar el usuario con ID ${usuario._id}:`, error);
          }
        });
      }
    });
  }

  desactivarUsuarios(): void {
    const usuariosSeleccionados = this.usersList.filter(usuario => usuario.seleccionado); // Filtra los usuarios seleccionados
    console.log('Usuarios seleccionados:', usuariosSeleccionados);
    if (usuariosSeleccionados.length === 0) {
      alert('No hay usuarios seleccionados para eliminar.');
      return;
    }

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar ${usuariosSeleccionados.length} usuario(s)?`);
    if (confirmacion) {
      this.eliminarUsuarios(usuariosSeleccionados, 2);
    }
  }



  verPaquetes(usuario: User): void {
    console.log('Usuario seleccionado:', usuario); // Verifica que el método se está llamando
    this.userService.getPaquetesUsuario(usuario.id!).subscribe({
      next: (paquetes) => {
        console.log('Paquetes obtenidos del backend:', paquetes); // Verifica los datos obtenidos
        this.paquetesSeleccionados = paquetes; // Asigna los paquetes obtenidos
        this.mostrarModal = true; // Muestra el modal
      },
      error: (error) => {
        console.error('Error al obtener los paquetes:', error); // Verifica si hay un error
      }
    });
  }

cerrarModal(): void {
  this.mostrarModal = false; // Oculta el modal
}
}

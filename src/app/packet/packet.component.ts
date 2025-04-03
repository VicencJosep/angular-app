import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Packet } from '../models/packet.model';
import { PacketService } from '../services/packet.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CommunicationService } from '../services/communication.service';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-packet',
  imports: [CommonModule, MatPaginatorModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './packet.component.html',
  styleUrl: './packet.component.css'
})
export class PacketComponent implements OnInit{
  searchTerm: string = ''; // Término de búsqueda
  mostrarModal: boolean = false; // Controla la visibilidad del modal
  packetsList: Packet[] = []; // Lista completa de pacquetes
  displayedPackets: Packet[] = []; // Paquetes visibles en la página actual    totalItems = 0; // Número total de elementos
  totalItems = 0; // Número total de elementos
  itemsPerPage = 3; // Elementos por página
  currentPage = 0; // Página actual
  paquetesSeleccionados: Packet[] = []; // Almacena los paquetes del usuario seleccionado
  constructor(private cdr: ChangeDetectorRef, private communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.obtainPackets();
  }
  packetService = inject(PacketService);
  userService = inject(UserService);
  obtainPackets(): void {
    this.packetService.getPackets(this.currentPage + 1, this.itemsPerPage).subscribe({
      next: (response) => {
        this.packetsList = response.data.map(packet => ({
          ...packet
        }));
        this.displayedPackets = this.packetsList; // Actualiza los paquetes mostrados
        this.totalItems = response.totalPackets;
        console.log(this.packetsList, this.totalItems);
        this.cdr.detectChanges();
        if (this.packetsList.length > 0) {
          console.log(this.packetsList[0].name); // Ahora no dará error
        }
      },
      error: (error) => {
        console.error('Error al obtener paquetes:', error);
      }
    });
  }
  sendPacket(packet: Packet){
    this.communicationService.sendPacket(packet);
    console.log('Usuario enviado:', packet); // Verifica que el método se está llamando
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.obtainPackets(); // Llama a la función para obtener los paquetes de la nueva página
  }

  trackByPacketId(index: number, packet: any): string {
    return packet?._id || index.toString(); // Asegura que siempre se devuelva un valor válido
  }

  toggleSeleccion(packet: Packet): void {
    packet.seleccionado = !packet.seleccionado;
    console.log(packet.seleccionado);
  }

  confirmarAsignacion(): void {
    this.paquetesSeleccionados = this.packetsList.filter(packet => packet.seleccionado); // Filtra los usuarios seleccionados
    console.log('Usuarios seleccionados:', this.paquetesSeleccionados);
    if (this.paquetesSeleccionados.length === 0) {
      alert('No hay paquetes seleccionados para asignar.');
      return;
    }
    this.mostrarModal = true; // Muestra el modal
  }

  search() {
    console.log(this.searchTerm);

    if (this.paquetesSeleccionados.length === 0) {
      alert('No hay paquetes seleccionados para asignar.');
      return;
    }

    // Crear un array de observables para todas las solicitudes
    const requests = this.paquetesSeleccionados.map(packet =>
      this.userService.assignPacketsToUser(this.searchTerm, packet._id)
    );

    // Ejecutar todas las solicitudes en paralelo
    forkJoin(requests).subscribe({
      next: (responses) => {
        console.log('Todos los paquetes asignados:', responses);
        alert('Todos los paquetes han sido asignados correctamente.');
        this.mostrarModal = false; // Oculta el modal
      },
      error: (error) => {
        console.error('Error al asignar paquetes:', error);
        alert('Ocurrió un error al asignar algunos paquetes. Revisa la consola para más detalles.');
        this.mostrarModal = false; // Oculta el modal
      }
    });
  }
}

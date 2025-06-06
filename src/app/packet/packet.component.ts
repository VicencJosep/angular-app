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
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-packet',
  imports: [CommonModule, MatPaginatorModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './packet.component.html',
  styleUrl: './packet.component.css'
})
export class PacketComponent implements OnInit{
  toastr = inject(ToastrService);
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
      this.communicationService.currentFilteredPacketList.subscribe(filteredPacketList => {
      if (filteredPacketList && filteredPacketList.length > 0) {
        this.packetsList = filteredPacketList;
        this.displayedPackets = filteredPacketList;
      } else {
        this.obtainPackets();
      }
    });
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
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.toastr.error('Error en la búsqueda del paquete', 'Error',{
           positionClass: 'toast-top-center'
        });
      }
    });
  }
  sendPacket(packet: Packet){
    this.communicationService.sendPacket(packet);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
      this.communicationService.currentFilteredPacketList.subscribe(filteredPacketList => {
      if (filteredPacketList && filteredPacketList.length > 0) {
        this.packetsList = filteredPacketList;
        this.displayedPackets = filteredPacketList;
      } else {
        this.obtainPackets();
      }
    });
  }

  trackByPacketId(index: number, packet: any): string {
    return packet?._id || index.toString(); // Asegura que siempre se devuelva un valor válido
  }

  toggleSeleccion(packet: Packet): void {
    packet.seleccionado = !packet.seleccionado;
  }

  confirmarAsignacion(): void {
    this.paquetesSeleccionados = this.packetsList.filter(packet => packet.seleccionado); // Filtra los usuarios seleccionados
    if (this.paquetesSeleccionados.length === 0) {
       this.toastr.warning('No hay paquetes seleccionados para asignar.', 'Atención',{
           positionClass: 'toast-top-center'
        });
      return;
    }
    this.mostrarModal = true; // Muestra el modal
  }

  search() {
    console.log(this.searchTerm);

    if (this.paquetesSeleccionados.length === 0) {
         this.toastr.warning('No hay paquetes seleccionados para asignar.', 'Atención',{
           positionClass: 'toast-top-center'
        });
      return;
    }

    // Crear un array de observables para todas las solicitudes
    const requests = this.paquetesSeleccionados.map(packet =>
      this.userService.assignPacketsToUser(this.searchTerm, packet._id)
    );

    // Ejecutar todas las solicitudes en paralelo
    forkJoin(requests).subscribe({
      next: (responses) => {
        this.mostrarModal = false; // Oculta el modal
      },
      error: (error) => {
        this.toastr.error('Ocurrió un error al asignar algunos paquetes.', 'Error',{
           positionClass: 'toast-top-center'
        });
        this.mostrarModal = false; // Oculta el modal
      }
    });
  }
}

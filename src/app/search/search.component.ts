import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { CommunicationService } from '../services/communication.service';
import { PacketService } from '../services/packet.service';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  filteredList: any[] = [];
  message: string = 'user';
  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private communicationService: CommunicationService,
    private packetService: PacketService) {}

  ngOnInit(): void {
    this.communicationService.currentMessage.subscribe(message => {
      this.message = message;
      this.filter();
    });
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['query'] || '';
      this.filter();
    });
  }
  filter(): void {
    console.log('CommunicationService.sendMessage', this.message);

    if(this.message === 'packet'){
      this.filterPackets();
    }
    else{
      this.filterUsers();
    }
  }
  filterPackets(page: number = 1, limit: number = 3): void {
    this.packetService.getPackets(page, limit).subscribe({
      next: (response) => {
        const packets = response.data;
        if (this.searchTerm.includes('@')) {
          this.filteredList = packets.filter(packet =>
            packet.description.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.communicationService.sendUsersList(this.filteredList);
        } else if (!isNaN(Number(this.searchTerm))) {
          this.filteredList = packets.filter(packet =>
            packet.status.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        } else {
          this.filteredList = packets.filter(packet =>
            packet.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        }
      },
      error: (err) => {
        console.error('Error fetching packets:', err);
      }
    });
  }

  filterUsers(page: number = 1, limit: number = 3): void {
    this.userService.getUsers(page, limit).subscribe({
      next: (response) => {
        const users = response.data;
        if (this.searchTerm.includes('@')) {
          this.filteredList = users.filter(user =>
            user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
          );

        } else if (!isNaN(Number(this.searchTerm))) {
          this.filteredList = users.filter(user =>
            user.phone.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        } else {
          this.filteredList = users.filter(user =>
            user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        }
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }



}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import{User} from '../models/user.model';
import { Packet } from '../models/packet.model';


@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private messageSource = new BehaviorSubject<string>('user');
  currentMessage = this.messageSource.asObservable();
  private userSource = new BehaviorSubject<User>({} as User);
  currentUser = this.userSource.asObservable();


  private userListSource = new BehaviorSubject<User[]>([] as User[]);
  currentFilteredUsersList = this.userListSource.asObservable();
  sendUsersList(users: User[]) {
    console.log('🔄 Enviando lista de usuarios desde el servicio:', users);
    this.userListSource.next(users);

  }

  private packetListSource = new BehaviorSubject<Packet[]>([] as Packet[]);
  currentFilteredPacketList = this.packetListSource.asObservable();
  sendPacketsList(packets: Packet[]) {
    this.packetListSource.next(packets);
  }

  sendUser(user: User) {
    console.log('🔄 Enviando usuario desde el servicio:', user);
    this.userSource.next(user);}

  sendMessage(message: string) {
    console.log('🔄 Enviando mensaje desde el servicio:', message);
    this.messageSource.next(message);
  }
  private packetSource = new BehaviorSubject<Packet>({} as Packet);
  currentPacket = this.packetSource.asObservable();
  sendPacket(packet: Packet) {
    console.log('🔄 Enviando paquete desde el servicio:', packet);
    this.packetSource.next(packet);
  }
}

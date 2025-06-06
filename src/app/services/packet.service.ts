import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Packet } from '../models/packet.model';

@Injectable({
  providedIn: 'root'
})
export class PacketService {
  constructor(private http: HttpClient) { }

  private apiUrl = "http://localhost:4000/api/packets";

  getPackets(page: number = 1, limit: number = 3): Observable<{ data: Packet[]; totalPackets: number; currentPage: number }> {
    return this.http.get<{ data: Packet[]; totalPackets: number; currentPage: number }>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }
   // Crear paquete
   //createPacket(packetData: any): Observable<any> {
    //return this.http.post<any>(`${this.apiUrl}/packets`, packetData);
    createPacket(credentials: { name: string; description: string; status: string }): Observable<any> {
      return this.http.post(this.apiUrl, credentials);
  }
   editPacket(_id: string|undefined, credentials: {
      _id: string;
      name: string;
      description: string;
      status: string;

    }): Observable<Packet> {
      return this.http.put<Packet>(`${this.apiUrl}/${_id}`, credentials); // <-- Se eliminó el `}` extra
    }


}

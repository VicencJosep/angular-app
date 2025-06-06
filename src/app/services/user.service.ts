import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { map, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators'; // Asegúrate de importar 'tap'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  private apiUrl = "http://localhost:4000/api/users";

  getUsers(page: number = 1, limit: number = 3): Observable<{ data: User[]; totalUsers: number; currentPage: number }> {
    return this.http.get<{ data: User[]; totalUsers: number; currentPage: number }>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }

  //No s'utilitza però es pot fer servir per obtenir un usuari en concret a partir de la seva id
  getUser(id: number): Observable<User>{
    return this.http.get<User>(this.apiUrl+"/"+id);
  }


  createUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }


  createUser2(credentials: { name: string; email: string; password: string; phone: string; available: boolean; packets: string[] }): Observable<any>
  {
    credentials.available = true;
    return this.http.post(this.apiUrl, credentials);
  }
  createUser3(credentials: { name: string; email: string; password: string; phone: string; packets: string[] }): Observable<any>
  {
    return this.http.post(this.apiUrl, credentials);
  }

  deleteUsuario(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`); // Llamada DELETE para eliminar un usuario
  }


  deactivateUsuario(id: number, user: User): Observable<any> {
      console.log(user.available); // Verifica el valor de user.available
      return this.http.put(`${this.apiUrl}/${id}/deactivate`, { available: false}).pipe(
          tap(response => console.log('Server response:', response)) // Escribe la respuesta en la consola
      );
  }

  getPaquetesUsuario(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/packets`).pipe(
      tap(paquetes => console.log(`Paquetes del usuario ${userId}:`, paquetes))
    );
  }

  getUserByName(userName: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/name/${userName}`);
  }
  assignPacketsToUser(userName: string, packetId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${userName}/packets`, { packetId });
  }
  editUser(_id: string, credentials: {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    available: boolean;
    packets: string[];
  }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${_id}`, credentials); // <-- Se eliminó el `}` extra
  }
}

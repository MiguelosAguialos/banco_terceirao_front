import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { StorageService } from './storage.service';
import { LocalUser } from '../app/model/local_user';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class AuthService {
  constructor(
    public http: HttpClient,
    public storage: StorageService,
    public navController: NavController
  ) {}
  login(creds: any): Observable<any> {
    return this.http.post(`${API_CONFIG.baseUrl}/login`, creds, httpOptions);
  }

  getComprasByUsuario(usuarioId: any): Observable<any> {
    return this.http.get(
      `${API_CONFIG.baseUrl}/compras/${usuarioId}`,
      httpOptions
    );
  }

  updateConta(usuarioId: any, valor: any): Observable<any> {
    const creds = { usuarioId: usuarioId, valor: valor };
    return this.http.post(`${API_CONFIG.baseUrl}/compras`, creds, httpOptions);
  }

  newExtrato(usuarioId: any, produtoId: any): Observable<any> {
    const creds = { usuarioId: usuarioId, produtoId: produtoId };
    return this.http.post(`${API_CONFIG.baseUrl}/compra`, creds, httpOptions);
  }

  create(creds: any): Observable<any> {
    return this.http.post(`${API_CONFIG.baseUrl}/users`, creds, httpOptions);
  }

  getUserById(creds: any): Observable<any> {
    return this.http.get(`${API_CONFIG.baseUrl}/user/${creds}`, httpOptions);
  }

  getProductByChave(creds: any): Observable<any> {
    return this.http.get(`${API_CONFIG.baseUrl}/product/${creds}`, httpOptions);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${API_CONFIG.baseUrl}/products`, httpOptions);
  }

  refresh(refreshToken: string): Observable<any> {
    return this.http.post(
      `${API_CONFIG.baseUrl}/refresh`,
      { refreshToken: refreshToken },
      httpOptions
    );
  }

  signOut(): void {
    this.storage.setLocalUser({ token: '', refreshToken: '' });
    this.navController.navigateRoot('login');
  }
}

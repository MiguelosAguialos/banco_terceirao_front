import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { StorageService } from '../service/storage.service';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    public storage: StorageService,
    public alertController: AlertController,
    public navController: NavController,
    public authService: AuthService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
        } else {
          if (error.error.message == 'Token inválido') {
            this.tokenInvalidException(error);
          }
          if (error.error.message == 'Usuário não encontrado') {
            this.usuarioNaoEncontrado(error);
          }
          if (error.error.message == 'Credenciais inválidas') {
            this.credenciaisInvalidas(error);
          }

          if (error.url?.startsWith('http://localhost:3333/product/')) {
            this.chavepixInvalida();
          }

          // errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        return throwError(error);
      })
    );
  }
  async tokenInvalidException(error: any) {
    this.storage.setLocalUser({ token: '', refreshToken: '' });
    Swal.fire({
      icon: 'error',
      title: 'Sessão expirada',
      text: 'Faça login novamente para ter acesso ao portal',
      heightAuto: false,
      showConfirmButton: false,
      timer: 1000,
    });
    this.navController.navigateRoot('login');
  }

  async usuarioNaoEncontrado(error: any) {
    Swal.fire({
      icon: 'error',
      title: error.error.message,
      text: 'O usuário com este email não foi encontrado',
      heightAuto: false,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  async credenciaisInvalidas(error: any) {
    Swal.fire({
      icon: 'error',
      title: error.error.message,
      text: 'Não foi encontrado nenhum registro em acordo com essas credenciais',
      heightAuto: false,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  async chavepixInvalida() {
    Swal.fire({
      icon: 'error',
      title: 'Chave Pix inválida',
      text: 'Não foi encontrado nenhum produto contendo esta chave',
      heightAuto: false,
      showConfirmButton: false,
      timer: 2000,
    });
  }
}
export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};

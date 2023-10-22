import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalUser } from '../app/model/local_user';
import { StorageService } from '../service/storage.service';
import { NavController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    public storageService: StorageService,
    public navController: NavController,
    public auth: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url == 'http://localhost:3333/collection') {
      const token: LocalUser = this.storageService.getLocalUser();
      this.auth.refresh(token.refreshToken).subscribe((newToken: any) => {
        this.storageService.setLocalUser({
          token: newToken.token,
          refreshToken: token.refreshToken,
        });
      });
    }
    return next.handle(req);
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};

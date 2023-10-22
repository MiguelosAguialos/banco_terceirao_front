import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/service/auth.service';
import { StorageService } from 'src/service/storage.service';
import Swal from 'sweetalert2';
import { LocalUser } from '../model/local_user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public creds = {
    email: '',
    password: '',
  };

  public formLogin!: FormGroup;

  constructor(
    private router: Router,
    public storageService: StorageService,
    public navController: NavController,
    public auth: AuthService,
    public formBuilder: FormBuilder
  ) {
    this.formLogin = this.formBuilder.group({
      email: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[@#$%^&+=!])(?=.*[a-zA-Z@#$%^&+=!]).{8,}$/
          ),
        ]),
      ],
    });
  }

  ngOnInit() {
    const token: LocalUser = this.storageService.getLocalUser();
    if (token.token == '') {
      this.navController.navigateRoot('login');
    } else {
      this.auth.refresh(token.refreshToken).subscribe((newToken: any) => {
        this.storageService.setLocalUser({
          token: newToken.token,
          refreshToken: token.refreshToken,
        });
        var parametros = {
          id: newToken.id,
        };
        this.navController.navigateRoot('home', { queryParams: parametros });
      });
    }
  }

  onRegister() {
    this.auth
      .create({ email: this.creds.email, senha: this.creds.password })
      .subscribe((data) => {
        console.log(data);
        if (data.status) {
          Swal.fire({
            heightAuto: false,
            icon: 'error',
            title: data.message,
            showConfirmButton: false,
            timer: 1800,
            allowOutsideClick: false,
          });
        } else {
          Swal.fire({
            heightAuto: false,
            icon: 'success',
            title: data.msg,
            showConfirmButton: false,
            timer: 1800,
            allowOutsideClick: false,
          });
        }
      });
  }

  onSubmit() {
    this.auth
      .login({ email: this.creds.email, senha: this.creds.password })
      .subscribe((data) => {
        console.log(data);
        const obj: LocalUser = {
          token: data.token,
          refreshToken: data.refreshToken,
        };
        this.storageService.setLocalUser(obj);
        var parametros = {
          id: data.id,
        };
        this.navController.navigateRoot('home', { queryParams: parametros });
      });
  }
}

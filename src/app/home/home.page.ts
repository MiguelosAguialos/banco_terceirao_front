import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PixScreenComponent } from '../pix-screen/pix-screen.component';
import { AuthService } from 'src/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { ExtratoScreenComponent } from '../extrato-screen/extrato-screen.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  modal!: HTMLIonModalElement;
  modalExtrato!: HTMLIonModalElement;
  listaProdutos!: any;
  userInfo = {
    id: '',
    name: 'Miguel',
    money: 5000,
  };

  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public route: ActivatedRoute,
    public cookieService: CookieService,
    public router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params && params['id']) {
        const id = params['id'];
        this.authService.getUserById(id).subscribe((res) => {
          this.userInfo.id = res.id;
          this.userInfo.money = res.dinheiro;
          this.userInfo.name = res.email;
        });
      }

      this.authService.getProducts().subscribe((res) => {
        this.listaProdutos = res;
      });
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params && params['id']) {
        const id = params['id'];
        this.authService.getUserById(id).subscribe((res) => {
          console.log(res);
        });
      }
    });

    this.authService.getProducts().subscribe((res) => {
      console.log(res);
    });
  }

  async openModalPix() {
    this.modal = await this.modalController.create({
      component: PixScreenComponent,
      cssClass: 'modal-pix',
      componentProps: {
        id: this.userInfo.id,
        dinheiro: this.userInfo.money,
        nome: this.userInfo.name,
      },
    });
    this.modal.onDidDismiss().then(() => {
      this.reloadData();
    });
    await this.modal.present();
  }

  async openModalExtrato() {
    this.modalExtrato = await this.modalController.create({
      component: ExtratoScreenComponent,
      cssClass: 'modal-pix',
      componentProps: {
        usuarioId: this.userInfo.id,
      },
    });
    await this.modalExtrato.present();
  }

  logout() {
    Swal.fire({
      title: 'Sair',
      heightAuto: false,
      text: 'Deseja realmente sair?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#f8e192',
      confirmButtonColor: 'rgba(47, 203, 252, 0.3)',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.signOut();
      }
    });
  }

  reloadData() {
    console.log('está dando reload nos dados');
    const id = this.userInfo.id;
    this.authService.getUserById(id).subscribe((res) => {
      this.userInfo.money = res.dinheiro;
    });

    this.authService.getProducts().subscribe((res) => {
      this.listaProdutos = res;
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import '../home/home.page';
import Swal from 'sweetalert2';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-pix-screen',
  templateUrl: './pix-screen.component.html',
  styleUrls: ['./pix-screen.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class PixScreenComponent implements OnInit {
  @Input() id: any;
  @Input() dinheiro: any;
  @Input() nome: any;

  chavepix = '';

  constructor(
    public modalController: ModalController,
    public authService: AuthService
  ) {}

  ngOnInit() {}

  goBack() {
    this.modalController.dismiss(null, 'cancel');
  }

  pagar() {
    this.authService.getProductByChave(this.chavepix).subscribe((res) => {
      console.log(res);
      if (res) {
        Swal.fire({
          title: 'Confirmar pagamento',
          heightAuto: false,
          text: `Deseja confirmar a compra de um(a) ${res.nome}?`,
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          cancelButtonColor: '#f8e192',
          confirmButtonColor: 'rgba(47, 203, 252, 0.3)',
          showConfirmButton: true,
          confirmButtonText: 'Confirmar',
        }).then((result) => {
          if (result.isConfirmed) {
            if (this.dinheiro < res.preco) {
              Swal.fire({
                title: 'Dinheiro insuficiente',
                heightAuto: false,
                text: 'Sua conta não possui mais dinheiro para comprar este produto',
                icon: 'error',
                showConfirmButton: false,
                timer: 1200,
              });
            } else {
              this.authService
                .updateConta(this.id, this.dinheiro - res.preco)
                .subscribe((msg) => {
                  Swal.fire({
                    title: 'Pagamento confirmado',
                    icon: 'success',
                    heightAuto: false,
                    text: `Compra do/da ${res.nome} confirmada com sucesso! Em nome de ${this.nome}`,
                    timer: 2000,
                    showConfirmButton: false,
                  });
                  this.authService
                    .newExtrato(this.id, res.id)
                    .subscribe((msg) => {
                      console.log(msg);
                    });
                });
            }
          }
        });
      } else {
        Swal.fire({
          title: 'Chave inválida',
          heightAuto: false,
          text: 'Chave do produto inválido',
          icon: 'error',
          showConfirmButton: false,
          timer: 1200,
        });
      }
    });
  }
}

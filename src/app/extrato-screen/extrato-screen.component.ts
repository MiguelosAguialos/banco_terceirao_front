import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/service/auth.service';
import '../home/home.page';

@Component({
  selector: 'app-extrato-screen',
  templateUrl: './extrato-screen.component.html',
  styleUrls: ['./extrato-screen.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class ExtratoScreenComponent implements OnInit {
  produtos!: any;

  constructor(
    public modalController: ModalController,
    public authService: AuthService,
    public navParams: NavParams
  ) {
    const usuarioId = this.navParams.get('usuarioId');
    this.authService.getComprasByUsuario(usuarioId).subscribe((products) => {
      this.produtos = products;
      console.log(this.produtos);
    });
  }

  ngOnInit() {}

  goBack() {
    this.modalController.dismiss(null, 'cancel');
  }
}

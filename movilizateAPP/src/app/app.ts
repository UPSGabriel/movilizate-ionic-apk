import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';



@Component({

  selector: 'app-root',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './app.html',

  styleUrls: ['./app.scss']

})

export class AppComponent {

// Variables del formulario

  cardId: string = '';

  amount: number | null = null;

  selectedBank: string = '';



// Estado de la app

  step: number = 1;

  isLoading: boolean = false;



  validateCardId(): boolean {

// Valida que empiece con CURA y sigan 10 números (total 14 caracteres)

    const regex = /^CURA\d{10}$/;

    return regex.test(this.cardId);

  }



// Función auxiliar para seleccionar monto

  selectAmount(value: number) {

    this.amount = value;

  }



  proceedToPayment() {

    if (!this.cardId) {

      alert('Por favor ingresa el ID de la tarjeta.');

      return;

    }

    if (!this.validateCardId()) {

      alert('El formato del ID es incorrecto. Debe ser como: CURA0010505920');

      return;

    }

    if (!this.amount || this.amount <= 0) {

      alert('Por favor ingresa un monto válido.');

      return;

    }



    this.step = 2;

  }



  selectBank(bank: string) {

    this.selectedBank = bank;

    this.isLoading = true;



// Simula carga de 2 segundos para más realismo

    setTimeout(() => {

      this.isLoading = false;

    }, 2000);

  }



  reset() {

    this.step = 1;

    this.selectedBank = '';

    this.amount = null;

// this.cardId = ''; // Opcional: si quieres que borre el ID al reiniciar

  }

}

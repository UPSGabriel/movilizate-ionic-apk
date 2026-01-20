import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class HomePage {
  // --- TU LÓGICA ORIGINAL ---
  cardId: string = '';
  amount: number | null = null;
  selectedBank: string = '';

  step: number = 1;
  isLoading: boolean = false;

  validateCardId(): boolean {
    const regex = /^CURA\d{10}$/;
    return regex.test(this.cardId);
  }

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
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  reset() {
    this.step = 1;
    this.selectedBank = '';
    this.amount = null;
  }
}

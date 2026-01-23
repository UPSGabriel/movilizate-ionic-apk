import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonButtons, IonButton } from '@ionic/angular/standalone';

interface Transaction {
  date: Date;
  amount: number;
  cardId: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  // AGREGAMOS LOS MODULOS NECESARIOS PARA EL MODAL
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonButtons, IonButton, CommonModule, FormsModule],
})
export class HomePage implements OnInit {
  cardId: string = '';
  amount: number | null = null;
  selectedBank: string = '';
  step: number = 1;
  isLoading: boolean = false;

  history: Transaction[] = []; // Historial completo original
  displayedHistory: Transaction[] = []; // Historial filtrado que se ve en el modal

  // Variables para el Modal y Filtros
  isModalOpen: boolean = false;
  filterDateStart: string = '';
  filterDateEnd: string = '';

  ngOnInit() {
    const savedCard = localStorage.getItem('movilizate_card');
    if (savedCard) this.cardId = savedCard;

    const savedHistory = localStorage.getItem('movilizate_history');
    if (savedHistory) {
      this.history = JSON.parse(savedHistory);
      // Restaurar las fechas de string a objeto Date para que funcionen los filtros
      this.history.forEach(item => item.date = new Date(item.date));
    }
  }

  // --- LÓGICA DEL HISTORIAL AVANZADO ---

  openHistoryModal() {
    // Al abrir, mostramos todo sin filtrar y limpiamos los filtros
    this.displayedHistory = [...this.history];
    this.filterDateStart = '';
    this.filterDateEnd = '';
    this.isModalOpen = true;
  }

  closeHistoryModal() {
    this.isModalOpen = false;
  }

  applyFilters() {
    if (!this.filterDateStart && !this.filterDateEnd) {
      this.displayedHistory = [...this.history]; // Si no hay fechas, mostrar todo
      return;
    }

    const start = this.filterDateStart ? new Date(this.filterDateStart) : new Date('2000-01-01');
    const end = this.filterDateEnd ? new Date(this.filterDateEnd) : new Date();
    // Ajustar el final del día para incluir movimientos de ese mismo día
    end.setHours(23, 59, 59);

    this.displayedHistory = this.history.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }

  clearFullHistory() {
    if(confirm('¿Estás seguro de borrar TODO el historial? No se puede deshacer.')) {
      this.history = [];
      this.displayedHistory = [];
      localStorage.removeItem('movilizate_history');
      this.closeHistoryModal();
    }
  }

  // --- TU LÓGICA ORIGINAL ---

  validateCardId(): boolean {
    const regex = /^CURA\d{10}$/;
    return regex.test(this.cardId);
  }

  selectAmount(value: number) {
    this.amount = value;
  }

  proceedToPayment() {
    if (!this.cardId) { alert('Ingresa el ID'); return; }
    this.cardId = this.cardId.trim().toUpperCase();
    if (!this.validateCardId()) { alert('ID incorrecto'); return; }
    if (!this.amount || this.amount <= 0) { alert('Monto inválido'); return; }

    localStorage.setItem('movilizate_card', this.cardId);

    const newTransaction: Transaction = {
      date: new Date(),
      amount: this.amount,
      cardId: this.cardId
    };

    this.history.unshift(newTransaction);
    localStorage.setItem('movilizate_history', JSON.stringify(this.history));
    this.step = 2;
  }

  selectBank(bank: string) {
    this.selectedBank = bank;
    this.isLoading = true;
    setTimeout(() => { this.isLoading = false; }, 2000);
  }

  reset() {
    this.step = 1;
    this.selectedBank = '';
    this.amount = null;
  }
}

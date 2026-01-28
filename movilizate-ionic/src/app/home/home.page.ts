import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import html2canvas from 'html2canvas';
import { Capacitor } from '@capacitor/core';
import {
  IonContent,
  IonModal,
  ToastController
} from '@ionic/angular/standalone';

// (Nota: Quité IonHeader, IonTitle, etc. porque tu diseño personalizado no los usa)

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
  imports: [IonContent, IonModal, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  cardId: string = '';
  amount: number | null = null;
  selectedBank: string = '';
  step: number = 1;
  isLoading: boolean = false;

  history: Transaction[] = [];
  displayedHistory: Transaction[] = [];

  isModalOpen: boolean = false;
  filterDateStart: string = '';
  filterDateEnd: string = '';

  // Variables para el comprobante
  isReceiptOpen: boolean = false;
  selectedReceipt: Transaction | null = null;

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    const savedCard = localStorage.getItem('movilizate_card');
    if (savedCard) this.cardId = savedCard;

    const savedHistory = localStorage.getItem('movilizate_history');
    if (savedHistory) {
      this.history = JSON.parse(savedHistory);
      this.history.forEach(item => item.date = new Date(item.date));
    }
  }

  // --- TOASTS (Notificaciones) ---
  async presentToast(message: string, color: 'danger' | 'warning' | 'success' = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'top',
      color: color,
      cssClass: 'custom-toast',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  // --- LÓGICA DEL HISTORIAL ---
  openHistoryModal() {
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
      this.displayedHistory = [...this.history];
      return;
    }
    const start = this.filterDateStart ? new Date(this.filterDateStart) : new Date('2000-01-01');
    const end = this.filterDateEnd ? new Date(this.filterDateEnd) : new Date();
    end.setHours(23, 59, 59);

    this.displayedHistory = this.history.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }

  async clearFullHistory() {
    if(confirm('¿Estás seguro de borrar TODO el historial?')) {
      this.history = [];
      this.displayedHistory = [];
      localStorage.removeItem('movilizate_history');
      this.closeHistoryModal();
      await this.presentToast('Historial eliminado correctamente', 'success');
    }
  }

  // --- LÓGICA DE PAGO ---
  validateCardId(): boolean {
    const regex = /^CURA\d{10}$/;
    return regex.test(this.cardId);
  }

  selectAmount(value: number) {
    this.amount = value;
  }

  proceedToPayment() {
    if (!this.cardId) {
      this.presentToast('⚠️ Por favor ingresa el ID de la tarjeta.', 'warning');
      return;
    }
    this.cardId = this.cardId.trim().toUpperCase();

    if (!this.validateCardId()) {
      this.presentToast('❌ Formato incorrecto. Debe ser: CURA0010505920', 'danger');
      return;
    }
    if (!this.amount || this.amount <= 0) {
      this.presentToast('⚠️ Por favor selecciona un monto válido.', 'warning');
      return;
    }

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

  // --- COMPARTIR SOLO TEXTO (Backup) ---
  shareReceipt(item: Transaction) {
    const text = `¡Hola! 👋 Recarga exitosa.\n💳: ${item.cardId}\n💰: $${item.amount}\n📅: ${new Date(item.date).toLocaleString()}\n\nApp Movilízate 🚌`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_system');
  }

  // --- LÓGICA DEL COMPROBANTE DIGITAL ---
  viewReceipt(item: Transaction) {
    this.selectedReceipt = item;
    this.isReceiptOpen = true;
  }

  closeReceipt() {
    this.isReceiptOpen = false;
    this.selectedReceipt = null;
  }

  // 🔥 FUNCIÓN MÁGICA: Genera FOTO y comparte 🔥
  async shareReceiptImage() {
    const element = document.getElementById('ticketVisual') as HTMLElement;

    if (!element) {
      this.presentToast('Error: No se encuentra el comprobante', 'danger');
      return;
    }

    this.presentToast('📸 Generando imagen...', 'warning');

    try {
      // TRUCO: Usamos 'as any' para que TypeScript no se queje de las opciones
      const options: any = { backgroundColor: null, scale: 2 };

      const canvas = await html2canvas(element, options);
      const fullBase64 = canvas.toDataURL('image/png');

      if (Capacitor.isNativePlatform()) {
        // --- MODO CELULAR ---
        const base64Data = fullBase64.split(',')[1];
        const fileName = `comprobante_${new Date().getTime()}.png`;

        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache
        });

        await Share.share({
          files: [savedFile.uri],
        });

      } else {
        // --- MODO PC ---
        const link = document.createElement('a');
        link.download = `Comprobante_Movilizate.png`;
        link.href = fullBase64;
        link.click();

        this.presentToast('💾 Imagen descargada (Ábrela y envíala)', 'success');
      }

    } catch (error) {
      console.error('Error al compartir imagen:', error);
      this.presentToast('Error al generar la imagen', 'danger');
    }
  }
}

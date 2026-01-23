import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter', // Asegúrate de que esto coincida con el tuyo si lo cambiaste
  appName: 'movilizate-ionic',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  android: {
    // --- SEGURIDAD ACTIVADA ---
    allowMixedContent: false,       // Bloquea contenido no seguro
    captureInput: false,            // Evita que el teclado capture info sensible
    webContentsDebuggingEnabled: false // ¡CLAVE! Nadie puede inspeccionar tu código desde Chrome
    // --------------------------
  }
};

export default config;

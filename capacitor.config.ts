import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.tacta.ionicbff',
  appName: 'BFF Mobile',
  webDir: 'dist/angular-mobile/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;
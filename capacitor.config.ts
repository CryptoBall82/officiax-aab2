// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.OfficiaX1.app',
  appName: 'OfficiaX',
  webDir: 'out',
 // bundledWebRuntime: false, // Explicitly set, which is the default for your setup
  server: {
    androidScheme: 'http',
    hostname: 'localhost'
  }
};

export default config;

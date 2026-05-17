import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'passaparola.app',
  appName: 'Passaparola',
  webDir: 'www',
  server: {
    cleartext: true,
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
    },
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    App: {
      appUrlOpen: {
        enabled: true
      }
    }
  },
};

export default config;

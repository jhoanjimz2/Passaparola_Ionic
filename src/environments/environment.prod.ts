export const environment = {
  production: true,
  appName: 'Passaparola',
  apiKrathemis: 'https://api.krathemis.com/api',
  apiUnika: 'https://wallet.unikaexchange.com/api',
  apiGateway: 'https://testpayment.passaparola.com/api',
  urlPWA: 'https://passaparola.app/',
  urlRegister: 'https://passaparola.app',
  joinAppLink: 'https://passaparola.page.link/join',
  urlBussinesRegister: 'https://registroazienda.passaparola.app',
  language: {
    default: 'es',
    list: ['es', 'it', 'en'],
  },
  firebaseConfig: {
    apiKey: 'AIzaSyAEOEs_zxUUGAGYcAzu3OdxtAohOnuQtFk',
    authDomain: 'app-passaparola.firebaseapp.com',
    projectId: 'app-passaparola',
    storageBucket: 'app-passaparola.appspot.com',
    messagingSenderId: '535115645434',
    appId: '1:535115645434:web:16928243b2a8701139e443',
  },
  urlBucketStorage: 'https://s3youetix.s3.nl-ams.scw.cloud',
  cryptoJS: {
    size: 8,
    lastKeyEncrypt: '4NT4D1G1',
    key: 'wert',
  },
  stripe: {
    public_key:
      'pk_live_51PMQeV072edGVsridxmhZHF5H4IJeZ0XH9fje3tq4yXhlMa7MZdkziCXnOquABjVmEktw9INwhUaQUzodtYInmr300ia2oD4o3',
  },
  wsUrl: 'https://wallet.unikaexchange.com/socket.io/socket.io.js',
  urlMall: 'https://mall.passaparola.com',
  jointlybuy: {
    walletPayJoyer: 'd8ca9092-b29f-485a-9d8c-5abda9f73a8c',
    walletPayWillbuy: '6a5e0c89-2c51-47dc-9f46-9812f16992e8'
  }
};

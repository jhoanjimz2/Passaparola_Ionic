export const environment = {
  production: false,
  appName: 'Passaparola',
  apiKrathemis: 'https://testapi.krathemis.com/api',
  apiUnika: 'https://testwallet.unikaexchange.com/api',
  apiGateway: 'https://testpayment.passaparola.com/api',
  urlPWA: 'https://app-passaparola.web.app',
  urlRegister: 'https://register-passaparola.web.app',
  joinAppLink: 'https://passaparola.page.link/join',
  urlBussinesRegister: 'https://app-passaparola-business.web.app',
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
      'pk_test_51PNZ0LBHDzF5OwwXladkgwPv1nIh391Zgoa6DNpLHK6TIi5tDw8Cy3sH2IopUeUjxRWx9jGrKuPWQ9GOfxqD1x5S00XVkokkrj',
  },
  wsUrl: 'https://testwallet.unikaexchange.com/socket.io/socket.io.js',
  urlMall: 'https://mall.passaparola.com',
  jointlybuy: {
    walletPayJoyer: 'd8ca9092-b29f-485a-9d8c-5abda9f73a8c',
    walletPayWillbuy: '6a5e0c89-2c51-47dc-9f46-9812f16992e8'
  }
};

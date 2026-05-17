# passaparolaApp

App passaparola developed in Ionic

This project was generated with Ionic CLI version 7.1.1.

## Development server

Run `ionic serve` for a dev server. Navigate to `http://localhost:8100/`. The application will automatically reload if you change any of the source files.

## Environments

- dev
- test
- prod

To generate a server in a given environment use one of the following commands:

- Development (dev):

bash
$ ionic serve --configuration=dev

- Test (test):

bash
$ ionic serve --configuration=test

- Production (production):

bash
$ ionic serve --configuration=production

## Run application with automatic reloading (livereload)

Use the command to start the Live Reload process:

bash
$ ionic cap run android -l --external

bash
$ ionic cap run ios -l --external

To start the Live Reload process in a given environment use one of the following commands:

- Development (dev):

bash
$ ionic cap run android -l --external --configuration=dev
$ ionic cap run ios -l --external --configuration=dev

- Test (test):

bash
$ ionic cap run android -l --external --configuration=test
$ ionic cap run ios -l --external --configuration=test

- Production (production):

bash
$ ionic cap run android -l --external --configuration=production
$ ionic cap run ios -l --external --configuration=production

## Build

## PWA

Run `ng build` to build the project. The build artifacts will be stored in the `www` directory.

- Build develop: Run `ng build --configuration=dev` to build the project. The build artifacts will be stored in the `www` directory.
- Build test: Run `ng build --configuration=test` to build the project. The build artifacts will be stored in the `www` directory.
- Build production: Run `ng build --configuration=prod` to build the project. The build artifacts will be stored in the `www` directory.

## Android

Run `ionic cap build android` to compile the project. The compilation files will be stored in the directory `android/`.

bash
$ ionic cap build android

## iOS

Run `ionic cap build ios` to compile the project. The compilation files will be stored in the directory `ios/`.

bash
$ ionic cap build ios

To compile the application in a given environment use one of the following commands:

- Development (dev):

bash
$ ionic cap build android --configuration=dev
$ ionic cap build ios --configuration=dev

- Test (test):

bash
$ ionic cap build android --configuration=test
$ ionic cap build ios --configuration=test

- Production (production):

bash
$ ionic cap build android --configuration=production
$ ionic cap build ios --configuration=production

## Build Android beta apk

From Android Studio open the project located in the directory `android/` and with the compilation tool generate a Bundle APK. The file `app-debug.apk` will be saved in the directory `android/app/build/outputs/apk/debug`

## Upload beta apk to firease App Distribution

Install the following dependency (One time only)

bash
$ npm install -g firebase-tools

Login to firebase using the command (When required):

bash
$ firebase login

After generating the file `app-debug.apk` which will be located in the directory `android/app/build/outputs/apk/debug` run:

bash
$ firebase appdistribution:distribute ./android/app/build/outputs/apk/debug/app-debug.apk --app 1:535115645434:android:04ef0d21fa82ae8839e443 --release-notes "test firebase" --groups "developer"

The `release-notes` flag specifies a note of the apk version (optional).

With flag `groups` you specify the group of verifiers which will have access to the distributed beta apk, if no group is specified the apk will be distributed to all registered verifier users (optional).

- Verifier groups available:
  - developer
  - test
  - production

## Subir beta App.ipa (iOS) a firease App Distribution

Instalar la siguiente dependencia (Se realiza una única vez)

```bash
$ npm install -g firebase-tools
```

Hacer login en firebase usando el comando (Cuando sea requerido):

```bash
$ firebase login
```

Luego de generar el archivo `App.ipa` usando Xcode debemos tener en cuenta la ruta donde se guarda el archivo ejemplo: `/Users/username/Desktop/App` y se debe ejecutar el siguiente comando:

```bash
$ firebase appdistribution:distribute /Users/username/Desktop/App/App.ipa --app 1:535115645434:ios:10f3abccd73cdbd239e443 --release-notes "test firebase" --groups "developer"
```

Con bandera `release-notes` se especifica una nota de la version del App.ipa. (opcional)

Con bandera `groups` se especifica el grupo de verificadores los cuales tendran acceso a la apk beta distribuida, si no se especifica un grupo el apk sera distribuido a todos los usuario verificadores registrados. (opcional)

- Verifier groups available:
  - developer
  - test
  - production

## Versions

Ionic:

- Ionic CLI : 7.1.1
- Ionic Framework : @ionic/angular 7.8.6
- @angular-devkit/build-angular : 16.2.16
- @angular-devkit/schematics : 16.2.16
- @angular/cli : 16.2.16
- @ionic/angular-toolkit : 9.0.0

Capacitor:

- @capacitor/cli: 6.2.0
- @capacitor/core: 6.2.0
- @capacitor/android: 6.2.0
- @capacitor/ios: 6.2.0

System:

- NodeJS : v18.18.1
- npm : 8.12.2

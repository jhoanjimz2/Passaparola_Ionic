import { NgModule, CUSTOM_ELEMENTS_SCHEMA }     from '@angular/core';
import { CommonModule }                         from '@angular/common';
import { RouterModule }                         from '@angular/router';
import { IonicModule }                          from '@ionic/angular';
import { FormsModule, ReactiveFormsModule }     from '@angular/forms';
import { GoogleMapsModule }                     from '@angular/google-maps';

import { TranslateModule }                      from '@ngx-translate/core';
import { NgxScannerQrcodeModule, LOAD_WASM }    from 'ngx-scanner-qrcode';
import { NgxQrcodeStylingModule }               from 'ngx-qrcode-styling';

import { HeaderAuthComponent }                  from './header-auth/header-auth.component';
import { HeaderComponent }                      from './header/header.component';
import { NavbarComponent }                      from './navbar/navbar.component';
import { MapComponent }                         from './map/map.component';
import { MenuComponent }                        from './menu/menu.component';
import { PipesModule }                          from '../shared/pipes/pipes.module';
import { ScanQrComponent }                      from './scan-qr/scan-qr.component';
import { KeyboardAtmComponent }                 from './keyboard-atm/keyboard-atm.component';
import { FormattNumberPipe }                    from '../shared/pipes/formatt-number.pipe';
import { ConfirmationPinComponent }             from './confirmation-pin/confirmation-pin.component';
import { InviteCardComponent }                  from './invite-card/invite-card.component';
import { StoreCardComponent }                   from './store-card/store-card.component';
import { OnlineStoreCardComponent }             from './online-store-card/online-store-card.component';
import { MallCardComponent }                    from './mall-card/mall-card.component';
import { LocalStoreCardComponent }              from './local-store-card/local-store-card.component';
import { PublicityCardComponent }               from './publicity-card/publicity-card.component';
import { ProductCardComponent }                 from './product-card/product-card.component';
import { PageActionButtonComponent }            from './page-action-button/page-action-button.component';
import { InitialModalInfoComponent }            from './initial-modal-info/initial-modal-info.component';
import { TemporalImgComponent }                 from './temporal-img/temporal-img.component';
import { ModalStartAppComponent }               from './modal-start-app/modal-start-app.component';
import { ModalSplashScreenComponent }           from './modal-splash-screen/modal-splash-screen.component';
import { BusinessSuggestionCardComponent }      from './business-suggestion-card/business-suggestion-card.component';
import { InfoCardComponent }                    from './info-card/info-card.component';
import { QrCodeComponent }                      from './qr-code/qr-code.component';
import { BankCardComponent }                    from './bank-card/bank-card.component';
import { PaymentNotificationComponent }         from './payment-notification/payment-notification.component';
import { KeyboardTpvComponent }                 from './keyboard-tpv/keyboard-tpv.component';
import { PaymentHeaderComponent }               from './payment-header/payment-header.component';
import { LastSegmentPipe }                      from '../shared/pipes/last-segment.pipe';
import { PinInputComponent }                    from './pin-input/pin-input.component';
import { OptionsRechargeComponent }             from './options-recharge/options-recharge.component';
import { RechargeComponent }                    from './recharge/recharge.component';
import { RechargeSuccesfullyComponent }         from './recharge-succesfully/recharge-succesfully.component';
import { AddPaymentMethodComponent }            from './add-payment-method/add-payment-method.component';
import { SelectListSeatComponent }              from './select-list-seat/select-list-seat.component';
import { ModalRechargeTransferComponent }       from './modal-recharge-transfer/modal-recharge-transfer.component';
import { ModalRechargeTransferInfoComponent }   from './modal-recharge-transfer-info/modal-recharge-transfer-info.component';
import { TransferRechargeSuccesfullyComponent } from './transfer-recharge-succesfully/transfer-recharge-succesfully.component';
import { OnboardingComponent }                  from './onboarding/onboarding.component';
import { NotificationsConfigComponent }         from './notifications-config/notifications-config.component';
import { ModalRedirectInfoComponent }           from './modal-redirect-info/modal-redirect-info.component';
import { ModalGalleryComponent }                from './modal-gallery/modal-gallery.component';
import { VoucherExtraEventComponent }           from './vouchers/voucher-extra-event/voucher-extra-event.component';
import { VoucherEntradaEventComponent }         from './vouchers/voucher-entrada-event/voucher-entrada-event.component';
import { VoucherOfertaComponent }               from './vouchers/voucher-oferta/voucher-oferta.component';
import { QrTicketComponent }                    from './qr-ticket/qr-ticket.component';
import { SeleccionarProductosComponent }        from './productos/seleccionar-productos/seleccionar-productos.component';
import { BuscarProductosComponent }             from './productos/buscar-productos/buscar-productos.component';
import { CrearProductoComponent }               from './productos/crear-producto/crear-producto.component';
import { DirectivesModule }                     from '../shared/directives/directives.module';
import { AutocompleteComponent }                from './autocomplete/autocomplete.component';
import { CancelEditAddressComponent }           from './addresses/cancel-edit-address/cancel-edit-address.component';
import { CreateAddressComponent }               from './addresses/create-address/create-address.component';
import { ListAddressesComponent }               from './addresses/list-addresses/list-addresses.component';
import { ModalWelcomeComponent }                from './modal-welcome/modal-welcome.component';
import { InitialOnBoardingComponent }           from './initial-on-boarding/initial-on-boarding.component';

LOAD_WASM().subscribe();

@NgModule({
  declarations: [
    BankCardComponent,
    BusinessSuggestionCardComponent,
    ConfirmationPinComponent,
    HeaderAuthComponent,
    HeaderComponent,
    InfoCardComponent,
    InitialModalInfoComponent,
    InviteCardComponent,
    KeyboardAtmComponent,
    KeyboardTpvComponent,
    LastSegmentPipe,
    LocalStoreCardComponent,
    MallCardComponent,
    MapComponent,
    MenuComponent,
    ModalSplashScreenComponent,
    ModalStartAppComponent,
    NavbarComponent,
    OnlineStoreCardComponent,
    PageActionButtonComponent,
    PaymentHeaderComponent,
    PaymentNotificationComponent,
    ProductCardComponent,
    PublicityCardComponent,
    QrCodeComponent,
    ScanQrComponent,
    StoreCardComponent,
    TemporalImgComponent,
    PinInputComponent,
    OptionsRechargeComponent,
    RechargeComponent,
    RechargeSuccesfullyComponent,
    AddPaymentMethodComponent,
    SelectListSeatComponent,
    ModalRechargeTransferComponent,
    ModalRechargeTransferInfoComponent,
    TransferRechargeSuccesfullyComponent,
    ModalRedirectInfoComponent,
    OnboardingComponent,
    ModalGalleryComponent,
    NotificationsConfigComponent,
    ModalGalleryComponent,
    VoucherExtraEventComponent,
    VoucherEntradaEventComponent,
    VoucherOfertaComponent,
    QrTicketComponent,
    SeleccionarProductosComponent,
    BuscarProductosComponent,
    CrearProductoComponent,
    AutocompleteComponent,
    CancelEditAddressComponent,
    CreateAddressComponent,
    ListAddressesComponent,
    ModalWelcomeComponent,
    InitialOnBoardingComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    GoogleMapsModule,
    IonicModule,
    NgxQrcodeStylingModule,
    NgxScannerQrcodeModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    DirectivesModule,
    FormattNumberPipe,
  ],
  exports: [
    BankCardComponent,
    BusinessSuggestionCardComponent,
    ConfirmationPinComponent,
    HeaderAuthComponent,
    HeaderComponent,
    InfoCardComponent,
    InitialModalInfoComponent,
    InviteCardComponent,
    KeyboardAtmComponent,
    KeyboardTpvComponent,
    LastSegmentPipe,
    LocalStoreCardComponent,
    MallCardComponent,
    MapComponent,
    MenuComponent,
    ModalSplashScreenComponent,
    ModalStartAppComponent,
    NavbarComponent,
    OnlineStoreCardComponent,
    PageActionButtonComponent,
    PaymentHeaderComponent,
    PaymentNotificationComponent,
    ProductCardComponent,
    PublicityCardComponent,
    QrCodeComponent,
    ScanQrComponent,
    StoreCardComponent,
    TemporalImgComponent,
    PinInputComponent,
    OptionsRechargeComponent,
    RechargeComponent,
    RechargeSuccesfullyComponent,
    AddPaymentMethodComponent,
    SelectListSeatComponent,
    ModalRechargeTransferComponent,
    ModalRechargeTransferInfoComponent,
    TransferRechargeSuccesfullyComponent,
    ModalRedirectInfoComponent,
    OnboardingComponent,
    ModalRedirectInfoComponent,
    NotificationsConfigComponent,
    VoucherExtraEventComponent,
    VoucherEntradaEventComponent,
    VoucherOfertaComponent,
    QrTicketComponent,
    SeleccionarProductosComponent,
    AutocompleteComponent,
    ModalWelcomeComponent,
    InitialOnBoardingComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentModule {}

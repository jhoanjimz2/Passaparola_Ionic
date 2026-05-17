import { Component, OnInit }                                                    from '@angular/core';
import { IonContent, IonIcon }                                                  from '@ionic/angular/standalone';
import { HeaderComponent }                                                      from '../../components/header/header.component';
import { SliderPlatformsComponent }                                             from './components/slider-platforms/slider-platforms.component';
import { ModalController }                                                      from '@ionic/angular';
import { WelcomeComponent }                                                     from './components/welcome/welcome.component';
import { ConfirmJoyerComponent }                                                from './components/confirm-joyer/confirm-joyer.component';
import { SuccessWishbuyComponent }                                              from './components/success-wishbuy/success-wishbuy.component';
import { CommonModule }                                                         from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective }                                                     from 'ngx-mask';
import { JointlybuyService }                                                    from 'src/app/shared/services/jointlybuy.service';
import { PayWishbuyComponent }                                                  from './components/pay-wishbuy/pay-wishbuy.component';
import { PaymentsService }                                                      from 'src/app/shared/services/payments.service';

@Component({
  selector: 'app-create-wishbuy',
  templateUrl: './create-wishbuy.component.html',
  styleUrls: ['./create-wishbuy.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    HeaderComponent,
    IonIcon,
    SliderPlatformsComponent,
    SuccessWishbuyComponent,
    NgxMaskDirective
  ]
})
export class CreateWishbuyComponent implements OnInit {

  confirmWishbuy: boolean = false;

  form: FormGroup = this.formBuilder.group({
    productLink: new FormControl('', [Validators.required]),
    link1: new FormControl(''),
    link2: new FormControl(''),
    buyer: new FormControl(false),
    purchased: new FormControl(''),
    price: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private jointlybuyService: JointlybuyService,
    private paymentsService: PaymentsService
  ) {}

  ngOnInit() {
    this.form.get('buyer')?.valueChanges.subscribe(isChecked => {
      this.updateConditionalValidators(isChecked);
    });
  }

  updateConditionalValidators(isChecked: boolean) {
    const purchasedControl = this.form.get('purchased');
    const priceControl = this.form.get('price');

    if (isChecked) {
      purchasedControl?.setValidators([Validators.required]);
      priceControl?.setValidators([Validators.required]);
    } else {
      purchasedControl?.clearValidators();
      priceControl?.clearValidators();
    }
    purchasedControl?.updateValueAndValidity();
    priceControl?.updateValueAndValidity();
  }

  get isFormValid(): boolean {
    return this.form.valid;
  }

  async welcome() {
    const modal = await this.modalCtrl.create({
      component: WelcomeComponent,
      cssClass: ['radius-modals', 'modal-90vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }

  async onJoyerCheckChange() {
    const modal = await this.modalCtrl.create({
      component: ConfirmJoyerComponent,
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    await modal.present();
  }

  async payWishbuy(purchasedNumber: number, priceNumber: number) {
    const modal = await this.modalCtrl.create({
      component: PayWishbuyComponent,
      cssClass: ['radius-modals', 'modal-65vh'],
      componentProps: {
        priceNumber,
        purchasedNumber
      },
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    return data;
  }

    async confirmWish() {
      if (!this.form.valid) {
        return;
      }

      const priceValue = this.form.controls['price'].value;
      const priceNumber = priceValue ? parseFloat(priceValue.toString().replace(/\./g, '').replace(',', '.')) : undefined;

      const purchasedValue = this.form.controls['purchased'].value;
      const purchasedNumber = purchasedValue ? Number(purchasedValue) : undefined;

      let paymentResult: any = null;

      if (this.form.controls['buyer'].value === true) {
        paymentResult = await this.payWishbuy(purchasedNumber!, priceNumber!);
        if (!paymentResult || !paymentResult.success) {
          return;
        }
      }

      this.jointlybuyService.createWishbuy({
        productLink: this.form.controls['productLink'].value,
        link1: this.form.controls['link1'].value || undefined,
        link2: this.form.controls['link2'].value || undefined,
        buyer: this.form.controls['buyer'].value,
        purchased: purchasedNumber,
        price: priceNumber,
      }).subscribe({
        next: (response) => {
          if (this.form.controls['buyer'].value === true && paymentResult) {
            this.wishbuyTransaction({
              walletTransactionId: paymentResult.walletTransactionId,
              wishbuyId: response.id,
              addressId: paymentResult.addressId,
              amount: priceNumber!,
              quantity: purchasedNumber!
            });
          } else {
            this.confirmWishbuy = true;
          }
        }
      });
  }

  newWishBuy() {
    this.confirmWishbuy = false;
    this.form.reset({
      productLink: '',
      link1: '',
      link2: '',
      buyer: false,
      purchased: '',
      price: '',
    });
  }

  wishbuyTransaction(object: {
    walletTransactionId: string,
    wishbuyId: string,
    addressId: string,
    amount: number,
    quantity: number
  }) {
    this.jointlybuyService.willbuyTransaction({
      observation: 'Payment wishbuy',
      status: true,
      amount: object.amount,
      quantity: object.quantity,
      walletTransactionId: object.walletTransactionId,
      willbuy: {
        id: object.wishbuyId
      },
      address: {
        id: object.addressId
      }
    }).subscribe({
      next: () => {
        this.confirmWishbuy = true;
        this.paymentsService.getWalletSelected().subscribe();
      }
    })
  }

}

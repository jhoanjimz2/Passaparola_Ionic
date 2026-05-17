import { Component, OnDestroy }     from '@angular/core';
import { Subscription }             from 'rxjs';
import { ProductosService }         from 'src/app/shared/services';
import { BuscarProductosComponent } from '../buscar-productos/buscar-productos.component';
import { ModalController }          from '@ionic/angular';

@Component({
  selector: 'app-seleccionar-productos',
  templateUrl: './seleccionar-productos.component.html',
  styleUrls: ['./seleccionar-productos.component.scss'],
})
export class SeleccionarProductosComponent implements OnDestroy {

  subscription!: Subscription;
  productosSeleccionados!: any[];

  constructor(
    private productosService: ProductosService,
    private modalController: ModalController
  ) {
    this.subscription = this.productosService.selectProducts().subscribe({
      next: (products) => this.productosSeleccionados = products
    });
    this.productosService.getMyProducts().subscribe()
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  restar(id: number) {
    const producto = this.productosSeleccionados.find(p => p.id === id);
    if (producto && producto.amount > 1) {
      producto.amount -= 1;
      producto.value = producto.price * producto.amount;
      this.productosService.addProductSelect([...this.productosSeleccionados]);
    }
  }

  sumar(id: number) {
    const producto = this.productosSeleccionados.find(p => p.id === id);
    if (producto) {
      producto.amount += 1;
      producto.value = producto.price * producto.amount;
      this.productosService.addProductSelect([...this.productosSeleccionados]);
    }
  }


  eliminar(id: number) {
    this.productosSeleccionados = this.productosSeleccionados.filter(producto => producto.id !== id);
    this.productosService.addProductSelect(this.productosSeleccionados);
  }

  async openSearchProductos() {
    const modal = await this.modalController.create({
      component: BuscarProductosComponent,
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController }              from '@ionic/angular';
import { Subscription }                 from 'rxjs';
import { KeyboardService }              from 'src/app/shared/services/keyboard.service';
import { ProductosService }             from 'src/app/shared/services';
import { CrearProductoComponent }       from '../crear-producto/crear-producto.component';

@Component({
  selector: 'app-buscar-productos',
  templateUrl: './buscar-productos.component.html',
  styleUrls: ['./buscar-productos.component.scss'],
})
export class BuscarProductosComponent  implements OnInit, OnDestroy {
  query: string = '';

  isKeyboardOpen = false;
  keyboardSub!: Subscription;


  subscription!: Subscription;
  subscription2!: Subscription;

  todosProductos!: any[];
  filtradosProductos!: any[];
  seleccionProductos!: any[];

  constructor(
    private keyboardService: KeyboardService,
    private modalController: ModalController,
    private productosService: ProductosService
  ) {
    this.keyboardSub = this.keyboardService.isKeyboardOpen$.subscribe(isOpen => {
      this.isKeyboardOpen = isOpen;
    });
    this.subscription = this.productosService.selectProducts().subscribe({
      next: (products) => this.seleccionProductos = products
    });
    this.subscription2 = this.productosService.myProducts().subscribe({
      next: (products) => {
        this.todosProductos = products;
        this.filtradosProductos = this.todosProductos;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
  }
  async openCreateProduct() {
    const modal = await this.modalController.create({
      component: CrearProductoComponent,
    });
    modal.present();
  }

  onSearchChange() {
    const searchTerm = this.query?.toLowerCase().trim() || '';
    if (!searchTerm) {
      this.filtradosProductos = this.todosProductos;
      return;
    }
    this.filtradosProductos = this.todosProductos.filter(producto =>
      producto.name.toLowerCase().includes(searchTerm)
    );
  }

  compararProductosPorIndice(id: number): boolean {
    return this.seleccionProductos.some(producto => producto.id === id);
  }
  eliminar(id: number) {
    this.seleccionProductos = this.seleccionProductos.filter(producto => producto.id !== id);
    this.productosService.updateProducsSelect(this.seleccionProductos);
  }
  seleccionarProducto(producto: any) {
    const existe = this.seleccionProductos.some(p => p.id === producto.id);
    if (!existe) this.productosService.addProductSelect(producto);
  }



}

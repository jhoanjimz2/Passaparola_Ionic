import { Component, Input }                from '@angular/core';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule }                    from '@angular/common';
import { ModalController }                 from '@ionic/angular';
import { AddressCardComponent }            from "../address-card/address-card.component";
import { Address }                         from 'src/app/shared/interfaces/address/address.interface';
import { AddressService }                  from 'src/app/shared/services/address.service';

@Component({
  selector: 'app-modal-delete-address',
  templateUrl: './modal-delete-address.component.html',
  styleUrls: ['./modal-delete-address.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonSpinner,
    AddressCardComponent,
    CommonModule
  ]
})
export class ModalDeleteAddressComponent {
  @Input() address: Address = {} as Address;

  confirmDelete: boolean = false;
  isDeleting: boolean = false;
  deleteError: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private addressService: AddressService
  ) {}

  /**
   * Confirma y ejecuta la eliminación de la dirección
   */
  eliminar() {
    if (!this.address?.id) {
      console.error('No se puede eliminar: ID de dirección no válido');
      return;
    }

    this.isDeleting = true;
    this.deleteError = false;

    this.addressService.delete(this.address.id).subscribe({
      next: (response) => {
        console.log('Dirección eliminada exitosamente:', response);
        this.isDeleting = false;
        this.confirmDelete = true;

        // Actualizar la lista de direcciones
        this.addressService.getAllMyAddress().subscribe({
          error: (error) => console.error('Error al actualizar lista:', error)
        });
      },
      error: (error) => {
        console.error('Error al eliminar dirección:', error);
        this.isDeleting = false;
        this.deleteError = true;
      }
    });
  }

  /**
   * Cierra el modal
   * Si se eliminó exitosamente, notifica al componente padre
   */
  close() {
    this.modalCtrl.dismiss({
      deleted: this.confirmDelete,
      addressId: this.address?.id
    });
  }

  /**
   * Reintentar eliminación en caso de error
   */
  retry() {
    this.deleteError = false;
    this.eliminar();
  }
}

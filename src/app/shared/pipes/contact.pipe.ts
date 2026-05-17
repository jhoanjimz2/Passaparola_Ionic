import { Pipe, PipeTransform } from '@angular/core';
import { Contact }             from '../interfaces/contact/contact.interface';

@Pipe({
  name: 'contactPipe',
})
export class ContactPipe implements PipeTransform {
  transform(value: any, arg: any): any {
    const result: Contact[] = [];
    for (const contact of value) {
      if (contact) {
        if (
          contact.name!.toUpperCase().indexOf(arg.toUpperCase()) > -1 ||
          contact.phone!.toUpperCase().indexOf(arg.toUpperCase()) > -1
        ) {
          result.push(contact);
        }
      }
    }
    return result;
  }
}

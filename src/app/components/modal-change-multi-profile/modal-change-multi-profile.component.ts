import { Component }    from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule }  from '@ionic/angular';

interface Account {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

@Component({
  selector: 'app-modal-change-multi-profile',
  templateUrl: './modal-change-multi-profile.component.html',
  styleUrls: ['./modal-change-multi-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ModalChangeMultiProfileComponent {
  accounts: Account[] = [
    {
      id: '1',
      name: 'John Winsels Pancillo',
      username: '@nomeutente',
      avatar: 'https://placehold.co/80x80?text=profile'
    },
    {
      id: '2',
      name: 'John Winsels Skior',
      username: '@nomeutente',
      avatar: 'https://placehold.co/80x80?text=profile'
    },
    {
      id: '3',
      name: 'Johm',
      username: '@nomeutente',
      avatar: 'https://placehold.co/80x80?text=profile'
    }
  ];

  onSelectAccount(account: Account): void {
    console.log('Selected account:', account);
    // Implement your account switching logic here
  }

  onAddAccount(): void {
    console.log('Add new account');
    // Implement your add account logic here
  }
}

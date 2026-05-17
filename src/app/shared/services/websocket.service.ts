import { Injectable } from '@angular/core';

import { Manager, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user/user.interface';
import { BroadcastMessage } from '../interfaces/websocket/broadcast-message.interface';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  serverIsOnline = false;
  socket: Socket | undefined;

  private socketCashPayment!: BehaviorSubject<any>;
  private socketPayment!: BehaviorSubject<any>;
  private socketCancelPayment!: BehaviorSubject<any>;

  constructor() {
    this.socketCashPayment = new BehaviorSubject(false);
    this.socketPayment = new BehaviorSubject(false);
    this.socketCancelPayment = new BehaviorSubject(false);
  }

  conectToServer(token: string) {
    const manager = new Manager(environment.wsUrl, {
      extraHeaders: {
        authentication: token,
      },
    });
    this.socket = manager.socket('/');
    this.addListeners(this.socket);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
    }
  }

  addListeners(socket: Socket) {
    socket.on('connect', () => {
      this.serverIsOnline = true;
      console.info('Server ws connected');
    });

    socket.on('disconnect', () => {
      this.serverIsOnline = false;
      console.info('Server ws disconnect');
    });

    socket.on('broadcastMessage', (data: BroadcastMessage) => {
      if (data.type === 'cashPayment') this.socketCashPaymentSet(data);

      if (data.type === 'payment') this.socketPaymentSet(data);

      if (data.type === 'cancelPayment') this.socketCancelPaymentSet(data);
    });
  }

  emitEvent() {}

  socketCashPaymentWatch(): Observable<any> {
    return this.socketCashPayment.asObservable();
  }

  socketCashPaymentSet(data: any) {
    const user: User = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    if (!user) return;

    if (user.userID === data.userId) this.socketCashPayment.next(data.payload);
  }

  socketPaymentWatch(): Observable<any> {
    return this.socketPayment.asObservable();
  }

  socketPaymentSet(data: any) {
    const user: User = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    if (!user) return;

    if (user.userID === data.userId) this.socketPayment.next(data.payload);
  }

  socketCancelPaymentWatch(): Observable<any> {
    return this.socketCancelPayment.asObservable();
  }

  socketCancelPaymentSet(data: any) {
    const user: User = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    if (!user) return;

    if (user.userID === data.userId)
      this.socketCancelPayment.next(data.payload);
  }

  emitMessage(message: BroadcastMessage) {
    this.socket?.emit('emit-from-client', message);
  }
}

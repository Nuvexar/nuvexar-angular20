import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();

  private idCounter = 0;

  show(message: string, type: ToastType = 'info', delay: number = 4000) {
    const id = ++this.idCounter;
    const toast: Toast = { id, message, type };

    this._toasts.update(list => [...list, toast]);

    setTimeout(() => {
      this.remove(id);
    }, delay);
  }

  remove(id: number) {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }

  clear() {
    this._toasts.set([]);
  }

}

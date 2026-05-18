'use client';

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastState = {
  toasts: Toast[];
  push: (message: string, type?: ToastType) => string;
  dismiss: (id: string) => void;
};

let toastSeq = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, type = 'success') => {
    const id = `toast-${++toastSeq}-${Date.now()}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

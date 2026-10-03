import React from 'react';
import { PaymentStatus, OrderStatus } from '../types';
import { CheckCircle2, Clock, XCircle, AlertCircle, Printer, PackageCheck, Layers } from 'lucide-react';

interface Props {
  type: 'payment' | 'order';
  status: PaymentStatus | OrderStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<Props> = ({ type, status, size = 'sm' }) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'text-xs px-2.5 py-1' : 'text-sm px-3.5 py-1.5';

  if (type === 'payment') {
    switch (status) {
      case 'Pembayaran Valid':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}>
            <CheckCircle2 className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            Lunas (Valid)
          </span>
        );
      case 'Menunggu Validasi':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses}`}>
            <Clock className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            Menunggu Validasi
          </span>
        );
      case 'Pembayaran Ditolak':
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClasses}`}>
            <XCircle className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            Pembayaran Ditolak
          </span>
        );
      case 'Belum Bayar':
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
            <AlertCircle className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            Belum Bayar
          </span>
        );
    }
  }

  // Order status
  switch (status) {
    case 'Selesai':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}>
          <PackageCheck className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          Selesai
        </span>
      );
    case 'Dicetak':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-blue-50 text-blue-800 border border-blue-200 ${sizeClasses}`}>
          <Printer className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          Sedang Dicetak
        </span>
      );
    case 'Diproses':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 ${sizeClasses}`}>
          <Layers className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          Diproses
        </span>
      );
    case 'Ditolak':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-rose-50 text-rose-800 border border-rose-200 ${sizeClasses}`}>
          <XCircle className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          Pesanan Ditolak
        </span>
      );
    case 'Menunggu Validasi':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
          <Clock className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          Menunggu Validasi
        </span>
      );
  }
};

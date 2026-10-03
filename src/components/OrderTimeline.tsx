import React from 'react';
import { Order } from '../types';
import { CheckCircle2, Clock, XCircle, AlertCircle, FileCheck2, Printer, PackageCheck } from 'lucide-react';

interface Props {
  order: Order;
}

export const OrderTimeline: React.FC<Props> = ({ order }) => {
  // Define standard steps in the printing lifecycle
  const steps = [
    {
      id: 'step_order',
      label: 'Pesanan Dibuat',
      isCompleted: true,
      icon: FileCheck2,
      subtext: order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '',
    },
    {
      id: 'step_payment',
      label: 'Pembayaran QRIS',
      isCompleted: order.paymentStatus === 'Pembayaran Valid',
      isPending: order.paymentStatus === 'Menunggu Validasi',
      isRejected: order.paymentStatus === 'Pembayaran Ditolak',
      isWaiting: order.paymentStatus === 'Belum Bayar',
      icon: Clock,
      subtext: order.paymentStatus,
    },
    {
      id: 'step_process',
      label: 'File & Setting',
      isCompleted: ['Diproses', 'Dicetak', 'Selesai'].includes(order.orderStatus),
      isPending: order.orderStatus === 'Diproses',
      isRejected: order.orderStatus === 'Ditolak',
      icon: Printer,
      subtext: order.orderStatus === 'Diproses' ? 'Pre-flight' : '',
    },
    {
      id: 'step_print',
      label: 'Produksi & Cetak',
      isCompleted: ['Dicetak', 'Selesai'].includes(order.orderStatus),
      isPending: order.orderStatus === 'Dicetak',
      icon: Printer,
      subtext: order.orderStatus === 'Dicetak' ? 'Mesin UV' : '',
    },
    {
      id: 'step_done',
      label: 'Selesai / Diambil',
      isCompleted: order.orderStatus === 'Selesai',
      icon: PackageCheck,
      subtext: order.orderStatus === 'Selesai' ? 'Siap' : '',
    },
  ];

  return (
    <div className="w-full py-4">
      {/* Step nodes row */}
      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

        {steps.map((step, idx) => {
          let circleBg = 'bg-slate-100 text-slate-400 border-slate-300';
          if (step.isRejected) {
            circleBg = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-100';
          } else if (step.isCompleted) {
            circleBg = 'bg-emerald-600 text-white border-emerald-700 shadow-sm';
          } else if (step.isPending) {
            circleBg = 'bg-amber-500 text-white border-amber-600 ring-4 ring-amber-100 animate-pulse';
          }

          const IconComponent = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${circleBg}`}
                title={step.label}
              >
                {step.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : step.isRejected ? (
                  <XCircle className="w-4 h-4" />
                ) : step.isPending ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-semibold">{idx + 1}</span>
                )}
              </div>
              <span className="mt-2 text-xs font-medium text-slate-800 text-center max-w-[70px] leading-tight">
                {step.label}
              </span>
              {step.subtext && (
                <span className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[75px]">
                  {step.subtext}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed logs */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-600 mb-3">Catatan Riwayat Sistem:</p>
          <div className="space-y-2.5">
            {order.timeline.slice().reverse().map((ev, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-slate-800">{ev.title}</span>
                    <span className="text-[11px] text-slate-400 tabular-nums shrink-0">{ev.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

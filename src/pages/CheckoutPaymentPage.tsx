import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { QRISDisplay } from '../components/QRISDisplay';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutPaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, submitPaymentProof } = useShop();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Pesanan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">Nomor pesanan yang Anda tuju tidak terdaftar di sistem.</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const handleProofSubmitted = (proofUrl: string, proofName: string) => {
    submitPaymentProof(order.id, proofUrl, proofName);
    
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore
    }

    setTimeout(() => {
      navigate('/orders');
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat Pesanan</span>
        </Link>
        <span className="text-xs font-medium text-slate-500">
          Metode: <strong className="text-red-600">QRIS Standar Nasional</strong>
        </span>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Pembayaran QRIS Pesanan
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Scan QRIS di bawah menggunakan mobile banking atau e-wallet apa pun, kemudian unggah struk transfer untuk diverifikasi oleh admin.
        </p>
      </div>

      {/* QRIS Component */}
      <QRISDisplay order={order} onSubmitProof={handleProofSubmitted} />
    </div>
  );
};

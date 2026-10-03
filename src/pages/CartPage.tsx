import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit3, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Check, QrCode } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, updateCartNotes, createOrder } = useShop();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');

  // Shipping / Contact info state for checkout
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Budi Santoso');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'user@banten.com');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '0857-1234-5678');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || 'Jl. Raya Cilegon Km 4 No. 12, Serang, Banten');

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFee = 0; // Free pickup or promo
  const total = subtotal + shippingFee;

  const handleStartEditNote = (itemId: string, currentNote?: string) => {
    setEditingNoteId(itemId);
    setTempNote(currentNote || '');
  };

  const handleSaveNote = (itemId: string) => {
    updateCartNotes(itemId, tempNote);
    setEditingNoteId(null);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder = createOrder({
      userId: currentUser?.id || 'guest_user',
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items: cart,
    });

    navigate(`/payment/${newOrder.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">
          Keranjang Belanja Anda Masih Kosong
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Silakan jelajahi katalog produk percetakan kami dan pilih spanduk, stiker, kartu nama, atau brosur yang Anda inginkan.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition-all shadow-md"
        >
          <span>Mulai Pesan Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Keranjang Belanja Percetakan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Periksa item pesanan Anda sebelum melanjutkan ke pembayaran QRIS.
          </p>
        </div>
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tambah Produk Lain</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start gap-4">
                {/* Product/Design thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative group">
                  <img
                    src={item.fileUrl || item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                  {item.fileUrl && (
                    <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-slate-900/80 text-white px-1 rounded">
                      Desain
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {item.productName}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Hapus dari keranjang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Specs breakdown */}
                  <div className="mt-1.5 space-y-1 text-xs text-slate-600">
                    <p><span className="text-slate-400">Ukuran:</span> <strong className="text-slate-800">{item.size}</strong></p>
                    <p><span className="text-slate-400">Bahan:</span> {item.material}</p>
                    <p><span className="text-slate-400">Finishing:</span> {item.finishing}</p>
                    {item.fileName && (
                      <p className="truncate text-emerald-700 font-medium">
                        File Desain: {item.fileName} {item.fileSize ? `(${item.fileSize})` : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes block */}
              <div className="p-3 bg-slate-50 rounded-xl text-xs">
                {editingNoteId === item.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={tempNote}
                      onChange={e => setTempNote(e.target.value)}
                      placeholder="Tulis catatan pesanan..."
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-[11px]"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleSaveNote(item.id)}
                        className="px-3 py-1 bg-orange-600 text-white rounded-md text-[11px] font-semibold"
                      >
                        Simpan Catatan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-600 italic">
                      <span className="font-semibold not-italic text-slate-500">Catatan: </span>
                      {item.notes || 'Tidak ada catatan khusus.'}
                    </p>
                    <button
                      onClick={() => handleStartEditNote(item.id, item.notes)}
                      className="text-orange-600 hover:text-orange-700 text-[11px] font-semibold shrink-0 flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{item.notes ? 'Ubah' : '+ Catatan'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Stepper & Price row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs tabular-nums text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">@ Rp {item.unitPrice.toLocaleString('id-ID')}</span>
                  <span className="text-base font-extrabold text-slate-900 tabular-nums">
                    Rp {item.totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Checkout & Summary */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-200">
            Data Pengiriman & Checkout
          </h2>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nama Penerima / Pemesan:
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp:
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Notifikasi:
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Alamat Pengiriman / Catatan Ambil di Tempat:
              </label>
              <textarea
                rows={2}
                required
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                placeholder="Alamat lengkap tujuan kirim atau tulis 'Ambil Mandiri di Workshop Serang'..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            {/* Price calculation block */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.length} item)</span>
                <span className="font-semibold tabular-nums text-slate-900">
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim / Pickup</span>
                <span className="font-semibold text-emerald-700">GRATIS</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Metode Pembayaran</span>
                <span className="font-bold text-red-600">QRIS Eksklusif</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Tagihan:</span>
                <span className="text-2xl font-black text-slate-900 tabular-nums">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200/60 flex items-start gap-2.5 text-xs text-red-900">
              <QrCode className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Hanya Pembayaran QRIS</p>
                <p className="text-[11px] text-red-700 mt-0.5">
                  Setelah klik "Lanjut ke Pembayaran QRIS", kode barcode QRIS akan ditampilkan beserta hitung mundur 24 jam.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Lanjut ke Pembayaran QRIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

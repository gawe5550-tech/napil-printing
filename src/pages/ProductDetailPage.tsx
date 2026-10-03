import React, { useState, useId } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { BANNER_IMAGE } from '../data/initialData';
import { ArrowLeft, Upload, FileText, CheckCircle2, ShoppingBag, ShieldCheck, Clock, Info, Check } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart } = useShop();

  const product = products.find(p => p.id === id) || products[0];

  // Specifications state
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]?.id || '');
  const [customWidth, setCustomWidth] = useState<number>(3);
  const [customHeight, setCustomHeight] = useState<number>(1);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(product.materials[0]?.id || '');
  const [selectedFinishing, setSelectedFinishing] = useState<string>(product.finishings[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(product.minQty || 1);
  const [notes, setNotes] = useState<string>('');

  // File upload state
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');

  // Dynamic price calculation
  const sizeObj = product.sizes.find(s => s.id === selectedSize) || product.sizes[0];
  const materialObj = product.materials.find(m => m.id === selectedMaterial) || product.materials[0];
  const finishingObj = product.finishings.find(f => f.id === selectedFinishing) || product.finishings[0];

  let calculatedMultiplier = sizeObj?.multiplier || 1;
  if (product.allowCustomDimensions && selectedSize === 'custom') {
    calculatedMultiplier = Math.max(0.5, customWidth * customHeight);
  }

  const baseCalculated = product.basePrice * calculatedMultiplier;
  const unitPrice = Math.round(baseCalculated + (materialObj?.priceAdd || 0) + (finishingObj?.priceAdd || 0));
  const totalPrice = unitPrice * Math.max(product.minQty, quantity);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');

    const reader = new FileReader();
    reader.onloadend = () => {
      setFileUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUseSampleDesign = () => {
    setFileUrl(product.image);
    setFileName(`desain_${product.slug}_final_cmyk.pdf`);
    setFileSize('5.4 MB');
  };

  const handleAddToCart = () => {
    const sizeLabel = selectedSize === 'custom'
      ? `Dimensi Kustom ${customWidth}m x ${customHeight}m (${(customWidth * customHeight).toFixed(1)} m²)`
      : sizeObj.label;

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      size: sizeLabel,
      material: materialObj.label,
      finishing: finishingObj.label,
      customWidth: selectedSize === 'custom' ? customWidth : undefined,
      customHeight: selectedSize === 'custom' ? customHeight : undefined,
      quantity,
      unitPrice,
      totalPrice,
      fileUrl: fileUrl || undefined,
      fileName: fileName || undefined,
      fileSize: fileSize || undefined,
      notes: notes.trim() || undefined,
    });

    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Produk</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image showcase & Info */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur text-white">
              {product.category}
            </span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Keunggulan Cetak Produk:</h4>
            <div className="space-y-2">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Estimasi Waktu Pengerjaan: {product.estimatedDays}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Garansi jika hasil buram atau cacat cetak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customization & Purchase Configurator */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
              Konfigurasi Cetak Online
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-display">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Form Options */}
          <div className="space-y-6">
            {/* 1. Size Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Pilih Ukuran / Dimensi Cetak
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.sizes.map(sz => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setSelectedSize(sz.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedSize === sz.id
                        ? 'border-orange-500 bg-orange-50/40 text-slate-900 shadow-sm ring-1 ring-orange-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{sz.label}</span>
                      {selectedSize === sz.id && <Check className="w-3.5 h-3.5 text-orange-600" />}
                    </div>
                    {sz.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{sz.description}</p>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Dimensions Input for banner/spanduk */}
              {product.allowCustomDimensions && selectedSize === 'custom' && (
                <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block font-medium text-slate-600 mb-1">Panjang (Meter):</label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.1"
                      value={customWidth}
                      onChange={e => setCustomWidth(Math.max(0.5, parseFloat(e.target.value) || 1))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold"
                    />
                  </div>
                  <span className="font-bold text-slate-400 mt-5">✕</span>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block font-medium text-slate-600 mb-1">Lebar (Meter):</label>
                    <input
                      type="number"
                      min="0.5"
                      step="0.1"
                      value={customHeight}
                      onChange={e => setCustomHeight(Math.max(0.5, parseFloat(e.target.value) || 1))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold"
                    />
                  </div>
                  <div className="w-full text-slate-500 text-[11px]">
                    Total luas: <strong className="text-slate-800">{(customWidth * customHeight).toFixed(2)} m²</strong>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Material Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. Pilih Jenis Bahan Kertas / Media
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.materials.map(mat => (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => setSelectedMaterial(mat.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMaterial === mat.id
                        ? 'border-orange-500 bg-orange-50/40 text-slate-900 shadow-sm ring-1 ring-orange-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{mat.label}</span>
                      {selectedMaterial === mat.id && <Check className="w-3.5 h-3.5 text-orange-600" />}
                    </div>
                    {mat.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{mat.description}</p>
                    )}
                    {mat.priceAdd !== 0 && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-orange-700 bg-orange-100/60 px-1.5 py-0.5 rounded">
                        {mat.priceAdd > 0 ? `+Rp ${mat.priceAdd.toLocaleString('id-ID')}` : `-Rp ${Math.abs(mat.priceAdd).toLocaleString('id-ID')}`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Finishing Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                3. Pilihan Finishing / Hasil Akhir
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.finishings.map(fn => (
                  <button
                    key={fn.id}
                    type="button"
                    onClick={() => setSelectedFinishing(fn.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedFinishing === fn.id
                        ? 'border-orange-500 bg-orange-50/40 text-slate-900 shadow-sm ring-1 ring-orange-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{fn.label}</span>
                      {selectedFinishing === fn.id && <Check className="w-3.5 h-3.5 text-orange-600" />}
                    </div>
                    {fn.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{fn.description}</p>
                    )}
                    {fn.priceAdd > 0 && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-orange-700 bg-orange-100/60 px-1.5 py-0.5 rounded">
                        +Rp {fn.priceAdd.toLocaleString('id-ID')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Upload File Desain */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  4. Upload File Desain Siap Cetak
                </label>
                <button
                  type="button"
                  onClick={handleUseSampleDesign}
                  className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 underline"
                >
                  Gunakan File Contoh Demo
                </button>
              </div>

              {fileUrl ? (
                <div className="border-2 border-emerald-500/50 bg-emerald-50/20 rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 truncate">{fileName}</p>
                      <p className="text-[11px] text-slate-500">{fileSize || 'Ukuran normal'}</p>
                    </div>
                  </div>
                  <label className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer shrink-0">
                    Ganti File
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.ai,.psd,.cdr"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-xl p-5 bg-slate-50/50 hover:bg-orange-50/20 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                  <Upload className="w-7 h-7 text-slate-400 group-hover:text-orange-600 mb-1.5 transition-colors" />
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-orange-600">
                    Pilih file desain dari komputer / HP Anda
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    Format: PDF, JPG, PNG, AI, PSD, atau CDR (Maksimal 50MB)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.ai,.psd,.cdr"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* 5. Catatan Pesanan */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                5. Catatan Khusus Pesanan (Opsional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Contoh: Tolong posisi mata ayam ditambah di sisi tengah, warna background mohon disesuaikan kode hex..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* 6. Quantity and Pricing Summary Bar */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-700 uppercase">Jumlah:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(product.minQty || 1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={product.minQty || 1}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(product.minQty || 1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center font-bold text-xs bg-transparent tabular-nums focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  (Min. {product.minQty} {product.unit})
                </span>
              </div>

              <div className="text-right w-full sm:w-auto">
                <span className="text-[11px] text-slate-500 block">Total Estimasi Harga</span>
                <span className="text-2xl font-black text-slate-900 tabular-nums">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-4 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Tambah ke Keranjang Belanja</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Search, 
  Filter, 
  Check, 
  ExternalLink, 
  X, 
  CreditCard, 
  MessageSquare, 
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';

const PRICED_CATEGORIES = ['Desktop Robots', 'Clothing'];
const COMING_SOON_CATEGORIES = ['Desktop Robots'];

const formatPrice = (p) =>
  `${p.currency === 'LKR' ? 'LKR ' : '$'}${Number(p.price).toLocaleString()}`;
const hasPrice = (p) => PRICED_CATEGORIES.includes(p.category) && Number(p.price) > 0;

export default function StorePage() {
  const { setCurrentPage, content } = useSite();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pricingMode, setPricingMode] = useState('budget'); // 'budget' | 'discuss'
  const [budget, setBudget] = useState('');

  const [activeImage, setActiveImage] = useState('');

  const closeModal = () => setSelectedProduct(null);

  useEffect(() => {
    if (!selectedProduct) return;
      const onKey = (e) => { if (e.key === 'Escape') setSelectedProduct(null); };
      window.addEventListener('keydown', onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', onKey);
        document.body.style.overflow = prev;
      };
  }, [selectedProduct]);

  // Inquiry modal state
  const [inquiryData, setInquiryData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: ''
  });
  const [inquiryStatus, setInquiryStatus] = useState({ type: null, message: '', orderRef: null, waUrl: null });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  const categories = [
    'All',
    'Website Templates',
    'UI Kits',
    'Source Code',
    'Desktop Robots',
    'Clothing',
    'Development Services'
  ];

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await api.getStoreProducts(selectedCategory, searchQuery);
        if (res.success && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to load store products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, searchQuery]);

  // Sorting
  const sortedProducts = [...products].sort((a, b) => b.id - a.id);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryData.customerName || !inquiryData.customerEmail) return;

    if (pricingMode === 'budget' && !budget.trim()) {
      setInquiryStatus({ type: 'error', message: 'Please enter your total budget, or choose "Discuss while building".', orderRef: null, waUrl: null });
      return;
    }

    setSubmittingInquiry(true);
    setInquiryStatus({ type: null, message: '', orderRef: null, waUrl: null });

    const pricingNote = pricingMode === 'budget'
      ? `Pricing: Customer total budget = ${budget.trim()}`
      : 'Pricing: Customer wants to discuss the price while building';

    try {
      const res = await api.submitStoreInquiry({
        productId: selectedProduct?.id,
        productName: selectedProduct?.title,
        customerName: inquiryData.customerName,
        customerEmail: inquiryData.customerEmail,
        customerPhone: inquiryData.customerPhone,
        notes: `${pricingNote}\n${inquiryData.notes || ''}`
      });

      if (res.success) {
        setInquiryStatus({ type: 'success', message: res.message, orderRef: res.orderReference, waUrl: res.whatsAppUrl });
        try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch {}
      }
    } catch (err) {
      setInquiryStatus({ type: 'error', message: err.message || 'Failed to submit inquiry. Please try again or message on WhatsApp.', orderRef: null, waUrl: null });
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const waNumber = content.whatsapp_number || '94704483130';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black">
      {/* Store Header */}
      <nav aria-label="Store navigation" className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage('portfolio')}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-black transition-colors p-1 -ml-1 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </button>
          <span className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="font-futuristic text-xl sm:text-2xl font-black tracking-wider text-black">
              SONEZ
            </span>
            <span className="px-2 py-0.5 bg-sonez-blue text-white text-[10px] font-mono uppercase font-bold rounded-md">
              STORE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden sm:inline-block">
            Digital Assets & Creative Services
          </span>
          <button
            onClick={() => setCurrentPage('portfolio')}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-full transition-all"
          >
            Explore Portfolio
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative bg-black text-white px-6 sm:px-12 py-16 sm:py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sonez-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <span className="font-mono text-xs text-sonez-blue tracking-[0.2em] uppercase font-bold block mb-2">
            DIGITAL CREATIONS BY SONEZ
          </span>
          <h1 className="font-futuristic text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none">
            PREMIUM DIGITAL STORE
          </h1>
          <p className="text-gray-400 text-xs sm:text-base max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
            Production-ready Website templates, source code, UI kits, desktop robots, clothing, and custom development & creative services.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search templates, UI kits, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sonez-blue focus:bg-white/15 transition-all"
                />
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Section */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-gray-200 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-mono">Loading digital catalog...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-200 p-8">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold-display text-lg font-bold text-gray-800">No products found</h3>
            <p className="text-xs text-gray-500 mt-1">Try another category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedProducts.map((p) => (
              <div
                key={p.id}
                className="group bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:border-black transform hover:-translate-y-1"
              >
                <div>
                  {/* Image Preview with Category badge and Price tag */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider rounded-full font-bold">
                      {p.category}
                    </span>
                    {hasPrice(p) && (
                      <span className="absolute bottom-3 right-3 px-3 py-1 bg-sonez-blue text-white text-xs font-bold rounded-full shadow-md">
                        {formatPrice(p)}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <h3 className="font-bold-display text-lg font-bold text-black group-hover:text-sonez-blue transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Features preview */}
                    <div className="mt-4 space-y-1.5 pt-4 border-t border-gray-100">
                      {p.features?.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-gray-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setActiveImage('');
                      setInquiryStatus({ type: null, message: '', orderRef: null, waUrl: null });
                      setPricingMode('budget');
                      setBudget('');
                    }}
                    className="w-full py-3 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md"
                  >
                    <span>View Details & Order</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details & Purchase Inquiry Modal */}
      {selectedProduct && (() => {
        const gallery = [selectedProduct.image_url, ...(selectedProduct.images || [])].filter(Boolean);
        const comingSoon = COMING_SOON_CATEGORIES.includes(selectedProduct.category);
        const features = (selectedProduct.features || []).filter(Boolean);

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md" onClick={closeModal}>
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>

              {/* Sticky close button (always visible while scrolling) */}
              <div className="sticky top-0 z-20 h-0 flex justify-end">
                <button
                  onClick={closeModal}
                  aria-label="Close"
                  className="mt-4 mr-4 w-10 h-10 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Gallery */}
              <div className="bg-black">
                <div className="aspect-video w-full flex items-center justify-center overflow-hidden">
                  <img src={activeImage || gallery[0]} alt={selectedProduct.title} className="w-full h-full object-contain" />
                </div>
                {gallery.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar bg-gray-900">
                    {gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(img)}
                        className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                          (activeImage || gallery[0]) === img ? 'border-sonez-blue' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-sonez-blue/10 text-sonez-blue text-xs font-mono font-bold uppercase rounded-full">
                      {selectedProduct.category}
                    </span>
                    {hasPrice(selectedProduct) && (
                    <span className="text-xl font-black text-black">{formatPrice(selectedProduct)}</span>
                    )}
                  </div>
                  <h3 className="font-bold-display text-2xl font-bold text-black mt-2">{selectedProduct.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-line">
                      {selectedProduct.description}
                    </p>
                </div>

                {features.length > 0 && (
                  <div>
                    <h4 className="font-bold-display text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                      Included Features & Specifications:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl text-xs text-gray-800">
                        <Check className="w-3.5 h-3.5 text-sonez-blue shrink-0" />
                        <span>{f}</span>
                      </div>
                      ))}
                    </div>
                 </div>
                )}

                {comingSoon ? (
                <div className="p-6 bg-gray-50 border border-dashed border-gray-300 rounded-2xl text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-sonez-blue mx-auto" />
                  <h4 className="font-bold-display text-lg font-bold text-black">Coming Soon</h4>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                    This product is not available for purchase yet. Follow SONEZ for the launch update!
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-2 px-6 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider rounded-full"
                  >
                    Close
                  </button>
                </div>
                ) : inquiryStatus.type === 'success' ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold-display text-lg font-bold text-emerald-950">
                    Order Inquiry Received!
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                    {inquiryStatus.message}
                  </p>
                  <div className="font-mono text-xs bg-white px-3 py-1.5 rounded-lg border border-emerald-200 inline-block">
                    Reference: <span className="font-bold text-black">{inquiryStatus.orderRef}</span>
                  </div>

                  {inquiryStatus.waUrl && (
                    <div className="pt-2">
                      <a
                        href={inquiryStatus.waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-full hover:bg-emerald-600 transition-colors shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Continue to WhatsApp Confirmation</span>
                      </a>
                    </div>
                  )}
                </div>
                
                ) : (
                  /* Order / Inquiry Form */
                <form onSubmit={handleInquirySubmit} className="space-y-3 pt-2 border-t border-gray-100">
                  <h4 className="font-bold-display text-sm font-bold text-black">
                    Purchase Request & Instant Reservation:
                  </h4>

                  {inquiryStatus.type === 'error' && (
                    <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
                      {inquiryStatus.message}
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-gray-900 block">How would you like to handle pricing?</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPricingMode('budget')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          pricingMode === 'budget' ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50 hover:border-black'
                        }`}
                      >
                        <span className="font-bold block">💰 I have a budget</span>
                        <span className="opacity-70">Tell me your total budget</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPricingMode('discuss')}
                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                          pricingMode === 'discuss' ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50 hover:border-black'
                        }`}
                      >
                        <span className="font-bold block">🤝 Discuss while building</span>
                        <span className="opacity-70">Agree on the price together as we go</span>
                      </button>
                    </div>

                    {pricingMode === 'budget' && (
                      <input
                        type="text"
                        placeholder="Your total budget (e.g. $150 or LKR 30,000) *"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black outline-none"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      required
                      value={inquiryData.customerName}
                      onChange={(e) => setInquiryData({ ...inquiryData, customerName: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Your Email *"
                      required
                      value={inquiryData.customerEmail}
                      onChange={(e) => setInquiryData({ ...inquiryData, customerEmail: e.target.value })}
                      className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="WhatsApp / Phone Number (Optional)"
                    value={inquiryData.customerPhone}
                    onChange={(e) => setInquiryData({ ...inquiryData, customerPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black outline-none"
                  />

                  <textarea
                    placeholder="Specific requests, customization needs, or project timeline..."
                    rows={2}
                    value={inquiryData.notes}
                    onChange={(e) => setInquiryData({ ...inquiryData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-black outline-none resize-none"
                  />

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submittingInquiry}
                      className="w-full sm:flex-1 py-3 bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{submittingInquiry ? 'Processing...' : 'Send Order Request'}</span>
                    </button>
                    <a
                      href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hi Sadeepa! I'd like to order "${selectedProduct.title}" from your SONEZ store. ` +
                        (pricingMode === 'budget' && budget.trim() ? `My budget is ${budget.trim()}.` : "I'd like to discuss the price.")
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3 bg-green-500 hover:bg-green-600 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Order on WhatsApp</span>
                    </a>
                  </div>
                </form>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    })()}
    </div>
  );
}

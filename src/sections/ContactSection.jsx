import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

export default function ContactSection() {
  const { content } = useSite();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({ type: null, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);   // ← copy feedback state

  const contactEmail = content.contact_email || 'sonezbusiness@gmail.com';
  const contactPhone = content.contact_phone || '+94 704 483 130';
  const contactLocation = content.contact_location || 'Kurunegala, Sri Lanka';
  const waNumber = content.whatsapp_number || '94704483130';

  // Copy phone number to clipboard
  const handleCopyPhone = async (e) => {
    e.preventDefault(); // don't follow the tel: link on desktop
    try {
      await navigator.clipboard.writeText(contactPhone);
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = contactPhone;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setPhoneCopied(true);
      setTimeout(() => setPhoneCopied(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: null, message: '' });

    // 1) Save to database (admin dashboard inbox)
    let dbOk = false;
    try {
      const res = await api.submitContact(formData);
      dbOk = !!res.success;
    } catch (err) {
      console.error('DB save failed:', err.message);
    }

    // 2) Send email via EmailJS
    let mailOk = false;
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject || 'Website Inquiry',
          message: formData.message,
        },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );
      mailOk = true;
    } catch (err) {
      console.error('EmailJS failed:', err);
    }

    if (dbOk || mailOk) {
      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. Sadeepa will get back to you shortly.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } }); } catch {}
    } else {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or reach out on WhatsApp.'
      });
    }
    setSubmitting(false);
  };

  return (
    <section className="snap-section relative w-full h-screen min-h-[680px] bg-white flex flex-col justify-between items-center pt-20 pb-10 px-6 sm:px-12 overflow-hidden">
      {/* Title & Subtitle */}
      <div className="relative z-10 text-center max-w-3xl pt-2">
        <h2 className="font-futuristic text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-black uppercase">
          GET IN TOUCH
        </h2>
        <div className="w-12 h-1 bg-sonez-blue mx-auto mt-2 rounded-full" />
        <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">
          Send me a message in the contact form or send me a Direct message on WhatsApp !
        </p>
      </div>

      {/* Main Form & Info Grid matching Canva mockup */}
      <div className="relative z-10 w-full max-w-5xl my-auto py-2 overflow-y-auto max-h-[65vh] pr-2">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Info */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <h3 className="font-bold-display text-lg font-bold text-black mb-4">
                Contact Info
              </h3>
              <div className="space-y-4">
                {/* Email — clicking opens mail client with TO: pre-filled */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sonez-blue shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Email
                    </span>
                    <a
                      href={`mailto:${contactEmail}`}
                      title={`Send email to ${contactEmail}`}
                      className="text-sm font-semibold text-black hover:text-sonez-blue transition-colors underline-offset-2 hover:underline flex items-center gap-1 group"
                    >
                      {contactEmail}
                      <Mail className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                    </a>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">Click to open email app</span>
                  </div>
                </div>

                {/* Phone — clicking copies number to clipboard */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Phone
                    </span>
                    <button
                      onClick={handleCopyPhone}
                      title="Click to copy phone number"
                      className="text-sm font-semibold text-black hover:text-sonez-blue transition-colors flex items-center gap-1.5 group cursor-pointer"
                    >
                      {contactPhone}
                      {phoneCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
                      )}
                    </button>
                    <span className={`text-[10px] mt-0.5 block transition-colors ${phoneCopied ? 'text-emerald-600 font-semibold' : 'text-gray-400'}`}>
                      {phoneCopied ? '✓ Copied to clipboard!' : 'Click to copy'}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Location
                    </span>
                    <span className="text-sm font-semibold text-black block">
                      {contactLocation}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout Pill */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">Instant WhatsApp Chat</span>
                <span className="text-[11px] text-emerald-700">Average reply time: under 30 mins</span>
              </div>
              <a
                href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hi Sadeepa! I'd like to discuss a project with you.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-full hover:bg-emerald-600 transition-colors shadow-sm"
              >
                Chat Now
              </a>
            </div>
          </div>

          {/* Right Column: Send Message Form */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm hover:border-black transition-colors">
            <h3 className="font-bold-display text-lg font-bold text-black mb-4">
              Send Message
            </h3>

            {/* Status Alert */}
            {status.type && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-medium flex items-center gap-2 ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <input
                  type="text"
                  placeholder="First Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100/80 border border-transparent rounded-xl text-xs sm:text-sm text-black placeholder-gray-500 focus:bg-white focus:border-black focus:outline-none transition-all"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Your Email *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100/80 border border-transparent rounded-xl text-xs sm:text-sm text-black placeholder-gray-500 focus:bg-white focus:border-black focus:outline-none transition-all"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100/80 border border-transparent rounded-xl text-xs sm:text-sm text-black placeholder-gray-500 focus:bg-white focus:border-black focus:outline-none transition-all"
                />
              </div>

              <div>
                <textarea
                  placeholder="Your Message *"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100/80 border border-transparent rounded-xl text-xs sm:text-sm text-black placeholder-gray-500 focus:bg-white focus:border-black focus:outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom info label */}
      <div className="relative z-10 w-full max-w-6xl flex items-center justify-end pt-2 pr-2 sm:pr-8">
        <span className="text-xs text-gray-400 font-mono hidden sm:inline-block">
          LET'S CREATE SOMETHING EXTRAORDINARY • SONEZ
        </span>
      </div>
    </section>
  );
}

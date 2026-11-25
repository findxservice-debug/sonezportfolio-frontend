import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { api } from '../services/api';
import { Bot, X, Send, User, Sparkles, CheckCheck, MessageSquare, Zap, ShieldCheck } from 'lucide-react';

export default function Chatbot() {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    chatMode, 
    setChatMode, 
    cookieConsent,
    visitorId,
    currentPage 
  } = useSite();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [showIdentityForm, setShowIdentityForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('sonez_chat_session') || `sess_${Math.random().toString(36).substring(2, 10)}`;
  });

  const messagesEndRef = useRef(null);

  // Show only on portfolio and store pages
  if (currentPage !== 'portfolio' && currentPage !== 'store') return null;

  // Initialize Chat Session
  useEffect(() => {
    async function initSession() {
      try {
        const res = await api.initChatSession({
          sessionId,
          visitorName: visitorName || 'Visitor',
          visitorEmail: visitorEmail || null,
          consentSaved: cookieConsent === 'accepted'
        });

        if (res.success && res.sessionId) {
          setSessionId(res.sessionId);
          if (cookieConsent === 'accepted') {
            localStorage.setItem('sonez_chat_session', res.sessionId);
          }
        }
      } catch (err) {
        console.warn('Chat session init notice:', err.message);
      }
    }
    initSession();
  }, [cookieConsent]);

  // Poll for messages when chat is open
  useEffect(() => {
    let interval = null;

    async function loadMessages() {
      if (!sessionId) return;
      try {
        const res = await api.getChatMessages(sessionId);
        if (res.success && res.messages) {
          setMessages(res.messages);
        }
      } catch (err) {
        // silent polling catch
      }
    }

    loadMessages();

    if (isChatOpen) {
      interval = setInterval(loadMessages, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionId, isChatOpen]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    // If in SONEZ Reply mode and name is not entered yet, prompt identity
    if (chatMode === 'sonez' && !visitorName && !showIdentityForm && messages.length <= 2) {
      setShowIdentityForm(true);
    }

    // Optimistically add visitor message
    const tempMsg = {
      id: Date.now(),
      session_id: sessionId,
      sender: 'visitor',
      message: text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setIsLoading(true);

    try {
      const res = await api.sendChatMessage({
        sessionId,
        message: text,
        mode: chatMode,
        visitorName: visitorName || 'Visitor',
        visitorEmail: visitorEmail || null
      });

      if (res.success && res.botResponse) {
        setMessages(prev => [...prev, res.botResponse]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          session_id: sessionId,
          sender: 'bot',
          message: 'Network issue. Sadeepa can also be reached directly on WhatsApp!',
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Floating Chatbot Circular Icon Trigger Button (Positioned at bottom-right, to the left of WhatsApp) */}
      {/* right-[88px] = WhatsApp(24px) + WA-width(56px) + gap(8px) = 88px */}
      <div className="fixed bottom-6 z-40 pointer-events-auto" style={{ right: '88px' }}>
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label="Open SONEZ Chat Assistant"
          className="group relative flex items-center justify-center w-14 h-14 bg-black hover:bg-gray-900 text-white rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-gray-700/80 focus:outline-none"
        >
          {/* Subtle blue glow on hover */}
          <span className="absolute -inset-1 rounded-full bg-sonez-blue/20 group-hover:bg-sonez-blue/40 blur-sm transition-all pointer-events-none" />

          {/* Chatbot Icon */}
          <div className="relative z-10 flex items-center justify-center">
            {isChatOpen ? (
              <X className="w-6 h-6 text-white transition-transform group-hover:rotate-90 duration-200" />
            ) : (
              <Bot className="w-6 h-6 text-sonez-blue group-hover:text-blue-300 transition-colors" />
            )}
          </div>

          {/* Green Online Pulsing Indicator (top-right of button) — pointer-events-none on ALL spans to prevent click blocking */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 pointer-events-none"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white pointer-events-none"></span>
          </span>

          {/* Hover Tooltip */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/95 backdrop-blur-md text-white text-[11px] font-semibold rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {isChatOpen ? 'Close Chat' : 'Chat Assistant'}
          </span>
        </button>
      </div>

      {/* Floating Chat Popup Window — visible on ALL screen sizes (mobile + desktop + laptop) */}
      {isChatOpen && (
        <div
          className="fixed z-50 bg-white rounded-3xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden"
          style={{
            bottom: '96px',       /* above the floating buttons row */
            right: '16px',        /* 16px from right on mobile */
            width: 'min(94vw, 420px)',
            height: 'min(82vh, 560px)',
            animation: 'chatSlideIn 0.25s ease-out'
          }}
        >
          {/* Window Header */}
          <div className="bg-black text-white px-5 py-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-sonez-blue flex items-center justify-center font-black text-sm text-white shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-black rounded-full"></span>
              </div>
              <div>
                <h2 className="font-bold-display text-sm font-bold tracking-wide flex items-center gap-2">
                  <span>SONEZ Assistant</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 font-mono text-emerald-300 font-bold">
                    ONLINE
                  </span>
                </h2>
                <p className="text-[11px] text-gray-400">
                  {chatMode === 'auto' ? 'Instant AI Knowledge Base' : 'Direct Message to Sadeepa'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              aria-label="Close chat window"
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TWO OPTIONS SELECTOR: Auto Reply vs SONEZ Reply */}
          <div className="bg-gray-100 p-2 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-1.5">
              {/* Option 1: Auto Reply */}
              <button
                onClick={() => setChatMode('auto')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  chatMode === 'auto'
                    ? 'bg-white text-black shadow-md border border-gray-200'
                    : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${chatMode === 'auto' ? 'text-sonez-blue' : 'text-gray-400'}`} />
                <span>Auto Reply</span>
              </button>

              {/* Option 2: SONEZ Reply */}
              <button
                onClick={() => setChatMode('sonez')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  chatMode === 'sonez'
                    ? 'bg-white text-black shadow-md border border-gray-200'
                    : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
                }`}
              >
                <User className={`w-3.5 h-3.5 ${chatMode === 'sonez' ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>SONEZ Reply</span>
              </button>
            </div>
          </div>

          {/* Mode Description Bar */}
          <div className={`px-4 py-2 text-[11px] flex items-center justify-between border-b ${
            chatMode === 'auto' 
              ? 'bg-blue-50/70 border-blue-100 text-blue-900' 
              : 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
          }`}>
            <span className="font-medium">
              {chatMode === 'auto'
                ? '⚡ Instant automated replies about portfolio, skills & store'
                : '💬 Live direct messages delivered straight to Sadeepa\'s dashboard'}
            </span>
            {chatMode === 'sonez' && (
              <button
                onClick={() => setShowIdentityForm(!showIdentityForm)}
                className="underline font-bold text-emerald-950 ml-2 shrink-0"
              >
                {visitorName || 'Set Name'}
              </button>
            )}
          </div>

          {/* SONEZ Reply Visitor Info Dropdown */}
          {showIdentityForm && (
            <div className="bg-gray-50 p-3.5 border-b border-gray-200 text-xs space-y-2 animate-in fade-in">
              <span className="font-bold text-gray-700 block">Your Details for Sadeepa's Reply:</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:border-black"
                />
                <input
                  type="email"
                  placeholder="Email (Optional)"
                  value={visitorEmail}
                  onChange={(e) => setVisitorEmail(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:border-black"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowIdentityForm(false)}
                  className="px-3 py-1 bg-black text-white rounded-lg text-[11px] font-bold"
                >
                  Confirm Details
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/40">
            {messages.map((m) => {
              const isVisitor = m.sender === 'visitor';
              const isSonez = m.sender === 'sonez';
              const isBot = m.sender === 'bot';

              return (
                <div
                  key={m.id || Math.random()}
                  className={`flex flex-col ${isVisitor ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-end gap-1.5 max-w-[85%]">
                    {!isVisitor && (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white mb-1 shrink-0 ${
                        isSonez ? 'bg-black' : 'bg-sonez-blue'
                      }`}>
                        {isSonez ? 'SZ' : 'AI'}
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isVisitor
                          ? 'bg-black text-white rounded-br-none shadow-sm'
                          : isSonez
                          ? 'bg-emerald-600 text-white rounded-bl-none shadow-sm'
                          : 'bg-white text-gray-800 border border-gray-200/90 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {!isVisitor && (
                        <div className="text-[10px] font-semibold opacity-75 mb-1">
                          {isSonez ? 'Sadeepa (SONEZ)' : 'SONEZ Auto Assistant'}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{m.message}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1 font-mono">
                    {formatTime(m.created_at)}
                    {isVisitor && <CheckCheck className="w-3 h-3 text-sonez-blue" />}
                  </span>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                <span className="w-2 h-2 rounded-full bg-sonez-blue animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-sonez-blue animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-sonez-blue animate-bounce [animation-delay:0.4s]"></span>
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Question Pills (Auto Mode) */}
          {chatMode === 'auto' && (
            <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {['What are your skills?', 'Tell me about projects', 'Visit SONEZ Store', 'How to hire Sadeepa?'].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInputText(q);
                  }}
                  className="text-[11px] px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full whitespace-nowrap transition-colors font-medium shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              placeholder={chatMode === 'auto' ? "Ask about skills, projects, store..." : "Message directly to Sadeepa..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-black transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              aria-label="Send message"
              className="p-2.5 bg-black hover:bg-gray-800 disabled:opacity-40 text-white rounded-xl transition-all active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

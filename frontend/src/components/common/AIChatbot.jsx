/**
 * AIChatbot — Floating AI Chatbot Widget
 * Safe: fails gracefully, no crashes, no undefined errors
 * Drop this anywhere in your App.jsx or layout
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api'; // adjust path to your existing api service

const QUICK_REPLIES = [
  'How do I file a complaint?',
  'How to track my complaint?',
  'What are complaint categories?',
  'How long does resolution take?',
];

const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="11" r="3" />
    <path d="M12 8V5" />
    <circle cx="12" cy="4" r="1" fill="currentColor" />
    <circle cx="8.5" cy="16" r="1" fill="currentColor" />
    <circle cx="15.5" cy="16" r="1" fill="currentColor" />
  </svg>
);

const Message = ({ msg }) => {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center mr-2 shrink-0 mt-1">
          <BotIcon />
        </div>
      )}
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
          isBot
            ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-600'
            : 'bg-blue-900 text-white rounded-tr-none'
        }`}
      >
        {msg.content}
        {msg.aiProcessed === false && isBot && (
          <span className="block text-xs text-slate-400 mt-1">⚡ Quick reply</span>
        )}
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start mb-3">
    <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center mr-2 shrink-0">
      <BotIcon />
    </div>
    <div className="bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: '👋 Hello! I\'m your Police Portal Assistant. How can I help you today?',
      aiProcessed: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const messageText = (text || input).trim();
    if (!messageText || loading) return;

    setInput('');
    const userMsg = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build history (last 6 messages, excluding system messages)
      const history = messages.slice(-6).map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content,
      }));

      const res = await api.post('/ai/chat', {
        message: messageText,
        history,
      });

      const botMsg = {
        role: 'bot',
        content: res.data?.reply || "I'm here to help! Please try again.",
        aiProcessed: res.data?.aiProcessed ?? false,
      };

      setMessages(prev => [...prev, botMsg]);
      if (!open) setUnread(prev => prev + 1);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          content: "I'm having trouble connecting. Please try again or contact support directly.",
          aiProcessed: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, open]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'bot',
        content: "Chat cleared! How can I help you?",
        aiProcessed: true,
      },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!open && unread > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold z-10"
            >
              {unread}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(prev => !prev)}
          className="w-14 h-14 bg-blue-900 hover:bg-blue-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-colors"
          title="AI Assistant"
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={2.5}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <BotIcon />
          )}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
            style={{ maxHeight: '520px' }}
          >
            {/* Header */}
            <div className="bg-blue-900 text-white px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <BotIcon />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Portal AI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-xs text-blue-200">Online — Powered by Gemini</p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="text-blue-200 hover:text-white transition-colors text-xs"
                title="Clear chat"
              >
                Clear
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800"
              style={{ minHeight: '280px', maxHeight: '320px' }}>
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && !loading && (
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_REPLIES.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-300 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                maxLength={500}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="w-9 h-9 bg-blue-900 text-white rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-blue-800 transition-colors shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;

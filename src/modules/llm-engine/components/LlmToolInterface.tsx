'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Loader2, Bot, User, Settings2, Trash2, Copy,
  Check, AlertCircle, ChevronDown, Sparkles
} from 'lucide-react';
import { useLlmStore } from '../store/useLlmStore';
import type { LLMMessage } from '../store/useLlmStore';

interface LlmToolInterfaceProps {
  toolId: string;
  title: string;
  description: string;
  systemPrompt?: string;
}

const MODEL_OPTIONS = [
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', badge: 'Google' },
  { value: 'gpt-4o', label: 'GPT-4o', badge: 'OpenAI' },
  { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', badge: 'Anthropic' },
  { value: 'llama-3.1', label: 'Llama 3.1', badge: 'Meta' },
] as const;

function MessageBubble({ msg, index }: { msg: LLMMessage; index: number }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const copyText = useCallback(() => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [msg.content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`group relative max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
          : 'bg-slate-800/60 border border-slate-700/50 text-slate-200'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
        {!isUser && (
          <button
            onClick={copyText}
            className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 hover:bg-slate-600 rounded-lg p-1.5"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
          </button>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      )}
    </motion.div>
  );
}

export default function LlmToolInterface({ toolId, title, description, systemPrompt }: LlmToolInterfaceProps) {
  const { task, setField, processPrompt, clearContext, reset } = useLlmStore();
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Set system prompt based on tool
  useEffect(() => {
    if (systemPrompt) {
      setField('systemPrompt', systemPrompt);
    }
  }, [systemPrompt, setField]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [task.context, task.response]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.userMessage.trim() || task.status === 'streaming') return;
    await processPrompt();
    inputRef.current?.focus();
  }, [task.userMessage, task.status, processPrompt]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            onClick={clearContext}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-red-900/30 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-slate-800 overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-slate-900/50">
              {/* Model Selector */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Model</label>
                <div className="grid grid-cols-2 gap-2">
                  {MODEL_OPTIONS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setField('model', m.value)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${
                        task.model === m.value
                          ? 'border-violet-500/50 bg-violet-500/10 text-violet-300'
                          : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span>{m.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-500">{m.badge}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Temperature & Tokens */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Temperature: {task.temperature.toFixed(1)}
                  </label>
                  <input
                    type="range" min="0" max="2" step="0.1"
                    value={task.temperature}
                    onChange={(e) => setField('temperature', parseFloat(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Max Tokens: {task.maxTokens}
                  </label>
                  <input
                    type="range" min="256" max="128000" step="256"
                    value={task.maxTokens}
                    onChange={(e) => setField('maxTokens', parseInt(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {task.context.length === 0 && task.status === 'idle' && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-300">Ready to assist</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md">
              Type your message below. Shift+Enter for multiline. Model: <span className="text-violet-400">{task.model}</span>
            </p>
          </div>
        )}

        {task.context.map((msg, i) => (
          <MessageBubble key={i} msg={msg} index={i} />
        ))}

        {/* Streaming response */}
        {task.status === 'streaming' && task.response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 mt-1 animate-pulse">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-slate-800/60 border border-violet-500/30 text-slate-200">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{task.response}<span className="inline-block w-2 h-4 bg-violet-400 animate-pulse ml-1" /></p>
            </div>
          </motion.div>
        )}

        {/* Loading indicator */}
        {task.status === 'streaming' && !task.response && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {task.status === 'error' && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{task.error}</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={task.userMessage}
              onChange={(e) => setField('userMessage', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="w-full resize-none bg-slate-800/60 border border-slate-700/50 rounded-2xl px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all max-h-32 overflow-y-auto"
              style={{ minHeight: '48px' }}
            />
            <div className="absolute right-2 bottom-2 text-[10px] text-slate-600">
              {task.userMessage.length > 0 && `${task.userMessage.length} chars`}
            </div>
          </div>
          <button
            type="submit"
            disabled={!task.userMessage.trim() || task.status === 'streaming'}
            className="w-12 h-12 flex-shrink-0 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-violet-500/20"
          >
            {task.status === 'streaming' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

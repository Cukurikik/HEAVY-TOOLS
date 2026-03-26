"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { 
  Send, Bot, Server, Settings, Type, Image as ImageIcon, Video, Mic, 
  FileText, Sparkles, Command, Cpu, Terminal, Shield, Paperclip, 
  RefreshCcw, StopCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DASHSCOPE_MODELS, getModelsByCategory, AIModel } from "@/lib/ai-models";
import { cn } from "@/lib/utils";

// --- Types ---
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  status?: "streaming" | "complete" | "error";
  modelId?: string;
}

const CATEGORY_MAP = [
  { id: "text", label: "Text & Reasoning", icon: Type, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "multimodal", label: "Vision & Multimodal", icon: FileText, color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "image", label: "Image Generation", icon: ImageIcon, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "video", label: "Video Generation", icon: Video, color: "text-rose-400", bg: "bg-rose-400/10" },
  { id: "audio", label: "Voice & Audio", icon: Mic, color: "text-amber-400", bg: "bg-amber-400/10" }
] as const;

// --- Code Formatting Helper ---
function formatMarkdownContent(text: string) {
  // Ultra-simple markdown code block parser
  if (!text.includes('```')) return <span className="whitespace-pre-wrap leading-relaxed">{text}</span>;
  
  const parts = text.split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          if (match) {
            const [_, lang, code] = match;
            return (
              <div key={index} className="rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-xl my-4">
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{lang || "code"}</span>
                  </div>
                </div>
                <div className="p-4 overflow-x-auto">
                  <code className="text-[13px] font-mono leading-loose text-slate-300 whitespace-pre">{code}</code>
                </div>
              </div>
            );
          }
        }
        return <span key={index} className="whitespace-pre-wrap leading-relaxed">{part}</span>;
      })}
    </div>
  );
}

export default function DedicatedAssistantPage() {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("text");
  const [activeModel, setActiveModel] = useState<string>("qwen3-max");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(4096);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages]);

  // Submit Handler
  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    // Initial Processing message
    const assistantMsgId = crypto.randomUUID();
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      content: "...",
      role: "assistant",
      timestamp: new Date(),
      status: "streaming",
      modelId: activeModel
    }]);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          history: messages.map(msg => ({ role: msg.role, content: msg.content })),
          model: activeModel,
          temperature,
          max_tokens: maxTokens
        }),
      });

      if (!response.ok) throw new Error("API Connection Failed");

      const data = await response.json();
      
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId 
          ? { ...msg, content: data.response || "No response generated.", status: "complete" } 
          : msg
      ));
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId 
          ? { ...msg, content: "SYSTEM FAILURE: Unable to reach secure AI endpoint. Please check your Alibaba Cloud API Key.", status: "error" } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => adjustTextareaHeight(), [inputValue]);

  // Derived state
  const availableModels = getModelsByCategory(activeCategory as any);
  const currentModelData = DASHSCOPE_MODELS.find(m => m.id === activeModel);

  return (
    <div className="h-full flex overflow-hidden bg-[#030712] relative z-0">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-emerald-600/5 blur-[100px] rounded-full" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      </div>

      {/* LEFT SIDEBAR: Model Select & Settings */}
      <div className="w-80 border-r border-white/5 bg-slate-950/50 backdrop-blur-2xl flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h1 className="text-sm font-black text-white tracking-widest uppercase">Anita AI</h1>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Code & Logic Assistant</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          
          {/* Engine Selection */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-black tracking-widest uppercase text-slate-500 flex items-center gap-2">
              <Server className="w-3 h-3" /> Base Intelligence
            </h2>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {CATEGORY_MAP.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    const freshModels = getModelsByCategory(cat.id as any);
                    if (freshModels.length > 0) setActiveModel(freshModels[0].id);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 w-[calc(50%-4px)]",
                    activeCategory === cat.id 
                      ? `border-${cat.color.split('-')[1]}-500/50 ${cat.bg} shadow-lg shadow-${cat.color.split('-')[1]}-500/10` 
                      : "border-white/5 bg-white/5 hover:bg-white/10"
                  )}
                >
                  <cat.icon className={cn("w-5 h-5 mb-2", activeCategory === cat.id ? cat.color : "text-slate-500")} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-center">{cat.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Model List */}
            <div className="space-y-2 mt-4">
              <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Available Models</h3>
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setActiveModel(model.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all duration-300 relative overflow-hidden group",
                    activeModel === model.id 
                      ? "border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/5" 
                      : "border-white/5 bg-white/5 hover:bg-white/10"
                  )}
                >
                  {activeModel === model.id && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500 rounded-r-full" />
                  )}
                  <div className="font-bold text-xs text-slate-200 mb-1 flex items-center justify-between">
                    {model.name}
                    {activeModel === model.id && <Shield className="w-3 h-3 text-indigo-400" />}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-relaxed truncate">{model.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Hyperparameters */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h2 className="text-[10px] font-black tracking-widest uppercase text-slate-500 flex items-center gap-2">
              <Settings className="w-3 h-3" /> Hyperparameters
            </h2>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-slate-400">Temperature</span>
                  <span className="text-indigo-400">{temperature.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="2" step="0.01" 
                  value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-slate-400">Max Tokens</span>
                  <span className="text-purple-400">{maxTokens}</span>
                </div>
                <input 
                  type="range" min="256" max="8192" step="256" 
                  value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Top Header */}
        <header className="h-[81px] shrink-0 border-b border-white/5 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-black text-white">{currentModelData?.name || "Anita AI"}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 
                System Online • {currentModelData?.category.toUpperCase()} ENGINE
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setMessages([])}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
            >
              <RefreshCcw className="w-3 h-3" />
              CLEAR CONTEXT
            </button>
          </div>
        </header>

        {/* Scrollable Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10 pb-40">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center opacity-80">
              <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                <Bot className="w-12 h-12 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-400 mb-4">
                Greetings, Captain.
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-lg">
                I am your dedicated enterprise intelligence node. Powered by the <strong className="text-indigo-400">{currentModelData?.name}</strong> architecture. Standing by for complex logical reasoning, code synthesis, and architectural design.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full">
                {["Refactor a React Component", "Analyze Next.js Middleware", "Optimize WebGPU Shaders", "Generate System Architecture Diagram"].map((suggestion) => (
                  <button 
                    key={suggestion}
                    onClick={() => setInputValue(suggestion)}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-slate-300 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-300 transition-all text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-6",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {/* Avatar */}
                    <div className="shrink-0 mt-1">
                      {msg.role === "user" ? (
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg shadow-black/50">
                          <span className="text-xs font-black text-slate-300">USR</span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 border border-indigo-400/30 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={cn(
                      "max-w-[85%] rounded-3xl p-6 shadow-2xl relative group",
                      msg.role === "user" 
                        ? "bg-slate-800/80 border border-slate-700/50 backdrop-blur-md rounded-tr-sm text-slate-200" 
                        : msg.status === "error"
                          ? "bg-red-950/50 border border-red-500/30 rounded-tl-sm text-red-200"
                          : "bg-indigo-950/30 border border-indigo-500/20 backdrop-blur-md rounded-tl-sm text-slate-200"
                    )}>
                      {msg.status === "streaming" ? (
                        <div className="flex items-center gap-2 h-6">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75" />
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150" />
                        </div>
                      ) : (
                        <div className="text-[14px] font-sans">
                          {msg.role === "assistant" && msg.status !== "error" 
                            ? formatMarkdownContent(msg.content)
                            : <span className="whitespace-pre-wrap leading-relaxed">{msg.content}</span>
                          }
                        </div>
                      )}
                      
                      {msg.role === "assistant" && msg.modelId && msg.status === "complete" && (
                        <div className="absolute -bottom-6 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500">
                          <Shield className="w-3 h-3" />
                          Generated by {DASHSCOPE_MODELS.find(m => m.id === msg.modelId)?.name || msg.modelId}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* INPUT CONSOLE (Floating Bottom) */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 pt-0 z-20 bg-gradient-to-t from-[#030712] via-[#030712]/90 to-transparent pointer-events-none">
          <div className="max-w-4xl mx-auto w-full pointer-events-auto">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 shadow-2xl shadow-black/50 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300">
              
              {/* Attachments & Tools Header */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
                 <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-indigo-400 transition-colors" title="Attach file" aria-label="Attach file">
                    <Paperclip className="w-4 h-4" />
                 </button>
                 <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-emerald-400 transition-colors" title="Send Image to Vision Model" aria-label="Send Image to Vision Model">
                    <ImageIcon className="w-4 h-4" />
                 </button>
                 <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-amber-400 transition-colors" title="Voice Input" aria-label="Voice Input">
                    <Mic className="w-4 h-4" />
                 </button>
                 <div className="flex-1" />
                 <span className="text-[9px] font-black tracking-widest uppercase text-slate-500 flex items-center gap-1">
                   <Command className="w-3 h-3" /> Enter
                 </span>
              </div>

              {/* Textarea */}
              <div className="flex items-end gap-2 p-2 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Command ${currentModelData?.name || "Anita"}...`}
                  disabled={isLoading}
                  rows={1}
                  className="w-full bg-transparent text-white text-sm px-2 py-3 focus:outline-none resize-none custom-scrollbar min-h-[44px] max-h-[200px]"
                />
                
                {isLoading ? (
                  <button 
                    onClick={() => {/* Implement Cancel */}}
                    className="shrink-0 w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors border border-red-500/30"
                    aria-label="Cancel request"
                  >
                    <StopCircle className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!inputValue.trim()}
                    className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-all disabled:opacity-30 disabled:hover:bg-indigo-600 border border-indigo-400/30 shadow-lg shadow-indigo-500/20 group"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-4">
              AI Responses are generated structurally and may contain inaccuracies. Verify critical outputs.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

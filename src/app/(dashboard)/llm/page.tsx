import { Metadata } from 'next';
import Link from 'next/link';
import {
  MessageSquare, FileSearch, BookOpen, Languages, Code, GitBranch,
  PenLine, CheckCheck, Wand2, Search, Mail, UserCircle as FileUser, Lightbulb,
  ImageIcon, Database, Heart, Tags, LayoutGrid, HelpCircle, ClipboardList,
  BrainCircuit, Scale, FileCheck, GraduationCap, Quote, Mic, Volume2,
  Swords, Workflow, Bot, Zap, Sparkles, Layers
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'LLM Engine | Omni-Tool',
  description: '30 AI-Powered Tools — Chat, Summarize, Translate, Code & more via Gemini/GPT/Claude',
};

const CATEGORIES = [
  {
    label: 'Chat & Conversation',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
    tools: [
      { slug: 'chat', name: 'AI Chat', desc: 'Multi-turn conversational AI', icon: MessageSquare, accent: 'text-violet-400' },
      { slug: 'document-chat', name: 'Document Chat', desc: 'Chat with uploaded documents', icon: FileSearch, accent: 'text-violet-400' },
      { slug: 'persona-creator', name: 'Persona Creator', desc: 'Create custom AI personas', icon: FileUser, accent: 'text-violet-400' },
      { slug: 'debate-simulator', name: 'Debate Simulator', desc: 'Multi-perspective debate AI', icon: Swords, accent: 'text-violet-400' },
    ],
  },
  {
    label: 'Writing & Content',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    tools: [
      { slug: 'summarizer', name: 'Summarizer', desc: 'Condense long texts intelligently', icon: BookOpen, accent: 'text-blue-400' },
      { slug: 'translator', name: 'Translator', desc: 'Multi-language translation', icon: Languages, accent: 'text-blue-400' },
      { slug: 'text-rewriter', name: 'Text Rewriter', desc: 'Paraphrase and restyle text', icon: PenLine, accent: 'text-blue-400' },
      { slug: 'grammar-checker', name: 'Grammar Checker', desc: 'Fix errors and improve flow', icon: CheckCheck, accent: 'text-blue-400' },
      { slug: 'content-generator', name: 'Content Generator', desc: 'Blog posts, articles, copy', icon: Wand2, accent: 'text-blue-400' },
      { slug: 'email-composer', name: 'Email Composer', desc: 'Professional email drafts', icon: Mail, accent: 'text-blue-400' },
    ],
  },
  {
    label: 'Developer Tools',
    color: 'from-emerald-500/20 to-green-500/20',
    border: 'border-emerald-500/30',
    tools: [
      { slug: 'code-assistant', name: 'Code Assistant', desc: 'Write and explain code', icon: Code, accent: 'text-emerald-400' },
      { slug: 'code-reviewer', name: 'Code Reviewer', desc: 'Review code for bugs and style', icon: GitBranch, accent: 'text-emerald-400' },
      { slug: 'prompt-engineer', name: 'Prompt Engineer', desc: 'Optimize and refine prompts', icon: Lightbulb, accent: 'text-emerald-400' },
      { slug: 'workflow-automator', name: 'Workflow Automator', desc: 'Chain multiple AI operations', icon: Workflow, accent: 'text-emerald-400' },
    ],
  },
  {
    label: 'SEO & Marketing',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    tools: [
      { slug: 'seo-optimizer', name: 'SEO Optimizer', desc: 'Meta tags and keyword analysis', icon: Search, accent: 'text-amber-400' },
      { slug: 'resume-builder', name: 'Resume Builder', desc: 'Professional CV generation', icon: FileUser, accent: 'text-amber-400' },
      { slug: 'image-captioner', name: 'Image Captioner', desc: 'AI-generated alt text', icon: ImageIcon, accent: 'text-amber-400' },
    ],
  },
  {
    label: 'Data & Analysis',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    tools: [
      { slug: 'data-extractor', name: 'Data Extractor', desc: 'Structured data from text', icon: Database, accent: 'text-pink-400' },
      { slug: 'sentiment-analyzer', name: 'Sentiment Analyzer', desc: 'Emotion and tone analysis', icon: Heart, accent: 'text-pink-400' },
      { slug: 'entity-recognizer', name: 'Entity Recognizer', desc: 'Named entity extraction', icon: Tags, accent: 'text-pink-400' },
      { slug: 'classification', name: 'Classification', desc: 'Text categorization', icon: LayoutGrid, accent: 'text-pink-400' },
    ],
  },
  {
    label: 'Research & Education',
    color: 'from-sky-500/20 to-indigo-500/20',
    border: 'border-sky-500/30',
    tools: [
      { slug: 'question-generator', name: 'Question Generator', desc: 'Generate quiz questions', icon: HelpCircle, accent: 'text-sky-400' },
      { slug: 'flashcard-maker', name: 'Flashcard Maker', desc: 'Study cards from any text', icon: ClipboardList, accent: 'text-sky-400' },
      { slug: 'mind-map-generator', name: 'Mind Map Generator', desc: 'Visual concept mapping', icon: BrainCircuit, accent: 'text-sky-400' },
      { slug: 'research-assistant', name: 'Research Assistant', desc: 'Deep research and analysis', icon: GraduationCap, accent: 'text-sky-400' },
      { slug: 'citation-generator', name: 'Citation Generator', desc: 'APA/MLA/Chicago citations', icon: Quote, accent: 'text-sky-400' },
    ],
  },
  {
    label: 'Legal & Voice',
    color: 'from-slate-400/20 to-gray-500/20',
    border: 'border-slate-500/30',
    tools: [
      { slug: 'legal-analyzer', name: 'Legal Analyzer', desc: 'Contract clause analysis', icon: Scale, accent: 'text-slate-400' },
      { slug: 'contract-reviewer', name: 'Contract Reviewer', desc: 'Risk assessment in contracts', icon: FileCheck, accent: 'text-slate-400' },
      { slug: 'speech-to-text', name: 'Speech to Text', desc: 'Voice transcription', icon: Mic, accent: 'text-slate-400' },
      { slug: 'text-to-speech', name: 'Text to Speech', desc: 'AI voice generation', icon: Volume2, accent: 'text-slate-400' },
    ],
  },
];

export default function LlmHubPage() {
  return (
    <div className="container mx-auto p-6 space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-fuchsia-600/20 border border-violet-500/20 p-8 md:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold tracking-wider uppercase">
              Multi-Model AI
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
            LLM Engine
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl leading-relaxed">
            30 AI-Powered Tools — chat, summarize, translate, code, analyze, and generate content using GPT-4o, Claude, Gemini, or Llama models.
          </p>
          <div className="flex items-center gap-6 mt-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-violet-400" /> Streaming Response</span>
            <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-purple-400" /> Multi-Model</span>
            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-fuchsia-400" /> Context Memory</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      {CATEGORIES.map((cat) => (
        <div key={cat.label} className="space-y-4">
          <h2 className="text-lg font-bold text-slate-300 tracking-wide uppercase flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${cat.color.replace('/20', '')}`} />
            {cat.label}
            <span className="text-xs text-slate-600 font-normal normal-case ml-2">({cat.tools.length} tools)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={`/llm/${tool.slug}`}
                  className={`group flex items-start gap-4 p-5 bg-card/50 backdrop-blur-sm border ${cat.border} rounded-2xl hover:bg-gradient-to-br ${cat.color} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-700/80 transition-colors">
                    <Icon className={`w-5 h-5 ${tool.accent} transition-colors`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-white transition-colors truncate">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{tool.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

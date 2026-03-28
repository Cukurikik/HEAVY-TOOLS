import LlmToolInterface from "@/modules/llm-engine/components/LlmToolInterface";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const LLM_TOOLS_DATA: Record<string, { title: string; description: string; systemPrompt: string }> = {
  'chat':               { title: "AI Chat", description: "Multi-turn conversational AI assistant.", systemPrompt: "You are a helpful, friendly AI assistant. Respond concisely and accurately." },
  'document-chat':      { title: "Document Chat", description: "Chat with uploaded documents and PDFs.", systemPrompt: "You are a document analysis assistant. Help users understand and extract information from their documents." },
  'summarizer':         { title: "Summarizer", description: "Condense long texts into key points.", systemPrompt: "You are an expert text summarizer. Provide concise, well-structured summaries that capture the most important information. Respond with bullet points when appropriate." },
  'translator':         { title: "Translator", description: "Multi-language text translation.", systemPrompt: "You are a professional translator. Translate text accurately while preserving tone and context. If no target language is specified, translate to English." },
  'code-assistant':     { title: "Code Assistant", description: "Write, explain, and debug code.", systemPrompt: "You are an expert software engineer. Write clean, well-documented code. Explain your solutions clearly. Support all major programming languages." },
  'code-reviewer':      { title: "Code Reviewer", description: "Review code for bugs and improvements.", systemPrompt: "You are a senior code reviewer. Analyze code for bugs, security issues, performance problems, and style improvements. Be specific and actionable." },
  'text-rewriter':      { title: "Text Rewriter", description: "Paraphrase and restyle text.", systemPrompt: "You are a skilled writer. Rewrite text to improve clarity, tone, and engagement while preserving the original meaning." },
  'grammar-checker':    { title: "Grammar Checker", description: "Fix grammar errors and improve writing.", systemPrompt: "You are a meticulous grammar and style editor. Identify errors, suggest corrections, and explain the grammatical rules behind each fix." },
  'content-generator':  { title: "Content Generator", description: "Blog posts, articles, marketing copy.", systemPrompt: "You are a creative content writer. Generate engaging, well-structured content optimized for the target audience and platform." },
  'seo-optimizer':      { title: "SEO Optimizer", description: "Meta tags, keywords, and content analysis.", systemPrompt: "You are an SEO expert. Analyze content for search optimization opportunities. Suggest meta tags, keywords, headings, and content improvements." },
  'email-composer':     { title: "Email Composer", description: "Draft professional emails.", systemPrompt: "You are an expert email writer. Compose clear, professional emails with appropriate tone, structure, and call-to-action." },
  'resume-builder':     { title: "Resume Builder", description: "Professional CV generation.", systemPrompt: "You are a career consultant and resume expert. Help create compelling, ATS-friendly resumes tailored to specific job descriptions." },
  'prompt-engineer':    { title: "Prompt Engineer", description: "Optimize and refine AI prompts.", systemPrompt: "You are a prompt engineering specialist. Help users create more effective prompts for AI models. Analyze and improve existing prompts." },
  'image-captioner':    { title: "Image Captioner", description: "Generate descriptive alt text.", systemPrompt: "You are an accessibility and image description expert. Generate detailed, accurate alt text and captions for images." },
  'data-extractor':     { title: "Data Extractor", description: "Extract structured data from text.", systemPrompt: "You are a data extraction specialist. Parse unstructured text and extract structured data in JSON, CSV, or table format." },
  'sentiment-analyzer': { title: "Sentiment Analyzer", description: "Analyze tone and emotion.", systemPrompt: "You are an NLP expert specializing in sentiment analysis. Analyze text for emotional tone, sentiment polarity, and underlying attitudes." },
  'entity-recognizer':  { title: "Entity Recognizer", description: "Named entity extraction.", systemPrompt: "You are a named entity recognition expert. Identify and categorize entities (people, organizations, locations, dates, etc.) in text." },
  'classification':     { title: "Text Classifier", description: "Categorize text into labels.", systemPrompt: "You are a text classification expert. Categorize input text into relevant categories with confidence scores and reasoning." },
  'question-generator': { title: "Question Generator", description: "Generate quiz and test questions.", systemPrompt: "You are an education expert. Generate thoughtful questions from source material, including multiple choice, true/false, and open-ended formats." },
  'flashcard-maker':    { title: "Flashcard Maker", description: "Create study flashcards.", systemPrompt: "You are a learning specialist. Create effective study flashcards with clear questions/terms on one side and concise answers/definitions on the other." },
  'mind-map-generator': { title: "Mind Map Generator", description: "Create visual concept maps.", systemPrompt: "You are a knowledge organization expert. Generate structured mind maps as hierarchical outlines or Mermaid diagrams from any topic or text." },
  'legal-analyzer':     { title: "Legal Analyzer", description: "Analyze legal documents.", systemPrompt: "You are a legal analysis assistant. Help identify key clauses, potential issues, and important terms in legal documents. Note: This is not legal advice." },
  'contract-reviewer':  { title: "Contract Reviewer", description: "Review contracts for risks.", systemPrompt: "You are a contract review specialist. Identify potential risks, missing clauses, unfavorable terms, and areas needing negotiation. Note: This is not legal advice." },
  'research-assistant': { title: "Research Assistant", description: "Deep research and analysis.", systemPrompt: "You are a thorough research assistant. Help investigate topics deeply, organize findings, identify gaps, and synthesize information from multiple angles." },
  'citation-generator': { title: "Citation Generator", description: "APA, MLA, Chicago citations.", systemPrompt: "You are a citation and bibliography expert. Generate properly formatted citations in APA, MLA, Chicago, Harvard, and other styles." },
  'speech-to-text':     { title: "Speech to Text", description: "Transcription assistance.", systemPrompt: "You are a transcription assistant. Help clean up, format, and improve transcribed text. Add punctuation, fix errors, and structure the content." },
  'text-to-speech':     { title: "Text to Speech", description: "Text optimization for voice.", systemPrompt: "You are a voice content specialist. Optimize text for natural-sounding speech synthesis. Add SSML markup, suggest pacing, and improve readability." },
  'persona-creator':    { title: "Persona Creator", description: "Create custom AI personas.", systemPrompt: "You are a persona design expert. Help users create detailed AI persona specifications including personality, knowledge domains, communication style, and behavioral guidelines." },
  'debate-simulator':   { title: "Debate Simulator", description: "Multi-perspective debate.", systemPrompt: "You are a debate moderator and critical thinker. Present multiple perspectives on any topic, argue for and against positions, and help users explore nuanced viewpoints." },
  'workflow-automator': { title: "Workflow Automator", description: "Chain AI operations.", systemPrompt: "You are a workflow automation expert. Help users design multi-step AI processing pipelines, chain operations, and create reusable templates." },
};

export default async function LlmToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const toolConf = LLM_TOOLS_DATA[tool] || {
    title: "LLM Engine",
    description: "AI-Powered Processing",
    systemPrompt: "You are a helpful AI assistant."
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2 text-sm text-zinc-400 font-medium mb-4">
        <Link href="/llm" className="hover:text-white transition-colors">LLM Engine</Link>
        <ChevronRight className="w-4 h-4 text-zinc-600" />
        <span className="text-violet-400 capitalize">{tool.replace(/-/g, ' ')}</span>
      </div>
      
      <LlmToolInterface
        toolId={tool}
        title={toolConf.title}
        description={toolConf.description}
        systemPrompt={toolConf.systemPrompt}
      />
    </div>
  );
}

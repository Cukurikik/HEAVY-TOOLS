'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Loader2,
  Save,
  Search,
  CheckCircle2,
  Palette,
  BrainCircuit,
  Film,
  Music,
  FileText,
  Cloud,
  Webhook,
  ShieldCheck,
  Cpu,
  RefreshCcw,
} from 'lucide-react';

interface FeatureSchema {
  id: string;
  category: string;
  slug: string;
  label: string;
  description: string;
  inputType: 'toggle' | 'text' | 'password' | 'dropdown' | 'slider' | 'color';
  options?: string[];
  defaultValue: any;
}

const CATEGORY_MAP: Record<string, { label: string; icon: React.ReactNode }> = {
  tampilan: { label: 'Tampilan', icon: <Palette className="w-5 h-5" /> },
  performa: { label: 'Performa', icon: <Cpu className="w-5 h-5" /> },
  keamanan: { label: 'Keamanan', icon: <ShieldCheck className="w-5 h-5" /> },
  storage: { label: 'Storage', icon: <Cloud className="w-5 h-5" /> },
  notifikasi: { label: 'Notifikasi', icon: <Webhook className="w-5 h-5" /> },
  akun: { label: 'Akun', icon: <CheckCircle2 className="w-5 h-5" /> },
  video: { label: 'Video Engine', icon: <Film className="w-5 h-5" /> },
  audio: { label: 'Audio Engine', icon: <Music className="w-5 h-5" /> },
  pdf: { label: 'PDF Engine', icon: <FileText className="w-5 h-5" /> },
  llm: { label: 'LLM & AI Engine', icon: <BrainCircuit className="w-5 h-5" /> },
  plugin: { label: 'Plugin & Hardware', icon: <Settings className="w-5 h-5" /> },
  developer: { label: 'Developer & Debug', icon: <RefreshCcw className="w-5 h-5" /> },
  converter: { label: 'Converter', icon: <Settings className="w-5 h-5" /> },
};

export default function DynamicSettingsPage() {
  const [schema, setSchema] = useState<FeatureSchema[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('tampilan');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ⚡ ZUSTAND OMNI-STORE INTEGRATION
  const { settings: values, setSetting, fetchSettings } = useSettingsStore();

  // Fetch schema from API on mount
  useEffect(() => {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 30000);

    fetch('/api/settings/schema', { signal: abortController.signal, cache: 'no-store' })
      .then((r) => r.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          setSchema(data.schema || []);
          setCategories(data.categories || []);
          
          // Fix: Ensure we also fetch the store JSON from backend immediately, 
          // just in case ClientSettingsProvider missed resolving it or we arrived via quick client routing.
          fetchSettings(); 
        } catch (e) {
          console.error('[Settings] Schema parse error:', e, text);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('[Settings] Schema fetch failed/timed out:', err);
        }
        setLoading(false);
      })
      .finally(() => clearTimeout(timeoutId));

    return () => {
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [fetchSettings]);

  const pendingSaves = useRef<Record<string, any>>({});
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback((key: string, value: any) => {
    // 1. UPDATE GLOBAL ZUSTAND STORE INSTANTLY!
    // This allows *ANY* app component using `useSettingsStore(s => s.settings[key])` to Re-Render instantly.
    setSetting(key, value);
    
    // 2. ─── LIVE ENGINE ACTIVATION (Immediate, no debounce) ───
    const isEnabledKey = key.endsWith('_enabled');
    const cleanSlug = key.replace('_enabled', '');
    const feature = schema.find((f) => f.slug === cleanSlug);

    if (feature && feature.inputType === 'toggle' && isEnabledKey) {
      // Toggle feature: dispatch the boolean value directly
      window.dispatchEvent(
        new CustomEvent('omni:setting-changed', {
          detail: { slug: cleanSlug, value, category: feature?.category || '' },
        })
      );
    } else if (feature && !isEnabledKey) {
      // Config value change (dropdown/text/slider/color): dispatch the actual config value
      window.dispatchEvent(
        new CustomEvent('omni:setting-changed', {
          detail: { slug: cleanSlug, value, category: feature?.category || '' },
        })
      );
    } else if (feature && feature.inputType !== 'toggle' && isEnabledKey) {
      // Non-toggle feature being enabled/disabled: 
      // If turning ON, also fire onAfterChange with the current config value
      if (value === true) {
        const configValue = values[cleanSlug] ?? feature.defaultValue;
        window.dispatchEvent(
          new CustomEvent('omni:setting-changed', {
            detail: { slug: cleanSlug, value: configValue, category: feature?.category || '' },
          })
        );
      }
      // If turning OFF, fire with false to allow cleanup
      if (value === false) {
        window.dispatchEvent(
          new CustomEvent('omni:setting-changed', {
            detail: { slug: cleanSlug, value: false, category: feature?.category || '' },
          })
        );
      }
    }

    // 3. Batch payload for the DB
    pendingSaves.current[key] = value;

    // 4. Debounce the actual API CALL (500ms) to protect from concurrent write corruption
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    
    setSaving(true);
    saveTimeout.current = setTimeout(async () => {
      const payload = { ...pendingSaves.current };
      pendingSaves.current = {}; // Flush queue
      
      try {
        const res = await fetch('/api/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          console.error('[Settings] HTTP Save error from API', result);
          // If server rejects completely, force re-sync from DB
          fetchSettings();
        }
      } catch (e) {
        console.error('[Settings] Save failed:', e);
        // Desync recovery
        fetchSettings();
      } finally {
        setSaving(false);
      }
    }, 500);
  }, [schema, setSetting, fetchSettings, values]);

  const filteredFeatures = schema.filter((f) => {
    const matchesCat = f.category === activeCategory;
    const matchesSearch = searchQuery
      ? f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return searchQuery ? matchesSearch : matchesCat;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-zinc-400 font-medium animate-pulse">Initializing Omni-Tool Configuration Hub...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full lg:flex-row gap-8 pb-32">
      {/* SIDEBAR */}
      <aside className="lg:w-72 flex-shrink-0">
        <div className="sticky top-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-2">
              <Settings className="w-6 h-6 text-indigo-500" />
              Settings Hub
            </h2>
            <p className="text-sm text-zinc-400">
              Manage {schema.length} enterprise configurations across {categories.length} isolated modules.
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <Input
              type="text"
              placeholder={`Search ${schema.length} settings...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 focus-visible:ring-indigo-500"
            />
          </div>

          {!searchQuery && (
            <nav className="flex flex-col space-y-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const meta = CATEGORY_MAP[cat] || { label: cat, icon: <Settings className="w-5 h-5" /> };
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 w-full text-left overflow-hidden ${
                      isActive
                        ? 'text-white'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-sidebar-tab"
                        className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 transition-colors ${isActive ? 'text-indigo-400' : ''}`}>
                      {meta.icon}
                    </span>
                    <span className="relative z-10">{meta.label}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0">
        <ScrollArea className="h-full pr-4 pb-20">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="mb-8 border-b border-zinc-800/50 pb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                {!searchQuery ? CATEGORY_MAP[activeCategory]?.label || activeCategory : 'Search Results'}
                <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20 font-mono">
                  {filteredFeatures.length} Nodes
                </span>
              </h3>
              <p className="text-sm text-zinc-400 mt-2">
                All changes are safely stored in Local Storage architecture. 
              </p>
            </div>

            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {filteredFeatures.map((feature, idx) => {
                  const isEnabled = !!values[`${feature.slug}_enabled`];
                  
                  return (
                    <motion.div
                      key={feature.id}
                      layout 
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                      className={`flex flex-col p-5 bg-zinc-900/40 border transition-colors duration-300 rounded-xl ${
                        isEnabled ? 'border-indigo-500/50 shadow-[0_0_15px_-3px_rgba(99,102,241,0.1)]' : 'border-zinc-800/60 hover:border-zinc-700'
                      }`}
                    >
                      {/* HEADER: Switch and Label */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border transition-colors flex-shrink-0 ${
                              isEnabled ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-zinc-800/50 text-zinc-500 border-zinc-700/50'
                            }`}>
                              N-{feature.id}
                            </span>
                            <h4 className={`text-sm font-semibold truncate transition-colors ${
                              isEnabled ? 'text-indigo-50' : 'text-zinc-300'
                            }`}>{feature.label}</h4>
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{feature.description}</p>
                        </div>

                        <div className="flex-shrink-0 pt-1">
                          {/* UNIVERSAL MASTER TOGGLE — always visible */}
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(v) => handleChange(`${feature.slug}_enabled`, v)}
                            className="data-[state=checked]:bg-indigo-500"
                          />
                        </div>
                      </div>

                      {/* EXPANDABLE SECONDARY CONFIG */}
                      {feature.inputType !== 'toggle' && (
                        <AnimatePresence>
                          {isEnabled && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              className="overflow-hidden border-t border-zinc-800/50 pt-4"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-zinc-400 font-medium min-w-[100px]">Configuration:</span>
                                
                                <div className="flex-1 max-w-md">
                                  {/* DROPDOWN */}
                                  {feature.inputType === 'dropdown' && (
                                    <Select
                                      value={values[feature.slug]?.toString() ?? feature.defaultValue?.toString()}
                                      onValueChange={(v) => handleChange(feature.slug, v)}
                                    >
                                      <SelectTrigger className="w-full bg-zinc-950/50 border-zinc-700/50 focus:ring-indigo-500 focus:border-indigo-500 h-9 relative z-20">
                                        <SelectValue placeholder="Select option" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-zinc-900 border-zinc-700 relative z-50 rounded-lg shadow-xl" position="popper" sideOffset={5}>
                                        {(feature.options || []).map((opt: any, i) => {
                                          const val = typeof opt === 'object' && opt !== null ? opt.value : opt;
                                          const lbl = typeof opt === 'object' && opt !== null ? opt.label : opt;
                                          return (
                                            <SelectItem key={val || i} value={String(val)} className="cursor-pointer focus:bg-indigo-500/20 focus:text-indigo-300 py-2">
                                              {lbl}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                  )}

                                  {/* TEXT / PASSWORD */}
                                  {(feature.inputType === 'text' || feature.inputType === 'password') && (
                                    <Input
                                      type={feature.inputType}
                                      value={values[feature.slug] ?? ''}
                                      onChange={(e) => handleChange(feature.slug, e.target.value)}
                                      placeholder={feature.inputType === 'password' ? '••••••••' : 'Enter configured value...'}
                                      className="w-full bg-zinc-950/50 border-zinc-700/50 focus:border-indigo-500 focus:ring-indigo-500 font-mono text-sm h-9"
                                    />
                                  )}

                                  {/* SLIDER */}
                                  {feature.inputType === 'slider' && (
                                    <div className="w-full flex items-center gap-4 bg-zinc-950/30 p-2 rounded-lg border border-zinc-800/50">
                                      <Slider
                                        min={(feature.options as any)?.min ?? 0}
                                        max={(feature.options as any)?.max ?? (typeof feature.defaultValue === 'number' ? Math.max(feature.defaultValue * 4, 100) : 100)}
                                        step={(feature.options as any)?.step ?? 1}
                                        value={[Number(values[feature.slug] ?? feature.defaultValue)]}
                                        onValueChange={(vals) => handleChange(feature.slug, vals[0])}
                                        className="flex-1"
                                      />
                                      <span className="text-xs font-mono text-indigo-400 min-w-[3rem] text-right bg-indigo-500/10 py-1 px-2 rounded font-semibold border border-indigo-500/20">
                                        {values[feature.slug] ?? feature.defaultValue}
                                      </span>
                                    </div>
                                  )}

                                  {/* COLOR */}
                                  {feature.inputType === 'color' && (
                                    <div className="flex items-center gap-3">
                                      <Input
                                        type="color"
                                        value={values[feature.slug] ?? '#6366f1'}
                                        onChange={(e) => handleChange(feature.slug, e.target.value)}
                                        className="w-12 h-9 p-0.5 cursor-pointer bg-zinc-950/50 border-zinc-700/50 rounded-md"
                                      />
                                      <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded">
                                        {values[feature.slug] ?? '#6366f1'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredFeatures.length === 0 && (
                <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                  <p className="text-zinc-500 font-medium">No system parameters matched your search.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </main>


      {/* LIVE CONFIRMATION TOAST */}
      <AnimatePresence>
        {saving && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-zinc-200 px-5 py-3.5 rounded-xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)] backdrop-blur-xl z-50"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium tracking-wide">Changes Applied Live</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



import React, { useState, useMemo } from 'react';
import { PROMPTS } from './constants';
import { PromptItem } from './types';
import { Search, Copy, ExternalLink, X, Check, Image as ImageIcon, Github } from 'lucide-react';

// Component to handle images with fallback for broken links
const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-800 text-slate-500 p-4 ${className}`} style={{ minHeight: '200px' }}>
        <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
        <span className="text-xs text-center">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setError(true)}
    />
  );
};

const App: React.FC = () => {
  // Initialize state with PROMPTS constant, but allow adding to it
  const [allPrompts, setAllPrompts] = useState<PromptItem[]>(PROMPTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

  const { categories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    const order: string[] = [];

    allPrompts.forEach((p) => {
      if (!counts[p.category]) {
        order.push(p.category);
        counts[p.category] = 0;
      }
      counts[p.category] += 1;
    });

    return {
      categories: ['All', ...order.sort((a, b) => (counts[b] || 0) - (counts[a] || 0))],
      categoryCounts: counts,
    };
  }, [allPrompts]);

  const filteredPrompts = useMemo(() => {
    return allPrompts.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allPrompts]);

  const uniqueSources = useMemo(() => {
    const seen = new Map<string, { name: string; url: string }>();
    allPrompts.forEach((p) => {
      if (p.source?.name && p.source.url && !seen.has(p.source.name)) {
        seen.set(p.source.name, { name: p.source.name, url: p.source.url });
      }
    });
    return Array.from(seen.values());
  }, [allPrompts]);

  const sourceCode = (name?: string) => {
    if (!name) return 'SRC';
    const lower = name.toLowerCase();
    if (lower.includes('glidea')) return 'GLD';
    if (lower.includes('jimmy')) return 'JLV';
    if (lower.includes('picotrex')) return 'PCT';
    if (lower.includes('github')) return 'GH';
    return name.slice(0, 3).toUpperCase();
  };

  const handleCopy = async (text: string) => {
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
        setToast({ visible: true, message: 'Prompt copied to clipboard!' });
    } catch (err) {
        setToast({ visible: true, message: 'Failed to copy.' });
    }
    
    setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
    }, 2000);
  };

  // Upload removed

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍌</span>
                <div>
                  <h1 className="text-lg font-bold text-white leading-tight">Banana Prompts · 视觉灵感精选</h1>
                  <p className="text-[11px] text-slate-400">由公众号「娇姐 话AI圈」整理 · 精选开源优秀提示词，快速启发创意</p>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                <span className="font-semibold text-slate-300 text-sm">数据来源 · 精选 3 个开源项目</span>
                <a className="hover:text-yellow-400 underline" href="https://github.com/glidea/banana-prompt-quicker" target="_blank" rel="noreferrer">glidea/banana-prompt-quicker</a>
                <a className="hover:text-yellow-400 underline" href="https://github.com/JimmyLv/awesome-nano-banana" target="_blank" rel="noreferrer">JimmyLv/awesome-nano-banana</a>
                <a className="hover:text-yellow-400 underline" href="https://github.com/PicoTrex/Awesome-Nano-Banana-images" target="_blank" rel="noreferrer">PicoTrex/Awesome-Nano-Banana-images</a>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 text-xs text-slate-400">
              <div className="w-24 h-24 border border-slate-800 rounded bg-slate-900 overflow-hidden flex items-center justify-center">
                <img
                  src="https://quickchart.io/qr?text=%E5%A8%87%E5%A7%90%20%E8%AF%9DAI%E5%9C%88&size=220"
                  alt="娇姐 话AI圈 公众号二维码"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>扫码获取更多AI干货</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索提示词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-slate-200 placeholder:text-slate-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide">分类</p>
              <span className="text-[11px] text-slate-500">提示：鼠标悬浮卡片可复制完整 Prompt</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    selectedCategory === cat
                      ? 'bg-yellow-500 text-slate-900 border-yellow-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}（{cat === 'All' ? allPrompts.length : categoryCounts[cat] || 0}）
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="mt-6">
          <div className="masonry-grid">
            {filteredPrompts.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                onClick={() => setSelectedPrompt(item)}
                className="break-inside-avoid mb-6 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group hover:shadow-xl hover:shadow-yellow-500/5 hover:-translate-y-1 relative"
              >
                <div className="relative aspect-auto bg-slate-800">
                  <ImageWithFallback
                    src={item.preview}
                    alt={item.title}
                    className="w-full h-auto object-cover min-h-[150px]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="w-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(item.prompt);
                        }}
                        className="w-full py-2 bg-yellow-500 text-slate-900 text-xs font-bold rounded shadow-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <Copy className="h-3 w-3" /> Copy Prompt
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-1 bg-slate-950/70 backdrop-blur text-xs rounded text-slate-300 border border-slate-800 capitalize">
                      {item.mode}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-100 mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mt-4" />
                </div>
              </div>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <p>No prompts found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedPrompt(null)}>
          <div 
            className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
               {/* Blurred background for image container */}
               <div className="absolute inset-0 opacity-20 blur-3xl scale-125" style={{backgroundImage: `url(${selectedPrompt.preview})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
               <ImageWithFallback
                 src={selectedPrompt.preview} 
                 alt={selectedPrompt.title} 
                 className="relative z-10 max-h-full max-w-full object-contain rounded shadow-lg"
               />
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col p-6 md:p-8 overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{selectedPrompt.title}</h2>
                        <div className="flex items-center flex-wrap gap-3 text-sm text-slate-400">
                            <span className="px-2 py-0.5 bg-slate-800 rounded text-xs">{selectedPrompt.category}</span>
                            <span>•</span>
                            <span className="capitalize">{selectedPrompt.mode}</span>
                            {selectedPrompt.source && (
                                <>
                                    <span>•</span>
                                    <a 
                                        href={selectedPrompt.source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-yellow-500 transition-colors text-xs"
                                    >
                                        <Github className="h-3 w-3" />
                                        {selectedPrompt.source.name.split('/')[1] || selectedPrompt.source.name}
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={() => setSelectedPrompt(null)}
                        className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 min-h-0">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Prompt</label>
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 mb-4 overflow-y-auto max-h-[40vh] md:max-h-[none]">
                        <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed font-mono">
                            {selectedPrompt.prompt}
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-4 flex gap-3">
                  <button 
                    onClick={() => handleCopy(selectedPrompt.prompt)}
                    className="flex-1 py-3 bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="h-4 w-4" /> Copy Prompt
                  </button>
                  <button
                    onClick={() => {
                      setToast({ visible: true, message: '生成同款功能开发中，敬请期待' });
                      setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2000);
                    }}
                    className="px-4 py-3 bg-slate-800 text-slate-400 font-medium rounded-lg border border-slate-700 hover:bg-slate-750 transition-colors flex items-center justify-center gap-2 cursor-not-allowed"
                    title="生成同款（开发中）"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span className="text-sm">生成同款</span>
                  </button>
                  {selectedPrompt.link && (
                    <a 
                        href={selectedPrompt.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-3 bg-slate-800 text-slate-300 font-medium rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        title="View Original Link"
                    >
                        <ExternalLink className="h-5 w-5" />
                        <span className="text-sm">原链接</span>
                    </a>
                  )}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Source Attribution */}
      {uniqueSources.length > 0 && (
        <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur px-4 sm:px-6 lg:px-8 py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto space-y-2">
            <p className="font-semibold text-slate-300">数据来源（开源项目整理）：</p>
            <div className="flex flex-wrap gap-3">
              {uniqueSources.map((src) => (
                <a
                  key={src.url}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-yellow-500/50 hover:text-yellow-400 transition-colors"
                >
                  <Github className="h-3 w-3" />
                  <span className="truncate">{src.name}</span>
                </a>
              ))}
            </div>
          </div>
        </footer>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 bg-yellow-500 text-slate-900 rounded-full shadow-2xl font-bold transition-all animate-bounce">
            <Check className="h-5 w-5" />
            <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;

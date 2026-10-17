import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  MapPin, 
  Clock, 
  DollarSign, 
  Coffee, 
  Utensils, 
  Camera, 
  Sunset, 
  Compass, 
  Plus, 
  Check, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { useAppStore } from '../context/StoreContext';
import { chatWithGemini } from '../api/gemini';

export function AIPlanner() {
  const { addPlace, user } = useAppStore();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Xin chào bạn! 👋 Mình là LetGoo AI — trợ lý du lịch & ẩm thực của bạn.\n\nBạn muốn tìm quán ăn ngon, cà phê view đẹp, hỏi kinh nghiệm hay cần mình lên trọn gói một lịch trình vi vu từ A đến Z? Cứ trò chuyện tự nhiên với mình nhé!',
      suggestedPlaces: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedPlaceIds, setSavedPlaceIds] = useState(new Set());
  const [quickReplies, setQuickReplies] = useState([
    '🍜 Quán ốc ngon nức tiếng Hà Nội',
    '☕ Cafe view đẹp ngắm hoàng hôn Hồ Tây',
    '🗓️ Lên lịch trình 1 ngày phố cổ 350k',
    '🌲 1 ngày săn mây và chill Đà Lạt'
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'cafe': return Coffee;
      case 'an': return Utensils;
      case 'dulich': return Camera;
      case 'chill': return Sunset;
      case 'workshop': return Compass;
      default: return MapPin;
    }
  };

  const handleSend = async (customText) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyContext = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await chatWithGemini(historyContext, textToSend);

      if (response && response.message) {
        const botMsg = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: response.message,
          suggestedPlaces: response.suggestedPlaces || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);

        if (response.quickReplies && response.quickReplies.length > 0) {
          setQuickReplies(response.quickReplies);
        }
      } else {
        throw new Error('Empty response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: 'Có chút gián đoạn kết nối với Gemini AI. Bạn thử nhắn lại câu hỏi hoặc chọn các gợi ý bên dưới nhé!',
        suggestedPlaces: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlace = (place) => {
    const placeKey = `${place.name}-${place.location}`;
    addPlace({
      title: place.name,
      location: place.location || 'Hà Nội',
      category: place.category || 'an',
      categoryLabel: place.category === 'cafe' ? 'Cà phê' : place.category === 'an' ? 'Ăn ngon' : 'Du lịch & Chill',
      priceText: place.cost || 'Tham khảo',
      reviewNote: place.desc || 'Gợi ý từ trợ lý LetGoo AI',
      tags: ['LetGoo AI', 'Trợ lý gợi ý']
    });

    setSavedPlaceIds(prev => new Set([...prev, placeKey]));
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: 'Đã làm mới cuộc trò chuyện! ✨ Bạn cần LetGoo AI tư vấn món gì hay lên lịch trình ở đâu hôm nay?',
        suggestedPlaces: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setQuickReplies([
      '🍜 Quán bún chả ngon ở Hà Nội',
      '☕ Cà phê sống ảo quanh Hồ Gươm',
      '🗓️ Lên lịch 1 ngày Đà Lạt 1 triệu',
      '🍢 Món ăn vặt phố cổ buổi tối'
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[550px] bg-[var(--color-bg-surface)] rounded-3xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      {/* CHATBOT HEADER */}
      <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-bg-subtle)]/60 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B4A] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#FF6B4A]/25">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1E1E1E]"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-[var(--color-text-main)] text-base">LetGoo AI Copilot</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FF6B4A]/15 to-purple-500/15 text-[#FF6B4A] dark:text-[#FF7B5C] border border-[#FF6B4A]/20">
                <Sparkles className="w-3 h-3" /> Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Trợ lý thông thái về ẩm thực & lịch trình du lịch Việt Nam
            </p>
          </div>
        </div>

        <button 
          onClick={handleResetChat}
          title="Làm mới đoạn chat"
          className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[#FF6B4A] hover:bg-[var(--color-bg-surface)] border border-transparent hover:border-[var(--color-border)] transition-all flex items-center gap-1.5 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Làm mới chat</span>
        </button>
      </div>

      {/* CHAT MESSAGE AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={msg.id}
              className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div className="shrink-0 mt-0.5">
                {isUser ? (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-amber-500 flex items-center justify-center text-white shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-3">
                <div 
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isUser 
                      ? 'bg-[var(--color-primary)] text-white rounded-tr-none' 
                      : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] border border-[var(--color-border-subtle)] rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Suggested Place Cards if any */}
                {msg.suggestedPlaces && msg.suggestedPlaces.length > 0 && (
                  <div className="pt-1 space-y-3">
                    <span className="text-xs font-bold text-[#FF6B4A] uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" /> Địa điểm gợi ý ({msg.suggestedPlaces.length})
                    </span>

                    <div className="grid grid-cols-1 gap-2.5">
                      {msg.suggestedPlaces.map((place, idx) => {
                        const Icon = getCategoryIcon(place.category);
                        const placeKey = `${place.name}-${place.location}`;
                        const isSaved = savedPlaceIds.has(placeKey);

                        return (
                          <div 
                            key={idx}
                            className="p-3.5 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] hover:border-[#FF6B4A]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-xl bg-[#FFEBE6] dark:bg-[#3D221B] text-[#FF6B4A] shrink-0 mt-0.5">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-extrabold text-sm text-[var(--color-text-main)]">
                                    {place.name}
                                  </h4>
                                  {place.time && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {place.time}
                                    </span>
                                  )}
                                  {place.cost && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                      {place.cost}
                                    </span>
                                  )}
                                </div>

                                {place.location && (
                                  <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 shrink-0" /> {place.location}
                                  </p>
                                )}

                                {place.desc && (
                                  <p className="text-xs text-[var(--color-text-main)]/80 mt-1">
                                    {place.desc}
                                  </p>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => handleSavePlace(place)}
                              disabled={isSaved}
                              className={`self-end sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                                isSaved
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 cursor-default'
                                  : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-xs active:scale-95'
                              }`}
                            >
                              {isSaved ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Đã lưu</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Lưu địa điểm</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <span className={`text-[10px] text-[var(--color-text-muted)] block ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex gap-3 mr-auto max-w-[85%]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B4A] to-amber-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] rounded-tl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium ml-1">LetGoo AI đang suy nghĩ...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER & INPUT */}
      <div className="p-4 sm:p-5 border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] shrink-0 space-y-3">
        {/* Dynamic Quick Reply Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-[var(--color-text-muted)] font-bold shrink-0">Gợi ý:</span>
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(reply)}
              disabled={loading}
              className="px-3 py-1 rounded-full bg-[var(--color-bg-subtle)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border)] text-xs text-[var(--color-text-main)] font-medium transition-all whitespace-nowrap active:scale-95 disabled:opacity-50"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhắn tin với LetGoo AI: 'Ăn tối ở đâu ngon?', 'Lên lịch 1 ngày...' "
              disabled={loading}
              className="w-full bg-[var(--color-bg-subtle)] text-[var(--color-text-main)] text-sm px-4 py-3 rounded-2xl border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/20 transition-all placeholder:text-[var(--color-text-muted)]/70"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-md shadow-[#FF6B4A]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

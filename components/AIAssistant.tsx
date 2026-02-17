
import React, { useState, useEffect, useRef } from 'react';
import { chatWithAssistant, processVoiceOrder } from '../services/geminiService';

interface AIAssistantProps {
  onOrderCommand: (item: string, qty: number) => void;
  cart: any[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onOrderCommand, cart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hello! I'm OLIF, your premium dining assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithAssistant(text, { cart });
      setMessages(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice features not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setMessages(prev => [...prev, { role: 'user', text: `[Voice] ${transcript}` }]);
      
      setLoading(true);
      const voiceResult = await processVoiceOrder(transcript);
      if (voiceResult.isOrder) {
        onOrderCommand(voiceResult.item, voiceResult.quantity);
        setMessages(prev => [...prev, { role: 'ai', text: `Understood. I've added ${voiceResult.quantity}x ${voiceResult.item} to your basket.` }]);
      } else {
        const aiResponse = await chatWithAssistant(transcript, { cart });
        setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "I heard you, but I'm not sure what you need." }]);
      }
      setLoading(false);
    };

    recognition.onerror = () => setIsListening(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 transform animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-[#064E3B] text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-xs font-bold">O</div>
              <div>
                <p className="font-bold text-sm">OLIF AI Assistant</p>
                <p className="text-[10px] opacity-70">Always at your service</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70">
              <i className="fa-solid fa-minus"></i>
            </button>
          </div>

          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-[#064E3B] text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Type or use voice..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
              className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-[#064E3B]"
            />
            <button 
              onClick={startVoice}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-[#064E3B] hover:bg-gray-200'
              }`}
            >
              <i className="fa-solid fa-microphone"></i>
            </button>
            <button 
              onClick={() => handleSendMessage(input)}
              className="w-10 h-10 bg-[#064E3B] text-white rounded-xl flex items-center justify-center hover:bg-[#065F46]"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#064E3B] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform relative group"
        >
          <div className="absolute -top-12 right-0 bg-white text-slate-800 text-xs py-2 px-4 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Need help ordering? 🍲
          </div>
          <i className="fa-solid fa-comment-dots text-2xl"></i>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full border-2 border-[#064E3B]"></span>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;

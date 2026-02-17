
import React, { useState, useEffect, useRef } from 'react';
import { chatWithAssistant, processVoiceOrder } from '../services/geminiService';

interface AIAssistantProps {
  onOrderCommand: (item: string, qty: number) => void;
  onCheckout: () => void;
  cart: any[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onOrderCommand, onCheckout, cart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hello! I'm TRE, your premium dining assistant. How can I help you today?" }
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
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice features not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setMessages(prev => [...prev, { role: 'user', text: transcript }]);
      
      setLoading(true);
      try {
        const result = await processVoiceOrder(transcript);
        
        if (result.isOrder && result.orders && result.orders.length > 0) {
          let summary = "Certainly. I've added ";
          result.orders.forEach((order: {item: string, quantity: number}, index: number) => {
            onOrderCommand(order.item, order.quantity);
            summary += `${order.quantity}x ${order.item}${index === result.orders.length - 1 ? "" : ", "}`;
          });
          summary += " to your basket.";
          setMessages(prev => [...prev, { role: 'ai', text: summary }]);
        }

        if (result.isCheckoutIntent) {
          if (cart.length === 0 && (!result.orders || result.orders.length === 0)) {
            setMessages(prev => [...prev, { role: 'ai', text: "Your basket is currently empty. Would you like to add some of our signature Nigerian dishes first?" }]);
          } else {
            setMessages(prev => [...prev, { role: 'ai', text: "Excellent choice. I'm processing your order and taking you to checkout now." }]);
            setTimeout(() => {
              onCheckout();
              setIsOpen(false);
            }, 1500);
          }
        } else if (!result.isOrder) {
          // General chat if no order/checkout was detected
          const aiResponse = await chatWithAssistant(transcript, { cart });
          setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "I heard you, but I'm not sure how to help." }]);
        }
      } catch (err) {
        console.error("Voice processing error:", err);
        setMessages(prev => [...prev, { role: 'ai', text: "I had a bit of trouble processing that. Could you please repeat it?" }]);
      } finally {
        setLoading(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-80 md:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 transform animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-[#064E3B] text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-xs font-bold text-slate-900">T</div>
              <div>
                <p className="font-bold text-sm">TRE AI Assistant</p>
                <p className="text-[10px] opacity-70">Always at your service</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70 p-2">
              <i className="fa-solid fa-minus"></i>
            </button>
          </div>

          <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-[#064E3B] text-white rounded-tr-none shadow-md shadow-emerald-900/10' 
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
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Try: 'Add 2 Jollof and checkout'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
              className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-[#064E3B]"
            />
            <button 
              onClick={startVoice}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-[#064E3B] hover:bg-gray-200'
              }`}
              title="Voice Ordering"
            >
              <i className="fa-solid fa-microphone"></i>
            </button>
            <button 
              onClick={() => handleSendMessage(input)}
              className="w-10 h-10 bg-[#064E3B] text-white rounded-xl flex items-center justify-center hover:bg-[#065F46] shadow-lg shadow-emerald-900/20"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#064E3B] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform relative group"
        >
          <div className="absolute -top-12 right-0 bg-white text-slate-800 text-xs py-2 px-4 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
            Order by voice? 🎙️
          </div>
          <i className="fa-solid fa-comment-dots text-2xl"></i>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full border-2 border-[#064E3B]"></span>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;

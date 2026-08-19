'use client';

import React, { useState } from 'react';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'أهلاً بك في Kemet AI! معك المساعد الذكي، كيف يمكنني مساعدتك في رحلتك بمصر اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'model', text: data.reply || 'عذراً، لماردي استجابة من المساعد.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'عذراً، حدث خطأ في الاتصال. حاول مرة أخرى.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50" dir="rtl">
      {/* زر فتح الشات العائم (يمين) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white p-4 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-all cursor-pointer font-black text-xl flex items-center justify-center w-16 h-16"
          title="تحدث مع Kemet AI"
        >
          💬
        </button>
      )}

      {/* نافذة المحادثة */}
      {isOpen && (
        <div className="w-80 md:w-96 bg-white rounded-2xl border-4 border-black shadow-[15px_15px_0px_0px_rgba(220,38,38,1)] flex flex-col h-[500px] overflow-hidden animate-in fade-in zoom-in duration-200 text-right">
          
          {/* هيدر الشات */}
          <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
            <h3 className="font-black text-lg flex items-center gap-2">
              🤖 Kemet AI Assistant
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-500 font-black text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* صندوق الرسائل */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-xl font-medium text-sm max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-black text-white mr-auto rounded-br-none' 
                    : 'bg-white text-black border-2 border-black ml-auto rounded-bl-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-gray-500 animate-pulse ml-auto p-2 font-bold">
                جاري التفكير والبحث...
              </div>
            )}
          </div>

          {/* صندوق الكتابة */}
          <form onSubmit={sendMessage} className="p-3 bg-black border-t-4 border-black flex gap-2">
            <button
              type="submit"
              className="bg-red-600 text-white font-black px-4 py-2 rounded-lg border-2 border-black hover:bg-red-700 cursor-pointer text-sm"
            >
              إرسال
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="اكتب رسالتك أو ميزانيتك..."
              className="flex-1 bg-white text-black border-2 border-black p-2 rounded-lg font-bold text-sm outline-none text-right"
            />
          </form>

        </div>
      )}
    </div>
  );
}
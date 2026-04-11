import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function SupportChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch messages from backend
  useEffect(() => {
    let interval;
    const fetchMessages = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/support/messages');
        setMessages(res.data.length ? res.data : [{ from: 'bot', text: 'Hi! How can we help you today?' }]);
      } catch {
        setMessages([{ from: 'bot', text: 'Hi! How can we help you today?' }]);
        setError('Could not load messages.');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setError('');
    try {
      await api.post('/support/messages', { text: input });
      setInput('');
      // Optimistically add user message
      setMessages((msgs) => [...msgs, { from: 'user', text: input }]);
    } catch {
      setError('Failed to send message.');
    }
  };

  return (
    <section className="fixed bottom-4 right-4 z-50 w-80 max-w-full">
      <div className="bg-[#111827] border border-[#19e68c] rounded-2xl shadow-xl p-4">
        <h3 className="text-lg font-bold text-[#19e68c] mb-2">Support Chat</h3>
        <div className="h-40 overflow-y-auto flex flex-col gap-2 mb-2">
          {loading ? (
            <div className="text-[#19e68c]">Loading...</div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`text-sm px-3 py-2 rounded-xl max-w-[80%] ${msg.from === 'bot' ? 'bg-[#222c37] text-[#19e68c] self-start' : 'bg-[#19e68c] text-black self-end'}`}>{msg.text}</div>
            ))
          )}
        </div>
        {error && <div className="text-red-400 text-xs mb-2">{error}</div>}
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-xl border border-[#19e68c] bg-[#222c37] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#19e68c]"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            aria-label="Type your support message"
          />
          <button type="submit" className="bg-[#19e68c] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#16a34a] transition-colors">Send</button>
        </form>
      </div>
    </section>
  );
}

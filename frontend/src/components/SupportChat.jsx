
import { useState, useRef, useEffect } from 'react';
import { askVini } from '../utils/viniApi';


export default function ViniChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm VINI. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg, { from: 'bot', text: 'VINI is typing...' }]);
    const userInput = input;
    setInput('');
    try {
      const reply = await askVini(userInput);
      setMessages(msgs => [
        ...msgs.slice(0, -1),
        { from: 'bot', text: reply }
      ]);
    } catch {
      setMessages(msgs => [
        ...msgs.slice(0, -1),
        { from: 'bot', text: 'Sorry, VINI is offline.' }
      ]);
    }
  };

  return (
    <>
      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/7836887228"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 focus:outline-none transition-all duration-300 group"
        style={{
          borderRadius: '50%',
          width: 64,
          height: 64,
          background: 'linear-gradient(145deg, #25d366 60%, #128c7e 100%)',
          boxShadow: '0 8px 24px 0 #128c7e55, 0 2px 8px 0 #fff8 inset',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'perspective(180px) rotateX(8deg)',
          border: '3px solid #fff',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        aria-label="Chat on WhatsApp"
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.08) perspective(180px) rotateX(0deg)';
          e.currentTarget.style.boxShadow = '0 12px 32px 0 #128c7e88, 0 2px 8px 0 #fff8 inset';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'perspective(180px) rotateX(8deg)';
          e.currentTarget.style.boxShadow = '0 8px 24px 0 #128c7e55, 0 2px 8px 0 #fff8 inset';
        }}
      >
        {/* WhatsApp SVG Icon with 3D effect */}
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 2px 6px #128c7e88)' }}>
          <circle cx="19" cy="19" r="19" fill="#25D366"/>
          <path d="M28.1 23.1c-.42-.21-2.48-1.22-2.87-1.36-.39-.14-.67-.21-.95.21-.28.42-1.09 1.36-1.34 1.64-.25.28-.49.31-.91.1-.42-.21-1.79-.66-3.41-2.1-1.26-1.13-2.11-2.53-2.36-2.95-.25-.42-.03-.66.18-.88.18-.18.42-.49.63-.73.21-.25.28-.42.42-.7.14-.28.07-.52-.04-.73-.1-.21-.95-2.26-1.3-3.1-.34-.81-.69-.7-.95-.71-.25-.01-.52-.01-.8-.01-.28 0-.73.1-1.11.52-.38.42-1.46 1.43-1.46 3.48 0 2.05 1.49 4.03 1.7 4.31.21.28 2.94 4.5 7.13 5.78.998.287 1.77.46 2.38.59.999.214 1.91.183 2.63.112.8-.08 2.46-1.01 2.81-1.99.35-.98.35-1.82.25-1.99-.1-.17-.39-.28-.8-.49z" fill="#fff"/>
        </svg>
      </a>
      {open && (
        <section className="fixed bottom-6 right-6 z-50 w-80 max-w-full">
          <div className="bg-[#111827] border border-[#19e68c] rounded-2xl shadow-xl p-4 relative">
            <button
              className="absolute top-2 right-2 text-[#19e68c] text-xl font-bold hover:text-red-400"
              aria-label="Close VINI chatbot"
              onClick={() => setOpen(false)}
            >×</button>
            <h3 className="text-lg font-bold text-[#19e68c] mb-2">VINI Chatbot</h3>
            <div className="h-40 overflow-y-auto flex flex-col gap-2 mb-2 pr-1">
              {messages.map((msg, i) => (
                <div key={i} className={`text-sm px-3 py-2 rounded-xl max-w-[80%] ${msg.from === 'bot' ? 'bg-[#222c37] text-[#19e68c] self-start' : 'bg-[#19e68c] text-black self-end'}`}>{msg.text}</div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} className="flex gap-2 mt-2">
              <input
                className="flex-1 px-3 py-2 rounded-xl border border-[#19e68c] bg-[#222c37] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#19e68c]"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                aria-label="Type your message"
                autoFocus
              />
              <button type="submit" className="bg-[#19e68c] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#16a34a] transition-colors">Send</button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

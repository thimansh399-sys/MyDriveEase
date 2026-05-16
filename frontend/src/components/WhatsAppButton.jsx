import { MessageCircle } from 'lucide-react';

const PHONE = '917007515654';
const MESSAGE = encodeURIComponent('Hi DriveEase, I need help with driver booking.');

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with DriveEase on WhatsApp"
      className="fixed bottom-[92px] right-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_rgba(0,0,0,0.35)] transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300/40 sm:bottom-6 sm:right-6"
    >
      <MessageCircle size={28} strokeWidth={2.5} />
    </a>
  );
}

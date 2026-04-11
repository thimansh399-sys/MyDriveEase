import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await api.get('/reviews/testimonials');
        setTestimonials(res.data);
      } catch {
        setTestimonials([
          { name: 'Amit S.', avatar: '', rating: 5, text: 'DriveEase made my commute stress-free. Highly recommended!' },
          { name: 'Priya R.', avatar: '', rating: 4, text: 'Professional drivers and easy booking process.' },
          { name: 'Rahul K.', avatar: '', rating: 5, text: 'Best experience! The dark mode is awesome.' },
        ]);
      }
    }
    fetchTestimonials();
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto mt-20 px-4 md:px-0">
      <h2 className="text-3xl font-extrabold text-center text-white mb-8">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-[#111827] border border-[#19e68c] rounded-2xl p-6 shadow-xl flex flex-col items-center">
            <img
              src={t.avatar || '/default-avatar.png'}
              alt={t.name}
              className="w-16 h-16 rounded-full border-2 border-[#19e68c] object-cover mb-3"
              onError={e => (e.target.src = '/default-avatar.png')}
            />
            <div className="flex gap-1 mb-2">
              {Array.from({ length: t.rating }).map((_, j) => (
                <span key={j} className="text-yellow-400 text-lg">★</span>
              ))}
            </div>
            <p className="text-[#19e68c] text-center mb-2">"{t.text}"</p>
            <span className="text-white font-bold">{t.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

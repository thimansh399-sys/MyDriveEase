import { ArrowLeft, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function PageQuickNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  return (
    <div className="fixed left-4 top-1/2 z-40 flex -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-slate-700/80 bg-slate-950/90 text-white shadow-2xl shadow-black/30 backdrop-blur">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex h-11 w-12 items-center justify-center border-b border-slate-700/80 text-sm font-extrabold hover:bg-slate-800 sm:w-24 sm:gap-2"
        aria-label="Go back"
        title="Back"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Back</span>
      </button>
      <button
        type="button"
        onClick={() => navigate('/')}
        disabled={isHome}
        className="inline-flex h-11 w-12 items-center justify-center text-sm font-extrabold hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-24 sm:gap-2"
        aria-label="Go home"
        title="Home"
      >
        <Home size={18} />
        <span className="hidden sm:inline">Home</span>
      </button>
    </div>
  );
}

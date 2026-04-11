import { useDarkMode } from '../hooks/useDarkMode';

export default function DarkModeToggle() {
  const [theme, toggleTheme] = useDarkMode();
  return (
    <button
      onClick={toggleTheme}
      className="ml-2 px-4 py-2 rounded-lg text-sm font-bold border border-primary text-primary bg-transparent hover:bg-primary hover:text-white transition-colors"
      aria-label="Toggle dark/light mode"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

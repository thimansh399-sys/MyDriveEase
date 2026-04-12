// Simple proxy to your AI backend (e.g., OpenAI, Azure, Google)
// This example expects a backend endpoint at /api/vini-chat

export async function askVini(message) {
  const base = import.meta.env.VITE_API_URL || '';
  const res = await fetch(`${base}/api/vini-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('AI backend error');
  const data = await res.json();
  return data.reply;
}

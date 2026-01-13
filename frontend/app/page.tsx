'use client';
import { useState, useRef, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import ThoughtTrace from './components/ThoughtTrace';

export default function Home() {
  const { messages, sendMessage, loading, thoughts } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="container">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, backgroundImage: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          Research Agent
        </h1>
        <p style={{ color: '#94a3b8' }}>Coding Challenge</p>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingBottom: '2rem' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
            {msg.content}
          </div>
        ))}

        {loading && <ThoughtTrace thoughts={thoughts} isLoading={loading} />}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ position: 'sticky', bottom: 0, background: 'var(--background)', padding: '1rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me a question..."
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </main>
  );
}

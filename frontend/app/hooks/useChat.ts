import { useState, useCallback } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Thought = {
  status: 'tool_start' | 'tool_end';
  tool: string;
  result?: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    setLoading(true);
    setThoughts([]);

    // Add user message + placeholder assistant message immediately
    setMessages(prev => [
      ...prev,
      { role: 'user', content: text },
      { role: 'assistant', content: '' },
    ]);

    let assistantContent = '';

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (let line of lines) {
          line = line.replace(/\r$/, '');
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            if (event.type === 'thought') {
              setThoughts(prev => [
                ...prev,
                { status: event.status, tool: event.tool, result: event.result },
              ]);
              continue;
            }

            if (event.type === 'answer') {
              assistantContent += event.text ?? '';

              // Update the last assistant message content
              setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                const last = updated[lastIdx];

                if (last?.role === 'assistant') {
                  updated[lastIdx] = { ...last, content: assistantContent };
                }
                return updated;
              });
            }
          } catch (e) {
            console.error('Failed to parse event:', jsonStr, e);
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        const last = updated[lastIdx];
        if (last?.role === 'assistant') {
          updated[lastIdx] = { ...last, content: 'Sorry, something went wrong.' };
        } else {
          updated.push({ role: 'assistant', content: 'Sorry, something went wrong.' });
        }
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { messages, sendMessage, loading, thoughts };
}

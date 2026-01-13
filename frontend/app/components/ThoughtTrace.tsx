'use client';
import { useEffect, useState } from 'react';

type Thought = {
  status: 'tool_start' | 'tool_end';
  tool: string;
  result?: string;
};

type ThoughtProps = {
  thoughts: Thought[];
  isLoading: boolean;
};

export default function ThoughtTrace({ thoughts, isLoading }: ThoughtProps) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Trigger re-render to restart animation on new thoughts
    if (thoughts.length > 0) {
      setAnimationKey(prev => prev + 1);
    }
  }, [thoughts.length]);

  if (thoughts.length === 0 && !isLoading) {
    return null;
  }

  const latestThought = thoughts[thoughts.length - 1];
  const isSearching = latestThought?.status === 'tool_start';

  return (
    <div className="thought-trace" style={{
      padding: '1rem',
      backgroundColor: '#1e293b',
      borderRadius: '0.5rem',
      borderLeft: '3px solid #60a5fa',
      marginLeft: '1rem',
      color: '#e2e8f0',
      fontSize: '0.9rem',
      animation: isLoading ? 'fadeIn 0.3s ease-in' : 'none',
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .thinking-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #60a5fa;
          animation: pulse 1.5s infinite;
          margin-left: 0.5rem;
        }
      `}</style>

      {isSearching && latestThought?.tool && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>🔍 Searching with {latestThought.tool}...</span>
          <span className="thinking-dot" key={animationKey}></span>
        </div>
      )}

      {latestThought?.status === 'tool_end' && latestThought?.result && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <span>✓ Found results from {latestThought.tool}</span>
        </div>
      )}

      {isLoading && !latestThought && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>🤔 Thinking...</span>
          <span className="thinking-dot" key={animationKey}></span>
        </div>
      )}

      {/* Show previous tool calls */}
      {thoughts.length > 1 && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          {thoughts.slice(0, -1).map((thought, idx) => (
            <div key={idx}>
              {thought.status === 'tool_end' && `✓ Completed: ${thought.tool}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

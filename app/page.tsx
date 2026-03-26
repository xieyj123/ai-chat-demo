'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, error,stop } = useChat();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-200 text-gray-800'
            } max-w-[80%]`}
          >
            {message.parts.map((part, index) => {
              if (part.type === 'reasoning') {
                return <pre key={index}>{part.text}</pre>;
              }
              if (part.type === 'text') {
                return <span key={index}>{part.text}</span>;
              }
              return null;
            })}
          </div>
        ))}
        {/* {isLoading && <div className="text-gray-400">AI正在思考...</div>} */}
        {error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-800 max-w-[80%]">
            <strong>错误信息:</strong> {error.message || '发生了未知错误'}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="prompt"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="问点啥？"
          className="flex-1 p-2 border rounded-lg"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          发送
        </button>
        <button type="button" className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={stop}>
          停止
        </button>
      </form>
    </div>
  );
}
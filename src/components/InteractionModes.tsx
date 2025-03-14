import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Monitor } from 'lucide-react';

interface InteractionModesProps {
  onModeChange: (mode: string) => void;
  onCommand: (command: string) => void;
}

export function InteractionModes({ onModeChange, onCommand }: InteractionModesProps) {
  const [mode, setMode] = useState<string>('gui');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState<string[]>([
    'Welcome to FastAPI Load Tester CLI!',
    'Type "help" for available commands.',
    ''
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Override console.log to capture output
  useEffect(() => {
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      originalConsoleLog.apply(console, args);
      setOutput(prev => [...prev, args.join(' '), '']);
    };
    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    onModeChange(newMode);
    if (newMode === 'cli') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleCommand = (command: string) => {
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setOutput(prev => [...prev, `$ ${command}`, '']);
    onCommand(command);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = e.currentTarget.value.trim();
      if (command) {
        handleCommand(command);
        e.currentTarget.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        e.currentTarget.value = commandHistory[commandHistory.length - 1 - newIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        e.currentTarget.value = commandHistory[commandHistory.length - 1 - newIndex];
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        e.currentTarget.value = '';
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3">
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => handleModeChange('gui')}
            className={`p-2.5 rounded-xl transition-all ${
              mode === 'gui' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="GUI Mode"
          >
            <Monitor size={22} />
          </button>
          <button
            onClick={() => handleModeChange('cli')}
            className={`p-2.5 rounded-xl transition-all ${
              mode === 'cli' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Command Line Mode"
          >
            <Terminal size={22} />
          </button>
        </div>
      </div>
      {mode === 'cli' && (
        <div className="bg-gray-900 text-gray-100 rounded-xl shadow-xl border border-gray-800 w-[32rem] transition-all">
          <div className="flex items-center px-4 py-2 border-b border-gray-800 bg-gray-800/50">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-sm text-gray-400 font-medium">FastAPI Load Tester CLI</span>
            </div>
          </div>
          <div 
            ref={terminalRef}
            className="p-4 h-80 overflow-y-auto font-mono text-sm leading-relaxed"
            style={{ scrollbarWidth: 'thin' }}
          >
            {output.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">{line}</div>
            ))}
            <div className="flex items-center">
              <span className="text-green-400 mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent outline-none"
                placeholder="Type a command..."
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
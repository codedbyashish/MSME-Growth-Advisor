import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  RefreshCw,
  Send,
  ExternalLink,
} from 'lucide-react';
import { sendAdvisorChatApi } from '../services/dataApi';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

/**
 * Format chatbot messages with bold text, bullets, headings and tables.
 */
function FormattedChatMessage({ text, onNavigate }) {
  if (!text) return null;

  const renderInline = (str) => {
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-[#202B3C]">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (
        part.startsWith('*') &&
        part.endsWith('*') &&
        part.length > 2
      ) {
        return (
          <em key={index} className="italic">
            {part.slice(1, -1)}
          </em>
        );
      }

      return part;
    });
  };

  const lines = text.split('\n');
  const blocks = [];
  let table = null;
  let textLines = [];

  const flushText = () => {
    if (textLines.length) {
      blocks.push({
        type: 'text',
        content: textLines.join('\n'),
      });
      textLines = [];
    }
  };

  const flushTable = () => {
    if (table) {
      blocks.push({ type: 'table', ...table });
      table = null;
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (line.startsWith('|') && line.endsWith('|')) {
      flushText();

      const cells = line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim().replace(/^\*\*|\*\*$/g, ''));

      if (!table) {
        table = { headers: cells, rows: [] };
      } else if (cells.every((cell) => /^:?-+:?$/.test(cell))) {
        // Ignore Markdown table separator rows.
      } else {
        table.rows.push(cells);
      }
    } else {
      flushTable();
      textLines.push(rawLine);
    }
  });

  flushText();
  flushTable();

  return (
    <div className="space-y-2.5 text-xs sm:text-[13px] leading-relaxed">
      {blocks.map((block, blockIndex) => {
        if (block.type === 'table') {
          return (
            <div
              key={blockIndex}
              className="my-2.5 overflow-x-auto rounded-lg border border-[#E7E3DC] bg-white shadow-sm"
            >
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E7E3DC] bg-[#FAF9F6]">
                    {block.headers.map((header, index) => (
                      <th
                        key={index}
                        className="whitespace-nowrap px-3 py-2 font-semibold text-[#5C5446]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0EDE6]">
                  {block.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="transition-colors hover:bg-[#FAF9F6]"
                    >
                      {row.map((cell, cellIndex) => {
                        const header = (
                          block.headers[cellIndex] || ''
                        ).toLowerCase();

                        const cleanCell = cell
                          .replace(/[🔴🟡🟢✅]/gu, '')
                          .trim();

                        const isInvoice =
                          header.includes('invoice') ||
                          /^[A-Z0-9]+-INV-\d+/i.test(cell);

                        const isCustomer =
                          header.includes('customer') ||
                          header.includes('client');

                        const isStatus = header.includes('status');

                        const isNumeric =
                          cell.includes('₹') ||
                          header.includes('amount') ||
                          header.includes('outstanding') ||
                          header.includes('revenue') ||
                          header.includes('orders') ||
                          header.includes('bill') ||
                          header.includes('invoices');

                        return (
                          <td
                            key={cellIndex}
                            className={`whitespace-nowrap px-3 py-2 text-xs ${
                              isNumeric && !isInvoice
                                ? 'text-right font-medium text-[#202B3C]'
                                : 'text-[#3E382F]'
                            }`}
                          >
                            {isInvoice && cell !== '—' ? (
                              <button
                                type="button"
                                onClick={() =>
                                  onNavigate?.({
                                    tab: 'orders',
                                    search: cleanCell,
                                  })
                                }
                                className="inline-flex items-center gap-1 font-mono font-medium text-[#0B1F3A] hover:underline"
                                title={`Filter orders for invoice ${cleanCell}`}
                              >
                                {cleanCell}
                                <ExternalLink className="h-2.5 w-2.5" />
                              </button>
                            ) : isCustomer && cell !== '—' ? (
                              <button
                                type="button"
                                onClick={() =>
                                  onNavigate?.({
                                    tab: 'orders',
                                    search: cleanCell,
                                  })
                                }
                                className="text-left font-semibold text-[#202B3C] hover:underline"
                              >
                                {cleanCell}
                              </button>
                            ) : isStatus ? (
                              <span className="inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold">
                                {cell}
                              </span>
                            ) : (
                              renderInline(cell)
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <div key={blockIndex} className="space-y-1">
            {block.content.split('\n').map((line, lineIndex) => {
              const trimmed = line.trim();

              if (!trimmed) {
                return <div key={lineIndex} className="h-1" />;
              }

              if (trimmed.startsWith('### ')) {
                return (
                  <h4
                    key={lineIndex}
                    className="pt-2 text-xs font-semibold uppercase tracking-wider text-[#202B3C]"
                  >
                    {trimmed.slice(4)}
                  </h4>
                );
              }

              if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
                return (
                  <div
                    key={lineIndex}
                    className="flex items-start gap-1.5 text-[#3E382F]"
                  >
                    <span className="text-[#737D8B]">•</span>
                    <span className="flex-1">
                      {renderInline(trimmed.slice(2))}
                    </span>
                  </div>
                );
              }

              return (
                <p key={lineIndex} className="text-[#3E382F]">
                  {renderInline(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Floating Growth Advisor chatbot.
 * Navy-blue floating button, fixed bottom-right on mobile and desktop.
 */
export default function FloatingAdvisorChat({
  onNavigate,
  businessName: customBusinessName,
}) {
  const { user } = useAuth();
  const { isAiChatOpen, setIsAiChatOpen } = useData();

  const businessName =
    customBusinessName ||
    user?.businessName ||
    user?.name ||
    user?.fullName ||
    user?.email?.split('@')[0] ||
    'Your Business';

  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: `**Hello! I am your Growth Advisor BI Assistant for ${businessName}.**\n\nI answer your questions using data from your database, including invoices, collections, operating expenses, and inventory.\n\nClick a suggested topic below or type your question.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAiChatOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isAiChatOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isAiChatOpen) {
        setIsAiChatOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAiChatOpen, setIsAiChatOpen]);

  useEffect(() => {
    if (isAiChatOpen) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [isAiChatOpen]);

  const send = async (text) => {
    const question = (text ?? input).trim();

    if (!question || isLoading) return;

    const timestamp = () =>
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

    setMessages((previous) => [
      ...previous,
      {
        from: 'user',
        text: question,
        timestamp: timestamp(),
      },
    ]);

    setInput('');
    setIsLoading(true);

    try {
      const response = await sendAdvisorChatApi(question);

      setMessages((previous) => [
        ...previous,
        {
          from: 'ai',
          text: response.reply || 'No information found.',
          tableData: response.tableData,
          intent: response.intent,
          citations: response.citations,
          timestamp: timestamp(),
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          from: 'ai',
          isError: true,
          text: `⚠️ **Unable to fetch data:** ${
            error?.response?.data?.message ||
            error?.message ||
            'Server error. Please verify your connection.'
          }`,
          timestamp: timestamp(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        from: 'ai',
        text: `**Conversation reset.** How can I assist ${businessName} today?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  };

  const suggestedQuestions = [
    'Unpaid invoices',
    'Who owes me the most?',
    'Revenue summary',
    'Profit margin',
    'Top selling sweets',
    'Low stock alerts',
    'Recent payments',
  ];

  return (
    <>
      {/* Chat window */}
      {isAiChatOpen && (
        <div
          id="msme-growth-advisor-chat"
          role="dialog"
          aria-label="Growth Advisor Assistant Chat"
          aria-modal="false"
          className="
            fixed z-40 flex flex-col overflow-hidden
            rounded-2xl border border-[#E7E3DC] bg-white shadow-2xl
            right-3 sm:right-5
            bottom-[calc(80px+env(safe-area-inset-bottom,0px))]
            sm:bottom-[88px]
            w-[calc(100vw-24px)] max-w-[400px] sm:w-[380px]
            h-[min(70dvh,580px)] sm:h-[580px]
            max-h-[min(70dvh,600px)]
            animate-in fade-in slide-in-from-bottom-4
          "
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#2C3B52] bg-[#0B1F3A] px-3.5 py-2.5 text-white sm:px-4 sm:py-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white">
                <Bot className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs font-semibold tracking-tight sm:text-sm">
                    Growth Advisor
                  </span>

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-200">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Live DB
                  </span>
                </div>

                <p className="max-w-[170px] truncate text-[10px] text-white/60 sm:max-w-[210px] sm:text-[11px]">
                  {businessName} Intelligence Assistant
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Reset conversation"
                aria-label="Clear chat"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <RefreshCw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsAiChatOpen(false)}
                title="Close chat"
                aria-label="Close chat"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#FAF9F6] p-3.5 sm:p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  message.from === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[92%] rounded-xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    message.from === 'user'
                      ? 'bg-[#0B1F3A] text-white'
                      : message.isError
                        ? 'border border-red-200 bg-red-50 text-red-800'
                        : 'border border-[#E7E3DC] bg-white text-[#202B3C]'
                  }`}
                >
                  {message.from === 'user' ? (
                    <p className="text-xs sm:text-[13px]">
                      {message.text}
                    </p>
                  ) : (
                    <FormattedChatMessage
                      text={message.text}
                      onNavigate={onNavigate}
                    />
                  )}
                </div>

                {message.timestamp && (
                  <span className="mt-1 px-1 text-[10px] text-[#737D8B]">
                    {message.timestamp}
                  </span>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex max-w-[85%] items-center gap-2 rounded-xl border border-[#E7E3DC] bg-white px-3.5 py-2.5 text-xs text-[#737D8B]">
                <Bot className="h-3.5 w-3.5 animate-pulse text-[#0B1F3A]" />
                <span>Consulting database records...</span>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Suggested questions */}
          <div className="shrink-0 border-t border-[#E7E3DC] bg-white px-3 py-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  disabled={isLoading}
                  onClick={() => send(question)}
                  className="
                    min-h-[36px] shrink-0 rounded-full
                    border border-[#E7E3DC] bg-[#FAF9F6]
                    px-3 py-1.5 text-xs font-medium text-[#0B1F3A]
                    transition-all hover:border-[#0B1F3A]
                    hover:bg-[#EEF2F7] active:scale-95
                    disabled:opacity-50
                  "
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="flex shrink-0 items-center gap-2 border-t border-[#E7E3DC] bg-white p-2.5 sm:p-3"
          >
            <input
              ref={inputRef}
              value={input}
              disabled={isLoading}
              onChange={(event) => setInput(event.target.value)}
              onFocus={() => {
                setTimeout(() => {
                  endRef.current?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }, 250);
              }}
              placeholder="Ask about sales, unpaid bills, profit..."
              className="
                w-full rounded-lg border border-[#E7E3DC]
                bg-[#FAF9F6] px-3.5 py-2.5
                text-xs text-[#202B3C] placeholder-[#9AA2AD]
                transition-all focus:border-[#0B1F3A]
                focus:bg-white focus:outline-none
                focus:ring-2 focus:ring-[#0B1F3A]/20
                disabled:opacity-60 sm:text-sm
              "
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="
                flex h-11 w-11 min-h-[44px] min-w-[44px]
                shrink-0 items-center justify-center rounded-lg
                bg-[#0B1F3A] text-white transition-colors
                hover:bg-[#15345B] disabled:opacity-40
              "
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Navy-blue floating chatbot button */}
      <button
        type="button"
        id="msme-floating-chat-button"
        onClick={() => setIsAiChatOpen((previous) => !previous)}
        aria-label={
          isAiChatOpen ? 'Close AI assistant' : 'Open AI assistant'
        }
        aria-expanded={isAiChatOpen}
        aria-controls="msme-growth-advisor-chat"
        style={{
          position: 'fixed',
          right: '16px',
          bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        }}
        className="
          group z-50 flex h-14 w-14 min-h-[44px] min-w-[44px]
          items-center justify-center rounded-full
          bg-[#0B1F3A] text-white
          shadow-xl shadow-[#0B1F3A]/30
          transition-all duration-200
          hover:scale-105 hover:bg-[#15345B]
          active:scale-95
          focus:outline-none focus:ring-4
          focus:ring-[#0B1F3A]/30 focus:ring-offset-2
          sm:h-[60px] sm:w-[60px]
        "
      >
        {isAiChatOpen ? (
          <X className="h-6 w-6 transition-transform duration-200 hover:rotate-90 sm:h-7 sm:w-7" />
        ) : (
          <span className="relative flex items-center justify-center">
            <Bot className="h-6 w-6 text-white transition-transform duration-200 group-hover:scale-110 sm:h-7 sm:w-7" />

            {/* Small live indicator */}
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#0B1F3A] bg-white" />
            </span>
          </span>
        )}
      </button>
    </>
  );
}

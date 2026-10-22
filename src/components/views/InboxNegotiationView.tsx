import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Message, Quotation } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CounterOfferModal } from '../modals/CounterOfferModal';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import {
  Send,
  MessageSquare,
  CheckCircle2,
  FileText,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const InboxNegotiationView: React.FC = () => {
  const {
    currentRole,
    conversations,
    messages,
    sendMessage,
    collaborations,
    acceptQuotation,
    rejectQuotation
  } = useApp();

  const [activeConvId, setActiveConvId] = useState<string>(
    conversations[0]?.id || 'conv-1'
  );
  const [inputText, setInputText] = useState('');
  const [selectedQuoteForCounter, setSelectedQuoteForCounter] = useState<Quotation | null>(null);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activeMessages: Message[] = (activeConv ? messages[activeConv.id] : []) || [];

  // Associated Collaboration if exists
  const activeCollab = collaborations.find(
    (collab) => collab.id === activeConv?.collaborationId
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText.trim(), 'text');
    setInputText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-[calc(100vh-140px)] min-h-[600px] flex flex-col md:flex-row">
        {/* Left Column: Conversations List */}
        <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/60 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" /> Inbox & Negotiations
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
              {conversations.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              const isCreator = currentRole === 'creator';
              const partnerName = isCreator ? conv.brandName : conv.creatorName;
              const partnerAvatar = isCreator ? conv.brandAvatar : conv.creatorAvatar;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-white border-l-2 border-purple-600 shadow-xs' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <img
                    src={partnerAvatar}
                    alt={partnerName}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{partnerName}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {formatRelativeTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    {conv.campaignTitle && (
                      <p className="text-[10px] text-purple-700 font-semibold truncate mb-1">
                        {conv.campaignTitle}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat View & Interactive Negotiation Card */}
        {activeConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            {/* Conversation Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <img
                  src={currentRole === 'creator' ? activeConv.brandAvatar : activeConv.creatorAvatar}
                  alt="Partner"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {currentRole === 'creator' ? activeConv.brandName : activeConv.creatorName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Topic: <span className="text-purple-700 font-medium">{activeConv.campaignTitle || 'Direct Collaboration'}</span>
                  </p>
                </div>
              </div>

              {activeCollab && (
                <div className="flex items-center gap-2">
                  <Badge variant="purple" size="sm">
                    Milestone: {activeCollab.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs font-bold text-slate-900 hidden sm:inline">
                    {formatCurrency(activeCollab.agreedAmount)}
                  </span>
                </div>
              )}
            </div>

            {/* Messages Stream */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50/40">
              {activeMessages.map((msg) => {
                const isMe =
                  (currentRole === 'creator' && msg.senderRole === 'creator') ||
                  (currentRole === 'brand' && msg.senderRole === 'brand');

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-2xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-200 mt-1"
                    />

                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                        <span className="text-xs font-bold text-slate-800">{msg.senderName}</span>
                        <span className="text-[10px] text-slate-400">
                          {formatRelativeTime(msg.timestamp)}
                        </span>
                      </div>

                      {/* Standard Text Bubble */}
                      {msg.type === 'text' && (
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-purple-600 text-white rounded-tr-none shadow-sm shadow-purple-600/10'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                          }`}
                        >
                          {msg.content}
                        </div>
                      )}

                      {/* Interactive Quotation Negotiation Card */}
                      {msg.type === 'quotation' && msg.quotationData && (
                        <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-4 max-w-md">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-600" />
                                <span className="text-xs font-bold text-slate-900">
                                  Official Commercial Quotation
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                Quote #{msg.quotationData.id.slice(-6).toUpperCase()}
                              </span>
                            </div>
                            <p className="text-lg font-extrabold text-slate-900">
                              {formatCurrency(msg.quotationData.amount)}
                            </p>
                          </div>

                          <div className="space-y-2 text-xs">
                            <p className="font-semibold text-slate-700">Deliverable Line Items:</p>
                            {msg.quotationData.deliverables.map((item) => (
                              <div
                                key={item.id}
                                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-700 text-[11px]"
                              >
                                <span>• {item.description} ({item.revisionsAllowed} revs)</span>
                                <span className="font-bold text-slate-900">{formatCurrency(item.price)}</span>
                              </div>
                            ))}
                          </div>

                          {msg.quotationData.notes && (
                            <p className="text-xs text-slate-500 italic bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                              Terms: "{msg.quotationData.notes}"
                            </p>
                          )}

                          {/* Negotiation Actions */}
                          {msg.quotationData.status === 'sent' && (
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => rejectQuotation(msg.quotationData!.id)}
                              >
                                Decline
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedQuoteForCounter(msg.quotationData!);
                                  setIsCounterModalOpen(true);
                                }}
                              >
                                <RefreshCw className="w-3.5 h-3.5" /> Counteroffer
                              </Button>
                              <Button
                                size="sm"
                                variant="gradient"
                                onClick={() => acceptQuotation(msg.quotationData!.id)}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Accept Terms
                              </Button>
                            </div>
                          )}

                          {msg.quotationData.status === 'accepted' && (
                            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" /> Terms Formally Accepted & Locked
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
              <input
                type="text"
                placeholder="Type your message, counteroffer terms, or link..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
              />
              <Button type="submit" variant="gradient" size="sm" disabled={!inputText.trim()}>
                <Send className="w-4 h-4" /> Send
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
            No active conversation selected
          </div>
        )}
      </div>

      <CounterOfferModal
        quotation={selectedQuoteForCounter}
        isOpen={isCounterModalOpen}
        onClose={() => setIsCounterModalOpen(false)}
      />
    </div>
  );
};

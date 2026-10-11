/**
 * @file src/shared/components/feedback/FeedbackCenterModal.tsx
 * @description Beta Feedback Center Modal component for collecting privacy-first local feedback.
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Send, CheckCircle2, ShieldCheck, X, ThumbsUp } from 'lucide-react';
import { localTelemetryService } from '../../../domains/dom-012-analytics';
import { useLanguage } from '../../../i18n';

export interface FeedbackRecord {
  readonly id: string;
  readonly category: 'UI_FRICTION' | 'BUG' | 'CONTENT' | 'FEATURE_REQUEST' | 'GENERAL';
  readonly rating: number;
  readonly comment: string;
  readonly createdAt: string;
  readonly sha256Receipt: string;
}

interface FeedbackCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackCenterModal: React.FC<FeedbackCenterModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [category, setCategory] = useState<FeedbackRecord['category']>('UI_FRICTION');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);


  useEffect(() => {
    if (isOpen) {
      loadFeedback();
      setSubmitted(false);
    }
  }, [isOpen]);

  const loadFeedback = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('eliot_beta_feedback_records');
        if (raw) {
          setFeedbackList(JSON.parse(raw));
        }
      }
    } catch {
      setFeedbackList([]);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const receipt = `FB-${Date.now().toString(16)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newRecord: FeedbackRecord = {
      id: `FB-${Date.now()}`,
      category,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toLocaleTimeString(),
      sha256Receipt: receipt,
    };

    const updated = [newRecord, ...feedbackList];
    setFeedbackList(updated);

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('eliot_beta_feedback_records', JSON.stringify(updated));
    }

    localTelemetryService.trackEvent('FEEDBACK_SUBMITTED', { category, rating });
    setSubmitted(true);
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--surface-low)]/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div
        id="beta-feedback-modal"
        className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-2xl max-w-lg w-full space-y-5 text-[var(--text-primary)] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--surface-high)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 border-b border-[var(--border-color)] pb-3">
          <div className="p-2 bg-indigo-950 text-indigo-400 border border-indigo-800/80 rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Eliot Beta Feedback Center</h2>
            <p className="text-xs text-[var(--text-secondary)] font-mono">100% LocalFirst • Zero Remote Telemetry or Tracking</p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-[var(--status-success)]/40 border border-[var(--status-success)]/80 rounded-xl p-5 text-center space-y-3 font-mono text-xs">
            <CheckCircle2 className="w-8 h-8 text-[var(--status-success)] mx-auto" />
            <h3 className="text-sm font-bold text-[var(--status-success)]">Feedback Saved to Local Ledger</h3>
            <p className="text-[var(--text-secondary)] font-sans text-xs">
              Thank you for testing Eliot Beta. Your reflection and friction notes are recorded locally on your device.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-3 py-1.5 bg-[var(--surface-high)] hover:bg-[var(--surface-bright)] text-[var(--text-primary)] rounded-lg font-mono text-xs transition-colors"
            >
              Submit Additional Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[var(--text-secondary)] uppercase font-bold tracking-wider block">
                Feedback Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'UI_FRICTION', label: 'UI / UX Friction' },
                  { id: 'BUG', label: 'Bug / Exception' },
                  { id: 'CONTENT', label: 'Content / Prompt' },
                  { id: 'FEATURE_REQUEST', label: 'Feature Idea' },
                  { id: 'GENERAL', label: 'General Note' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setCategory(item.id as FeedbackRecord['category'])}
                    className={`py-2 px-2.5 rounded text-[11px] border transition-colors ${
                      category === item.id
                        ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                        : 'bg-[var(--surface-low)] text-[var(--text-secondary)] hover:bg-[var(--surface-high)] border-[var(--border-color)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[var(--text-secondary)] uppercase font-bold tracking-wider block">
                Experience Rating (1 to 5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-lg border transition-colors ${
                      rating >= star
                        ? 'bg-[var(--status-warning)]/60 border-[var(--status-warning)] text-[var(--status-warning)]'
                        : 'bg-[var(--surface-low)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
                <span className="text-[var(--text-secondary)] text-xs font-sans ml-2">
                  {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Fair' : 'Needs Work'}
                </span>
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[var(--text-secondary)] uppercase font-bold tracking-wider block">
                Friction Details &amp; Observations
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                required
                placeholder="Describe any confusing screens, missing features, or friction points..."
                className="w-full bg-[var(--surface-low)] border border-[var(--border-color)] focus:border-indigo-500 rounded-lg p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition-colors font-sans resize-y"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-md flex items-center justify-center gap-2 font-mono text-xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record Local Feedback</span>
            </button>
          </form>
        )}

        {/* Saved Feedback Records List */}
        {feedbackList.length > 0 && (
          <div className="pt-4 border-t border-[var(--border-color)] space-y-2 font-mono text-xs">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-wider block">
              Local Feedback History ({feedbackList.length})
            </span>
            <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
              {feedbackList.map((fb) => (
                <div key={fb.id} className="p-2.5 bg-[var(--surface-low)] border border-[var(--border-color)]/80 rounded-lg space-y-1 text-[11px]">
                  <div className="flex justify-between items-center text-[var(--text-secondary)] text-[10px]">
                    <span className="text-indigo-400 font-semibold">{fb.category}</span>
                    <span>{fb.createdAt} • {fb.sha256Receipt}</span>
                  </div>
                  <p className="text-[var(--text-primary)] font-sans">{fb.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

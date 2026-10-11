/**
 * @file src/shared/components/learning/ActiveNotesView.tsx
 * @description Context-specific active notes panel attached only to the current lesson.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { LessonNoteItem } from '../../../domains/dom-001-learning';
import { Plus, Trash2, Clock, StickyNote } from 'lucide-react';
import { Card, Button } from '../ui';

interface ActiveNotesViewProps {
  notes: readonly LessonNoteItem[];
  onAddNote: (text: string) => void;
  onDeleteNote: (id: string) => void;
}

export const ActiveNotesView: React.FC<ActiveNotesViewProps> = ({ notes, onAddNote, onDeleteNote }) => {
  const [inputText, setInputText] = useState<string>('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAddNote(inputText);
      setInputText('');
    }
  };

  return (
    <Card id="active-notes-panel" variant="default" padding="md" className="space-y-4 shadow-sm font-ui-body">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-[var(--status-warning)]" />
          <h3 className="font-ui-body-bold text-sm font-bold text-[var(--text-primary)]">Active Notes</h3>
          <span className="text-[10px] font-mono-ui text-[var(--text-secondary)] bg-[var(--surface-low)] px-2 py-0.5 rounded border border-[var(--border-color)]">
            Current Lesson Only
          </span>
        </div>
        <span className="text-xs font-mono-ui text-[var(--text-secondary)]">{notes.length} saved</span>
      </div>

      {/* Note Input Form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Capture a lesson key takeaway or concept note..."
          className="flex-1 bg-[var(--surface-low)] border border-[var(--border-color)] focus:border-[var(--accent-signal)] rounded-[var(--mode-radius)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none transition-colors font-ui-body"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputText.trim()}
          className="font-mono-ui text-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5 me-1" />
          <span>Add</span>
        </Button>
      </form>

      {/* Note List */}
      <div className="space-y-2 max-h-48 overflow-y-auto pe-1">
        {notes.length === 0 ? (
          <p className="text-xs font-mono-ui text-[var(--text-tertiary)] italic py-2 text-center">
            No notes taken for this lesson yet. Type a note above.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] flex items-start justify-between gap-3 group hover:border-[var(--text-secondary)] transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {note.timestamp}
                </span>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed font-ui-body">{note.text}</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteNote(note.id)}
                className="text-[var(--text-tertiary)] hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

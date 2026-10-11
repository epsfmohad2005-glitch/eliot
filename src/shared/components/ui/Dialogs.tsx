/**
 * @file src/shared/components/ui/Dialogs.tsx
 * @description Foundation Component System — Modal, Dialog, Command Palette & Context Menu Primitives
 * @license Apache-2.0
 */

import React, { useEffect, useState } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`relative w-full bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] shadow-2xl p-6 overflow-hidden z-[var(--z-modal)] animate-scaleIn ${maxWidthStyles[maxWidth]} ${className}`}
      >
        {(title || description) && (
          <div className="mb-4 pr-6">
            {title && (
              <h3 id="modal-title" className="font-headline-md text-lg text-[var(--text-primary)] font-medium">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-[var(--text-secondary)] font-ui-body mt-1">
                {description}
              </p>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded hover:bg-[var(--surface-low)] transition-colors"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="my-2">{children}</div>
        {footer && <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface-low)] rounded-[var(--mode-radius)] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-[var(--mode-radius)] transition-colors ${
              isDestructive
                ? 'bg-[var(--status-error)] text-white hover:opacity-90'
                : 'bg-[var(--accent-signal)] text-[#0A0A0A] hover:opacity-90'
            }`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-xs text-[var(--text-secondary)] font-ui-body leading-relaxed">{message}</p>
    </Modal>
  );
};

export interface CommandItem {
  id: string;
  label: string;
  category?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    (cmd.category && cmd.category.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[var(--z-command-deck)] flex items-start justify-center pt-20 p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-200"
      />
      <div className="relative w-full max-w-lg bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] shadow-2xl overflow-hidden z-[var(--z-command-deck)] flex flex-col max-h-[70vh]">
        <div className="p-3 border-b border-[var(--border-color)] flex items-center gap-2">
          <svg className="w-4 h-4 text-[var(--accent-signal)] ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 font-ui-body text-sm py-1.5 px-2 focus:outline-none"
          />
        </div>
        <div className="overflow-y-auto p-2 flex flex-col gap-1 flex-1">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-xs text-[var(--text-secondary)] font-label-sm">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => {
                  cmd.onSelect();
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-2 text-xs text-[var(--text-primary)] hover:bg-[var(--surface-low)] rounded-[var(--mode-radius)] transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  {cmd.icon && <span className="text-[var(--accent-signal)]">{cmd.icon}</span>}
                  <div>
                    <div className="font-ui-body font-medium">{cmd.label}</div>
                    {cmd.category && (
                      <div className="text-[10px] text-[var(--text-secondary)] font-label-sm">{cmd.category}</div>
                    )}
                  </div>
                </div>
                {cmd.shortcut && (
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono-ui bg-[var(--surface-low)] text-[var(--text-secondary)] rounded border border-[var(--border-color)]">
                    {cmd.shortcut}
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

export interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  items: ContextMenuItem[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  x,
  y,
  onClose,
  items,
}) => {
  useEffect(() => {
    const handleClick = () => onClose();
    if (isOpen) window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{ top: y, left: x }}
      className="fixed z-[var(--z-dropdown)] w-48 bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] shadow-xl p-1 font-ui-body text-xs flex flex-col gap-0.5 animate-fadeIn"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
            onClose();
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-left text-[var(--text-primary)] hover:bg-[var(--surface-low)] rounded transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          {item.icon && <span className="text-[var(--text-secondary)]">{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

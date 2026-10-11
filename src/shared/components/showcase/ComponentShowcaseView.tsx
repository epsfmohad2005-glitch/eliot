/**
 * @file src/shared/components/showcase/ComponentShowcaseView.tsx
 * @description Foundation Component System (FCS-1) Isolated Component Showcase & Theme System 2.0 Visual Testing
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import {
  Button,
  IconButton,
  TextInput,
  SearchInput,
  PasswordInput,
  TextArea,
  NumberInput,
  NavigationItem,
  SidebarItem,
  HeaderAction,
  Breadcrumb,
  Tabs,
  CommandPaletteTrigger,
  Card,
  Panel,
  Sheet,
  Section,
  WorkspaceSurface,
  Alert,
  Toast,
  Checkbox,
  Radio,
  Toggle,
  SelectMenu,
  ProgressBar,
  LinearProgress,
  StepIndicator,
  LoadingSkeleton,
  Modal,
  ConfirmationDialog,
  CommandPalette,
  ContextMenu,
  KnowledgeNode,
  MemoryCard,
  EvidenceBadge,
  ConceptTag,
  StageIndicator,
  SessionTimer,
  FocusMeter,
  MissionStatus,
} from '../ui';
import { useTheme } from '../../../core/theme/ThemeContext';

export const ComponentShowcaseView: React.FC = () => {
  const { isRtl, toggleRtl } = useTheme();
  const [activeTab, setActiveTab] = useState('all');

  // Interactive Component States
  const [textVal, setTextVal] = useState('Sample Input');
  const [searchVal, setSearchVal] = useState('');
  const [numVal, setNumVal] = useState('42');
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioVal, setRadioVal] = useState('option1');
  const [toggleChecked, setToggleChecked] = useState(true);
  const [selectVal, setSelectVal] = useState('opt1');
  const [progressVal, setProgressVal] = useState(65);
  const [timerSeconds, setTimerSeconds] = useState(145);
  const [timerRunning, setTimerRunning] = useState(false);

  // Modal / Dialog States
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [ctxMenu, setCtxMenu] = useState<{ isOpen: boolean; x: number; y: number }>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  const sampleCommands = [
    { id: 'toggle-rtl', label: 'Toggle Reading Direction', category: 'View', shortcut: '⌘R', onSelect: toggleRtl },
    { id: 'reset-showcase', label: 'Reset Showcase State', category: 'View', shortcut: '⌘⇧R', onSelect: () => setActiveTab('all') },
  ];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({ isOpen: true, x: e.clientX, y: e.clientY });
  };

  return (
    <WorkspaceSurface className={`p-6 min-h-screen ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Controls Header */}
      <header className="max-w-7xl mx-auto mb-8 p-4 bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-xl font-bold text-[var(--text-primary)]">
            Foundation Component Showcase
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono-ui mt-0.5">
            Root identity primitives and interaction states.
          </p>
        </div>

        {/* Direction Control */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggleRtl}
            className="px-3 py-1.5 text-xs font-mono-ui border border-[var(--border-color)] bg-[var(--surface-low)] text-[var(--text-primary)] rounded-[var(--mode-radius)] hover:bg-[var(--surface-card)] transition-colors"
          >
            {isRtl ? 'RTL Mode (Active)' : 'LTR Mode (Active)'}
          </button>
        </div>
      </header>

      {/* Navigation Filter Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <Tabs
          tabs={[
            { id: 'all', label: 'All Components', badge: 9 },
            { id: 'buttons', label: 'Buttons & Inputs' },
            { id: 'nav', label: 'Navigation & Containers' },
            { id: 'feedback', label: 'Feedback & Selection' },
            { id: 'knowledge', label: 'Knowledge Primitives' },
            { id: 'dialogs', label: 'Dialogs & Overlays' },
          ]}
          activeTabId={activeTab}
          onChange={setActiveTab}
          variant="pills"
        />
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto space-y-12 pb-24" onContextMenu={handleContextMenu}>
        {/* BUTTONS & INPUTS SECTION */}
        {(activeTab === 'all' || activeTab === 'buttons') && (
          <Section title="1. Buttons & Input Primitives" description="Interactive controls consuming mode-adaptive tokens.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Buttons Card */}
              <Card variant="default">
                <h3 className="font-ui-body-bold text-sm font-semibold mb-3">Button Variants</h3>
                <div className="flex flex-wrap gap-2.5 mb-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <h4 className="text-xs font-mono-ui text-[var(--text-secondary)] mb-2">States & Sizes</h4>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button isLoading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <IconButton ariaLabel="Settings" icon="⚙️" variant="secondary" />
                </div>
              </Card>

              {/* Text Inputs Card */}
              <Card variant="default">
                <h3 className="font-ui-body-bold text-sm font-semibold mb-3">Text & Search Inputs</h3>
                <div className="space-y-3">
                  <TextInput
                    label="Standard Input"
                    value={textVal}
                    onChange={(e) => setTextVal(e.target.value)}
                    helperText="Consumes --surface-low and mode border."
                  />
                  <SearchInput
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onClear={() => setSearchVal('')}
                  />
                  <PasswordInput label="Password Input" defaultValue="secret123" />
                </div>
              </Card>

              {/* Number & Textarea Card */}
              <Card variant="default">
                <h3 className="font-ui-body-bold text-sm font-semibold mb-3">Area & Numeric Inputs</h3>
                <div className="space-y-3">
                  <NumberInput
                    label="Quantity"
                    value={numVal}
                    onChange={(e) => setNumVal(e.target.value)}
                    min={0}
                    max={100}
                  />
                  <TextArea label="Reflection Notes" placeholder="Enter deep notes..." rows={3} />
                </div>
              </Card>
            </div>
          </Section>
        )}

        {/* NAVIGATION & CONTAINERS SECTION */}
        {(activeTab === 'all' || activeTab === 'nav') && (
          <Section title="2. Navigation & Container Primitives" description="Structural layout wrappers and command elements.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Navigation Items */}
              <Card variant="default">
                <h3 className="font-ui-body-bold text-sm font-semibold mb-3">Navigation & Sidebar Items</h3>
                <div className="space-y-1">
                  <NavigationItem label="Active Item" active icon="📍" badge={3} />
                  <NavigationItem label="Inactive Item" icon="📂" />
                  <SidebarItem label="Knowledge Base" description="248 concepts indexed" icon="🧠" />
                  <Breadcrumb items={[{ label: 'Home' }, { label: 'Library' }, { label: 'Synthesis' }]} className="mt-4" />
                </div>
              </Card>

              {/* Command Palette Trigger */}
              <Card variant="default">
                <h3 className="font-ui-body-bold text-sm font-semibold mb-3">Header Actions & Command Deck</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <HeaderAction icon="🔔" ariaLabel="Notifications" badge />
                    <HeaderAction icon="⚙️" ariaLabel="Settings" active />
                    <HeaderAction icon="🔍" ariaLabel="Search" />
                  </div>
                  <CommandPaletteTrigger onClick={() => setCmdPaletteOpen(true)} />
                </div>
              </Card>

              {/* Panels & Surfaces */}
              <Panel
                title="Panel Primitive"
                subtitle="Header and body container"
                action={<Button size="sm" variant="ghost">Action</Button>}
              >
                <p className="text-xs text-[var(--text-secondary)]">
                  Panels wrap secondary domain views and feature panels cleanly with mode-adaptive borders.
                </p>
              </Panel>
            </div>
          </Section>
        )}

        {/* FEEDBACK & SELECTION SECTION */}
        {(activeTab === 'all' || activeTab === 'feedback') && (
          <Section title="3. Feedback & Selection Primitives" description="Banners, alerts, tooltips, checkboxes, and toggles.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Alerts & Banners */}
              <Card variant="default" className="space-y-3">
                <h3 className="font-ui-body-bold text-sm font-semibold mb-1">Alerts & Banner</h3>
                <Alert type="info" title="Information" message="System operating normally." />
                <Alert type="success" message="Ebbinghaus retention engine synchronized." />
                <Alert type="warning" message="Decay warning on 3 memory nodes." />
                <Alert type="error" message="Failed to reach remote backup server." />
              </Card>

              {/* Selection Controls */}
              <Card variant="default" className="space-y-4">
                <h3 className="font-ui-body-bold text-sm font-semibold mb-1">Selection Primitives</h3>
                <Checkbox
                  label="Enable Automatic Decay Sync"
                  description="Recalculate retention schedules every 24h."
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                />
                <div className="space-y-2 pt-1 border-t border-[var(--border-color)]">
                  <span className="text-xs font-label-sm text-[var(--text-secondary)]">Radio Option:</span>
                  <div className="flex items-center gap-4">
                    <Radio
                      label="Option A"
                      name="showcaseRadio"
                      checked={radioVal === 'option1'}
                      onChange={() => setRadioVal('option1')}
                    />
                    <Radio
                      label="Option B"
                      name="showcaseRadio"
                      checked={radioVal === 'option2'}
                      onChange={() => setRadioVal('option2')}
                    />
                  </div>
                </div>
                <div className="pt-1 border-t border-[var(--border-color)]">
                  <Toggle
                    label="Cognitive Silence Mode"
                    description="Hide non-essential UI metrics."
                    checked={toggleChecked}
                    onChange={setToggleChecked}
                  />
                </div>
                <SelectMenu
                  label="Learning Rhythm"
                  options={[
                    { value: 'opt1', label: 'Balanced (Daily)' },
                    { value: 'opt2', label: 'Intense (Sprint)' },
                    { value: 'opt3', label: 'Deep Scholar (Unpaced)' },
                  ]}
                  value={selectVal}
                  onChange={setSelectVal}
                />
              </Card>

              {/* Progress & Skeletons */}
              <Card variant="default" className="space-y-4">
                <h3 className="font-ui-body-bold text-sm font-semibold mb-1">Progress & Skeletons</h3>
                <ProgressBar value={progressVal} label="Session Mastery" showPercentage />
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setProgressVal(Math.max(0, progressVal - 10))}>-10%</Button>
                  <Button size="sm" variant="secondary" onClick={() => setProgressVal(Math.min(100, progressVal + 10))}>+10%</Button>
                </div>
                <LinearProgress />
                <StepIndicator
                  steps={[{ id: '1', label: 'Intake' }, { id: '2', label: 'Absorb' }, { id: '3', label: 'Master' }]}
                  currentStepIndex={1}
                />
                <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                  <span className="text-xs font-label-sm text-[var(--text-secondary)]">Loading Skeleton:</span>
                  <LoadingSkeleton height={20} />
                  <LoadingSkeleton height={40} />
                </div>
              </Card>
            </div>
          </Section>
        )}

        {/* KNOWLEDGE PRIMITIVES SECTION */}
        {(activeTab === 'all' || activeTab === 'knowledge') && (
          <Section title="4. Eliot-Exclusive Knowledge Primitives" description="Domain-specific primitives for concepts, memories, and missions.">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KnowledgeNode title="Quantum Computing Fundamentals" domain="Physics" masteryScore={85} status="active" />
              <KnowledgeNode title="Neural Network Architectures" domain="Computer Science" masteryScore={42} status="decaying" />
              <KnowledgeNode title="Epistemology & Cognitive Bias" domain="Philosophy" masteryScore={100} status="mastered" />
              <KnowledgeNode title="Category Theory in Haskell" domain="Mathematics" masteryScore={0} status="unexplored" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <MemoryCard
                concept="Spaced Repetition"
                definition="A learning technique that incorporates increasing intervals of time between subsequent review of previously learned material."
                retentionIntervalDays={7}
                onReview={() => setShowToast(true)}
              />
              <Card variant="default" className="space-y-4">
                <h3 className="font-ui-body-bold text-sm font-semibold mb-1">Badges & Tags</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <EvidenceBadge confidenceScore={0.92} sourceCount={4} />
                  <EvidenceBadge confidenceScore={0.65} sourceCount={2} />
                  <EvidenceBadge confidenceScore={0.35} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ConceptTag label="Physics" active />
                  <ConceptTag label="DeepLearning" />
                  <ConceptTag label="Memory" onRemove={() => {}} />
                </div>
                <StageIndicator stage="SYNTHESIS" />
              </Card>
              <Card variant="default" className="space-y-4">
                <h3 className="font-ui-body-bold text-sm font-semibold mb-1">Timers & Focus Meters</h3>
                <SessionTimer
                  elapsedSeconds={timerSeconds}
                  isRunning={timerRunning}
                  onToggle={() => setTimerRunning(!timerRunning)}
                />
                <FocusMeter score={88} />
                <MissionStatus missionTitle="Master General Relativity Concepts" progress={75} />
              </Card>
            </div>
          </Section>
        )}

        {/* DIALOGS & OVERLAYS SECTION */}
        {(activeTab === 'all' || activeTab === 'dialogs') && (
          <Section title="5. Dialogs, Modals & Triggers" description="Interactive overlay components and command decks.">
            <Card variant="default">
              <h3 className="font-ui-body-bold text-sm font-semibold mb-3">Interactive Overlay Triggers</h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                Click any button below to trigger the modal, confirmation dialog, sheet, toast, or command palette. You can also right-click anywhere on the showcase grid to open the context menu.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => setModalOpen(true)}>Open Modal</Button>
                <Button variant="secondary" onClick={() => setConfirmOpen(true)}>Open Confirmation</Button>
                <Button variant="secondary" onClick={() => setCmdPaletteOpen(true)}>Open Command Palette (⌘K)</Button>
                <Button variant="secondary" onClick={() => setSheetOpen(true)}>Open Side Sheet</Button>
                <Button variant="ghost" onClick={() => setShowToast(true)}>Trigger Toast</Button>
              </div>
            </Card>
          </Section>
        )}
      </main>

      {/* OVERLAY COMPONENTS */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="FCS-1 Modal Primitive"
        description="Encapsulated dialog consuming tokenized backdrop and border styling."
        footer={<Button variant="primary" onClick={() => setModalOpen(false)}>Close Modal</Button>}
      >
        <p className="text-xs text-[var(--text-primary)] leading-relaxed">
          Modals maintain complete WCAG AAA contrast and keyboard focus trapping (Esc key closes modal).
        </p>
      </Modal>

      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setShowToast(true)}
        title="Confirm Reset Session"
        message="Are you sure you want to reset your cognitive session timers? This action cannot be undone."
        isDestructive
      />

      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        commands={sampleCommands}
      />

      <Sheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Side Sheet Panel"
      >
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Side sheets display deep meta information or configuration controls without disrupting primary workspace focus.
        </p>
      </Sheet>

      <ContextMenu
        isOpen={ctxMenu.isOpen}
        x={ctxMenu.x}
        y={ctxMenu.y}
        onClose={() => setCtxMenu({ ...ctxMenu, isOpen: false })}
        items={[
          { id: '1', label: 'Copy Token Reference', onClick: () => setShowToast(true) },
          { id: '2', label: 'Toggle Reading Direction', onClick: toggleRtl },
          { id: '3', label: 'Inspect Element', disabled: true, onClick: () => {} },
        ]}
      />

      {/* Toast Notification Container */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[var(--z-toast)]">
          <Toast
            title="Action Executed"
            description="Foundation component state updated successfully."
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
    </WorkspaceSurface>
  );
};

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { Tabs } from "@/components/ui/tabs";
import { RichNotes } from "@/components/ui/rich-notes";
import { Avatar } from "@/components/ui/avatar";
import { TaskRow } from "@/components/ui/task-row";
import { Toast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { playCompleteSound, isSoundEnabled, setSoundEnabled } from "@/lib/sound";
import {
  Search,
  Volume2,
  VolumeX,
  Plus,
  Phone,
  Palette,
  Type,
  CheckSquare,
  Tag,
  MousePointerClick,
  TextCursorInput,
  ListTodo,
  FileText,
  Sliders,
  BellRing,
  Layers,
  Sparkles,
} from "lucide-react";

export default function UIKitPage() {
  const [soundOn, setSoundOn] = React.useState(true);
  const [activeSection, setActiveSection] = React.useState<string>("buttons");

  // Interactive demo states
  const [cbUnchecked, setCbUnchecked] = React.useState(false);
  const [cbChecked, setCbChecked] = React.useState(true);
  const [cbIndeterminate, setCbIndeterminate] = React.useState(true);
  const [switchVal, setSwitchVal] = React.useState(true);
  const [tabVal, setTabVal] = React.useState("all");
  const [statusVal, setStatusVal] = React.useState("in_progress");
  const [notesVal, setNotesVal] = React.useState(
    "Need to research modern layout styles.\nPlan structure and content.\nFocus on highlighting case studies."
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [toastVisible, setToastVisible] = React.useState(true);
  const [selectedRow, setSelectedRow] = React.useState("row-1");
  const [rowChecked, setRowChecked] = React.useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playCompleteSound();
  };

  const navItems = [
    { id: "buttons", label: "Buttons (Size Matrix)", icon: MousePointerClick },
    { id: "inputs", label: "Inputs & Search", icon: TextCursorInput },
    { id: "selection", label: "Checkbox & Switch", icon: CheckSquare },
    { id: "dropdowns", label: "Dropdown Status Select", icon: Sliders },
    { id: "tabs", label: "Segmented Tabs", icon: Layers },
    { id: "rich-notes", label: "Rich Notes Editor", icon: FileText },
    { id: "badges", label: "Badges & Tags", icon: Tag },
    { id: "task-rows", label: "Task Rows (In Context)", icon: ListTodo },
    { id: "feedback", label: "Toast & Dialog", icon: BellRing },
    { id: "colors", label: "Color Tokens", icon: Palette },
    { id: "typography", label: "Typography", icon: Type },
  ];

  const statusOptions = [
    { value: "todo", label: "To Do", dotColor: "#71717A" },
    { value: "in_progress", label: "In Progress", dotColor: "#2563EB" },
    { value: "review", label: "Review", dotColor: "#8B5CF6" },
    { value: "done", label: "Done", dotColor: "#10B981" },
    { value: "someday", label: "Someday", dotColor: "#F59E0B" },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-[#18181B] overflow-hidden select-none">
      {/* Top Bar */}
      <header className="h-11 border-b border-[#E5E7EB] bg-white px-5 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-tight text-[#18181B]">
            nuetty - to do list
          </span>
          <span className="text-xs text-[#71717A] font-normal">/ UI Kit</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSound}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F5F7] transition-colors"
          >
            {soundOn ? (
              <Volume2 className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 text-[#A1A1AA]" />
            )}
            <span>Sound {soundOn ? "On (820Hz Pop)" : "Muted"}</span>
          </button>
        </div>
      </header>

      {/* 2-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Rail */}
        <aside className="w-60 border-r border-[#E5E7EB] bg-[#F7F8FA] p-3 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
              UI Kit Matrix
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                    isActive
                      ? "bg-[#EAECEE] text-[#18181B] font-semibold"
                      : "text-[#71717A] hover:bg-[#ECEEF1] hover:text-[#18181B]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white border border-[#E5E7EB]">
              <Avatar initials="A" size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#18181B] truncate">
                  Abram Vaccaro
                </p>
                <p className="text-[10px] text-[#71717A] truncate">Workspace: Personal</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Canvas */}
        <main className="flex-1 overflow-y-auto bg-white p-8 md:p-12 space-y-16">
          
          {/* 1. BUTTONS (FULL MATRIX) */}
          <section id="buttons" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Buttons — Size & Variant Matrix
              </h2>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#18181B] block">
                Size Scale (xs, sm, md, lg)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">Extra Small (24px)</Button>
                <Button size="sm">Small (28px)</Button>
                <Button size="md">Medium (36px - Default)</Button>
                <Button size="lg">Large (44px - Touch)</Button>
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#18181B] block">
                Visual Variants
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Solid</Button>
                <Button variant="secondary">Secondary Gray</Button>
                <Button variant="outline">Outline Border</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="action" leftIcon={<Plus className="h-4 w-4" />}>
                  New task
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
                <Button variant="link">Inline Link</Button>
              </div>
            </div>

            {/* States */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#18181B] block">
                States (Loading, Disabled, Icon-Only)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" isLoading size="sm">
                  Saving
                </Button>
                <Button variant="outline" disabled size="sm">
                  Disabled
                </Button>
                <Button variant="outline" size="iconSm">
                  <Search className="h-3.5 w-3.5" />
                </Button>
                <Button variant="secondary" size="iconMd">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* 2. INPUTS */}
          <section id="inputs" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Inputs & Search
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-medium text-[#71717A] block mb-1">
                  Small (28px) / Search Icon
                </span>
                <Input
                  size="sm"
                  placeholder="Quick find..."
                  leftIcon={<Search className="h-3.5 w-3.5" />}
                  rightAction={
                    <span className="text-[10px] font-mono text-[#A1A1AA] bg-[#F4F5F7] px-1 py-0.5 rounded border border-[#E5E7EB]">
                      ⌘K
                    </span>
                  }
                />
              </div>

              <div>
                <span className="text-xs font-medium text-[#71717A] block mb-1">
                  Medium (36px - Default)
                </span>
                <Input
                  size="md"
                  defaultValue="Build a portfolio website"
                  helperText="Press Enter to update title"
                />
              </div>

              <div>
                <span className="text-xs font-medium text-[#71717A] block mb-1">
                  Error State
                </span>
                <Input
                  size="md"
                  error
                  defaultValue="Invalid date format"
                  errorMessage="Please select a valid deadline"
                />
              </div>
            </div>
          </section>

          {/* 3. SELECTION CONTROLS */}
          <section id="selection" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Checkbox & Switch (Mac Native Style)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Checkboxes */}
              <div className="p-4 rounded-xl border border-[#E5E7EB] space-y-3">
                <span className="text-xs font-semibold text-[#18181B] block">
                  Checkbox States
                </span>
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={cbUnchecked}
                      onCheckedChange={setCbUnchecked}
                    />
                    <span className="text-xs text-[#18181B]">Unchecked</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={cbChecked}
                      onCheckedChange={setCbChecked}
                    />
                    <span className="text-xs text-[#18181B]">Checked</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      indeterminate={cbIndeterminate}
                      onCheckedChange={() => setCbIndeterminate(!cbIndeterminate)}
                    />
                    <span className="text-xs text-[#18181B]">Indeterminate (Partial)</span>
                  </label>

                  <label className="flex items-center gap-2 opacity-40">
                    <Checkbox disabled />
                    <span className="text-xs text-[#71717A]">Disabled</span>
                  </label>
                </div>
              </div>

              {/* Switches */}
              <div className="p-4 rounded-xl border border-[#E5E7EB] space-y-3">
                <span className="text-xs font-semibold text-[#18181B] block">
                  Toggle Switch (Settings)
                </span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <Switch
                      checked={switchVal}
                      onCheckedChange={setSwitchVal}
                    />
                    <span className="text-xs text-[#18181B]">
                      Sound feedback ({switchVal ? "Active" : "Disabled"})
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 opacity-40">
                    <Switch disabled />
                    <span className="text-xs text-[#71717A]">Disabled</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* 4. DROPDOWN STATUS SELECTOR */}
          <section id="dropdowns" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Dropdown Status Selector (Inspector Primitive)
              </h2>
            </div>

            <div className="max-w-xs space-y-2">
              <span className="text-xs font-medium text-[#71717A] block">
                Status Selector (Click to open menu)
              </span>
              <Dropdown
                options={statusOptions}
                value={statusVal}
                onChange={setStatusVal}
              />
            </div>
          </section>

          {/* 5. SEGMENTED TABS */}
          <section id="tabs" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Segmented Tabs (View Filters)
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Tabs
                tabs={[
                  { id: "all", label: "All", count: 12 },
                  { id: "todo", label: "To Do", count: 7 },
                  { id: "in_progress", label: "In Progress", count: 3 },
                  { id: "done", label: "Done", count: 2 },
                ]}
                activeId={tabVal}
                onChange={setTabVal}
                size="sm"
              />
            </div>
          </section>

          {/* 6. RICH NOTES */}
          <section id="rich-notes" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Rich Notes Editor (Inspector Primitive)
              </h2>
            </div>

            <div className="max-w-xl">
              <RichNotes
                value={notesVal}
                onChange={setNotesVal}
                placeholder="Write markdown notes or task checklist..."
              />
            </div>
          </section>

          {/* 7. BADGES & TAGS */}
          <section id="badges" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Badges & Tags (Exact Reference Palette)
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="today">Today</Badge>
              <Badge variant="tomorrow">Tomorrow</Badge>
              <Badge variant="tomorrow">Saturday</Badge>
              <Badge variant="upcoming">November 8, 2024</Badge>
              <Badge variant="someday">Someday</Badge>
              <Badge variant="overdue">Overdue (2 days)</Badge>
              <Badge variant="inbox">Inbox</Badge>
              <Badge variant="tag" prefixHash>Routine</Badge>
              <Badge variant="tag" prefixHash>SelfCare</Badge>
              <Badge variant="tag" prefixHash>Client</Badge>
              <Badge variant="tag" prefixHash>Admin</Badge>
              <Badge variant="tag" prefixHash>Strategic</Badge>
              <Badge variant="tag" prefixHash>Milestone</Badge>
            </div>
          </section>

          {/* 8. TASK ROWS */}
          <section id="task-rows" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Task Row Component (Real Application Context)
              </h2>
            </div>

            <div className="max-w-2xl bg-white rounded-xl border border-[#E5E7EB] p-2 space-y-1">
              <TaskRow
                title="Daily Routine"
                completed={rowChecked}
                onCompletedChange={setRowChecked}
                dateBadge={<Badge variant="today">Today</Badge>}
                selected={selectedRow === "row-1"}
                onSelect={() => setSelectedRow("row-1")}
              />

              <TaskRow
                title="Deep Exfoliation"
                dateBadge={<Badge variant="tomorrow">Tomorrow</Badge>}
                selected={selectedRow === "row-2"}
                onSelect={() => setSelectedRow("row-2")}
              />

              <TaskRow
                title="Gym Session - Upper Body"
                dateBadge={<Badge variant="today">Today</Badge>}
                selected={selectedRow === "row-3"}
                onSelect={() => setSelectedRow("row-3")}
                addedAgo="1h ago"
                showFolderIcon
              />

              <TaskRow
                title="Yoga Session"
                dateBadge={<Badge variant="overdue">Overdue (2 days)</Badge>}
                selected={selectedRow === "row-4"}
                onSelect={() => setSelectedRow("row-4")}
              />

              <TaskRow
                title="Complete client call notes"
                completed={true}
                selected={selectedRow === "row-5"}
                onSelect={() => setSelectedRow("row-5")}
                addedAgo="1h ago"
                categoryIcon={<Phone className="h-3.5 w-3.5" />}
              />
            </div>
          </section>

          {/* 9. FEEDBACK & DIALOGS */}
          <section id="feedback" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Feedback, Toast & Confirmation Dialog
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {toastVisible && (
                <Toast
                  message="Task marked as done"
                  onUndo={() => {
                    playCompleteSound();
                    setToastVisible(false);
                    setTimeout(() => setToastVisible(true), 2000);
                  }}
                />
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
              >
                Open Confirmation Dialog
              </Button>

              <Dialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                title="Delete project?"
                description="This will move all 7 tasks to Trash. You can restore them anytime."
                footer={
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDialogOpen(false)}
                    >
                      Delete Project
                    </Button>
                  </>
                }
              />
            </div>

            {/* Skeletons & Empty State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-4 rounded-xl border border-[#E5E7EB] space-y-3">
                <span className="text-xs font-semibold text-[#18181B] block">
                  Skeleton Loading Shimmer
                </span>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-4 w-4 rounded-[4px]" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-4 w-4 rounded-[4px]" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-4 w-4 rounded-[4px]" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                </div>
              </div>

              <div>
                <EmptyState
                  title="No tasks in this section"
                  description="Add your first task to start organizing."
                  action={
                    <Button variant="outline" size="xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add task
                    </Button>
                  }
                />
              </div>
            </div>
          </section>

          {/* 10. COLOR TOKENS */}
          <section id="colors" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Color Tokens
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
                <div className="h-10 w-full rounded bg-[#10B981] mb-2.5" />
                <div className="text-[13px] font-medium text-[#18181B]">Today</div>
                <div className="text-[11px] font-mono text-[#71717A]">#10B981</div>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
                <div className="h-10 w-full rounded bg-[#8B5CF6] mb-2.5" />
                <div className="text-[13px] font-medium text-[#18181B]">Upcoming</div>
                <div className="text-[11px] font-mono text-[#71717A]">#8B5CF6</div>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
                <div className="h-10 w-full rounded bg-[#F59E0B] mb-2.5" />
                <div className="text-[13px] font-medium text-[#18181B]">Someday</div>
                <div className="text-[11px] font-mono text-[#71717A]">#F59E0B</div>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
                <div className="h-10 w-full rounded bg-[#2563EB] mb-2.5" />
                <div className="text-[13px] font-medium text-[#18181B]">Inbox / Action</div>
                <div className="text-[11px] font-mono text-[#71717A]">#2563EB</div>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
                <div className="h-10 w-full rounded bg-[#EF4444] mb-2.5" />
                <div className="text-[13px] font-medium text-[#18181B]">Overdue</div>
                <div className="text-[11px] font-mono text-[#71717A]">#EF4444</div>
              </div>
            </div>
          </section>

          {/* 11. TYPOGRAPHY */}
          <section id="typography" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Typography
              </h2>
            </div>

            <div className="divide-y divide-[#F0F1F3]">
              <div className="py-3 flex items-baseline justify-between">
                <span className="text-[11px] font-mono text-[#A1A1AA] w-36">Display Title</span>
                <span className="text-3xl font-bold tracking-tight text-[#18181B] flex-1">
                  Personal 😎
                </span>
                <span className="text-[11px] text-[#A1A1AA]">30px Bold</span>
              </div>

              <div className="py-3 flex items-baseline justify-between">
                <span className="text-[11px] font-mono text-[#A1A1AA] w-36">Section Header</span>
                <span className="text-[15px] font-bold text-[#18181B] flex-1">
                  ∨ Skincare 4
                </span>
                <span className="text-[11px] text-[#A1A1AA]">15px Bold</span>
              </div>

              <div className="py-3 flex items-baseline justify-between">
                <span className="text-[11px] font-mono text-[#A1A1AA] w-36">Task Label</span>
                <span className="text-[14px] font-medium text-[#18181B] flex-1">
                  Complete client call notes
                </span>
                <span className="text-[11px] text-[#A1A1AA]">14px Medium</span>
              </div>

              <div className="py-3 flex items-baseline justify-between">
                <span className="text-[11px] font-mono text-[#A1A1AA] w-36">Metadata / Pill</span>
                <span className="text-[11px] font-medium text-[#71717A] flex-1">
                  Added: 1h ago · #Routine · November 8, 2024
                </span>
                <span className="text-[11px] text-[#A1A1AA]">11px Regular</span>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

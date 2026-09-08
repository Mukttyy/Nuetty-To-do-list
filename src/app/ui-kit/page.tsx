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
import { PropertyRow } from "@/components/ui/property-row";
import { SubtaskItem } from "@/components/ui/subtask-item";
import { ActivityLog } from "@/components/ui/activity-log";
import { SidebarItem } from "@/components/ui/sidebar-item";
import { SectionHeader } from "@/components/ui/section-header";
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
  Layers,
  Calendar,
  ChevronDown,
  Inbox,
  Clock,
  Archive,
  Trash2,
  FolderKanban,
} from "lucide-react";

export default function UIKitPage() {
  const [soundOn, setSoundOn] = React.useState(true);
  const [activeSection, setActiveSection] = React.useState<string>("buttons");

  // Interactive demo states
  const [cbUnchecked, setCbUnchecked] = React.useState(false);
  const [cbChecked, setCbChecked] = React.useState(true);
  const [cbIndeterminate, setCbIndeterminate] = React.useState(true);
  const [switchVal, setSwitchVal] = React.useState(true);
  const [statusVal, setStatusVal] = React.useState("todo");
  const [notesVal, setNotesVal] = React.useState(
    "My simple morning skincare steps.\nRemember to use sunscreen after moisturizing.\nCleanse, Tone\nMoisturize\nSunscreen."
  );
  const [selectedRow, setSelectedRow] = React.useState("row-1");
  const [row1Checked, setRow1Checked] = React.useState(false);
  const [sub1, setSub1] = React.useState(true);
  const [sub2, setSub2] = React.useState(true);
  const [sub3, setSub3] = React.useState(false);
  const [sub4, setSub4] = React.useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playCompleteSound();
  };

  const navItems = [
    { id: "buttons", label: "Buttons (Scale & Styles)", icon: MousePointerClick },
    { id: "inputs", label: "Inputs & Search", icon: TextCursorInput },
    { id: "selection", label: "Checkbox & Controls", icon: CheckSquare },
    { id: "inspector", label: "Inspector Primitives", icon: Sliders },
    { id: "rich-notes", label: "Rich Notes Editor", icon: FileText },
    { id: "badges", label: "Badges & Tags", icon: Tag },
    { id: "sidebar-nav", label: "Sidebar Nav Items", icon: FolderKanban },
    { id: "section-headers", label: "Section Headers", icon: Layers },
    { id: "task-rows", label: "Task Rows (Reference)", icon: ListTodo },
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
              UI Kit Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${isActive
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

          {/* 1. BUTTONS */}
          <section id="buttons" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Buttons — Size Scale & Styles
              </h2>
            </div>

            {/* Sizes */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-[#18181B] block">
                Size Scale (xs, sm, md, lg)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">Extra Small (24px)</Button>
                <Button size="sm">Small (28px)</Button>
                <Button size="md">Medium (36px)</Button>
                <Button size="lg">Large (44px)</Button>
              </div>
            </div>

            {/* Real Buttons in App */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-[#18181B] block">
                Application Action Buttons
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="md">
                  Close Details
                </Button>
                <Button variant="secondary" size="sm">
                  Sort: Newest
                </Button>
                <Button variant="outline" size="sm">
                  Filter: Unread
                </Button>
                <Button variant="outline" size="sm" rightIcon={<ChevronDown className="h-3.5 w-3.5 text-zinc-400" />}>
                  Move Task to...
                </Button>
                <Button variant="action" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                  New task
                </Button>
                <Button variant="ghost" size="sm" leftIcon={<Plus className="h-3.5 w-3.5 text-[#2563EB]" />}>
                  Add Project
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </section>

          {/* 2. INPUTS */}
          <section id="inputs" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Inputs & Quick Find
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-xs font-medium text-[#71717A] block mb-1.5">
                  Quick find (Sidebar & Header)
                </span>
                <Input
                  size="sm"
                  placeholder="Quick find"
                  leftIcon={<Search className="h-3.5 w-3.5" />}
                  rightAction={
                    <span className="text-[10px] font-mono text-[#A1A1AA] bg-[#F4F5F7] px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                      ⌘K
                    </span>
                  }
                />
              </div>

              <div>
                <span className="text-xs font-medium text-[#71717A] block mb-1.5">
                  Title Field (Inspector)
                </span>
                <Input
                  size="md"
                  defaultValue="Daily Routine"
                />
              </div>

              <div>
                <span className="text-xs font-medium text-[#71717A] block mb-1.5">
                  Field with Error
                </span>
                <Input
                  size="md"
                  error
                  defaultValue="2024-99-99"
                  errorMessage="Invalid date"
                />
              </div>
            </div>
          </section>

          {/* 3. SELECTION CONTROLS */}
          <section id="selection" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Checkbox & Controls
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl border border-[#E5E7EB] space-y-3">
                <span className="text-xs font-semibold text-[#18181B] block">
                  Things 3 Checkbox States
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
                    <span className="text-xs text-[#18181B]">Indeterminate</span>
                  </label>

                  <label className="flex items-center gap-2 opacity-40">
                    <Checkbox disabled />
                    <span className="text-xs text-[#71717A]">Disabled</span>
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E5E7EB] space-y-3">
                <span className="text-xs font-semibold text-[#18181B] block">
                  Toggle Switch
                </span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <Switch
                      checked={switchVal}
                      onCheckedChange={setSwitchVal}
                    />
                    <span className="text-xs text-[#18181B]">
                      Sound feedback
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

          {/* 4. INSPECTOR PRIMITIVES */}
          <section id="inspector" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Task Details Inspector Primitives (Properties, Sub-tasks, Activity)
              </h2>
            </div>

            <div className="max-w-md bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-5">
              <div className="border-b border-[#E5E7EB] pb-3">
                <span className="text-sm font-bold text-[#18181B]">
                  Task Details: Daily Routine
                </span>
              </div>

              {/* Properties Grid */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#18181B] block mb-2">
                  Properties
                </span>

                <PropertyRow label="Project">
                  <span className="text-xs text-[#18181B] font-medium flex items-center gap-1.5">
                    <span>😎</span>
                    <span>Personal</span>
                  </span>
                </PropertyRow>

                <PropertyRow label="Due Date">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#18181B] flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                      November 3, 2024
                    </span>
                    <Badge variant="today">Today</Badge>
                  </div>
                </PropertyRow>

                <PropertyRow label="Status" labelIcon={<ChevronDown className="h-3 w-3 text-zinc-400" />}>
                  <div className="w-40">
                    <Dropdown
                      size="sm"
                      options={statusOptions}
                      value={statusVal}
                      onChange={setStatusVal}
                    />
                  </div>
                </PropertyRow>

                <PropertyRow label="Assignee">
                  <div className="flex items-center gap-2">
                    <Avatar initials="A" size="sm" />
                    <span className="text-xs text-[#18181B]">Abram Vaccaro</span>
                  </div>
                </PropertyRow>

                <PropertyRow label="Tags">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="tag" prefixHash>Routine</Badge>
                    <Badge variant="tag" prefixHash>SelfCare</Badge>
                    <button
                      type="button"
                      className="h-5 w-5 inline-flex items-center justify-center rounded border border-[#E5E7EB] text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </PropertyRow>
              </div>

              {/* Sub-tasks Section */}
              <div className="border-t border-[#E5E7EB] pt-4 space-y-2">
                <span className="text-xs font-bold text-[#18181B] block">
                  Sub-tasks
                </span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <SubtaskItem
                    title="Face Wash"
                    completed={sub1}
                    onCompletedChange={setSub1}
                  />
                  <SubtaskItem
                    title="Apply Toner"
                    completed={sub2}
                    onCompletedChange={setSub2}
                  />
                  <SubtaskItem
                    title="Apply Moisturizer"
                    completed={sub3}
                    onCompletedChange={setSub3}
                  />
                  <SubtaskItem
                    title="Apply Sunscreen"
                    completed={sub4}
                    onCompletedChange={setSub4}
                  />
                </div>
              </div>

              {/* Activity Log Section */}
              <div className="border-t border-[#E5E7EB] pt-4">
                <ActivityLog
                  entries={[
                    {
                      id: "act-1",
                      time: "11:00 AM",
                      actor: "Abram Vaccaro",
                      description: 'updated status to "To Do".',
                    },
                    {
                      id: "act-2",
                      time: "11:05 AM",
                      actor: "Abram Vaccaro",
                      description: "marked as 'Done'.",
                    },
                  ]}
                />
              </div>

              {/* Action Bar Footer */}
              <div className="border-t border-[#E5E7EB] pt-4 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ChevronDown className="h-3 w-3 text-zinc-400 ml-1" />}
                >
                  Move Task to...
                </Button>
                <Button variant="primary" size="sm">
                  Close Details
                </Button>
              </div>
            </div>
          </section>

          {/* 5. RICH NOTES */}
          <section id="rich-notes" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Rich Notes Editor
              </h2>
            </div>

            <div className="max-w-md">
              <RichNotes
                value={notesVal}
                onChange={setNotesVal}
                placeholder="My simple morning skincare steps..."
              />
            </div>
          </section>

          {/* 6. BADGES & TAGS */}
          <section id="badges" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Badges & Tags (Reference Palette)
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

          {/* 7. SIDEBAR NAV ITEMS */}
          <section id="sidebar-nav" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Sidebar Navigation Items (Exact Reference Anatomy)
              </h2>
            </div>

            <div className="max-w-xs space-y-1 bg-[#F7F8FA] p-2 rounded-xl border border-[#E5E7EB]">
              <SidebarItem
                icon={<Inbox className="h-4 w-4 text-[#2563EB]" />}
                label="Inbox"
              />
              <SidebarItem
                icon={<Calendar className="h-4 w-4 text-[#10B981]" />}
                label="Today"
                count={7}
                active
              />
              <SidebarItem
                icon={<Clock className="h-4 w-4 text-[#8B5CF6]" />}
                label="Upcoming"
                count={3}
              />
              <SidebarItem
                icon={<Archive className="h-4 w-4 text-[#F59E0B]" />}
                label="Someday"
                count={5}
              />
              <SidebarItem
                icon={<Trash2 className="h-4 w-4 text-zinc-400" />}
                label="Trash"
              />
              <div className="pt-2 border-t border-[#E5E7EB]">
                <SidebarItem
                  emoji="😎"
                  label="Personal"
                  count={7}
                />
                <SidebarItem
                  emoji="🎯"
                  label="Work"
                  count={4}
                />
              </div>
            </div>
          </section>

          {/* 8. SECTION HEADERS */}
          <section id="section-headers" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Section Headers (Canvas Group Headers)
              </h2>
            </div>

            <div className="max-w-xs space-y-2">
              <SectionHeader title="Skincare" count={4} isOpen />
              <SectionHeader title="Fitness" count={3} emoji="🏋️" isOpen />
              <SectionHeader title="Home & Family" count={6} emoji="🏠" isOpen={false} />
              <SectionHeader title="Long-term Goals" count={1} emoji="🎯" isOpen={false} />
            </div>
          </section>

          {/* 9. TASK ROWS */}
          <section id="task-rows" className="scroll-mt-6 space-y-6">
            <div className="border-b border-[#E5E7EB] pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Task Row Component (Exact Reference Anatomy)
              </h2>
            </div>

            <div className="max-w-2xl bg-white rounded-xl border border-[#E5E7EB] p-2 space-y-1">
              <TaskRow
                title="Daily Routine"
                completed={row1Checked}
                onCompletedChange={setRow1Checked}
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

          {/* 8. COLOR TOKENS */}
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

          {/* 9. TYPOGRAPHY */}
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

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { TaskRow } from "@/components/ui/task-row";
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
  User,
} from "lucide-react";

export default function UIKitPage() {
  const [soundOn, setSoundOn] = React.useState(true);
  const [activeSection, setActiveSection] = React.useState<string>("all");
  const [task1Checked, setTask1Checked] = React.useState(false);
  const [task2Checked, setTask2Checked] = React.useState(false);
  const [task3Checked, setTask3Checked] = React.useState(true);
  const [selectedTaskId, setSelectedTaskId] = React.useState<string>("row-1");

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playCompleteSound();
  };

  const navItems = [
    { id: "colors", label: "Color Tokens", icon: Palette },
    { id: "typography", label: "Typography", icon: Type },
    { id: "checkbox", label: "Checkbox", icon: CheckSquare },
    { id: "badges", label: "Badges & Tags", icon: Tag },
    { id: "buttons", label: "Buttons", icon: MousePointerClick },
    { id: "inputs", label: "Inputs & Search", icon: TextCursorInput },
    { id: "task-rows", label: "Task Rows", icon: ListTodo },
    { id: "profile", label: "User Profile", icon: User },
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
      {/* Top Application Bar */}
      <header className="h-11 border-b border-[#E5E7EB] bg-white px-5 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <span className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <span className="h-3 w-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
          </div>
          <span className="h-4 w-px bg-[#E5E7EB] ml-1" />
          <span className="text-xs font-semibold tracking-tight text-[#18181B]">
            Taskify UI Kit & Design System
          </span>
          <span className="text-[11px] font-mono text-[#71717A] bg-[#F4F5F7] px-2 py-0.5 rounded border border-[#E5E7EB]">
            Full Screen Canvas
          </span>
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

      {/* Main Workspace (Full Width 2-Panel Split) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Navigation Rail */}
        <aside className="w-56 border-r border-[#E5E7EB] bg-[#F7F8FA] p-3 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
              Components
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
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

          {/* User Account / Workspace Footer */}
          <div className="pt-3 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white border border-[#E5E7EB]">
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

        {/* Right Main Canvas (Edge-to-Edge Scroll Area) */}
        <main className="flex-1 overflow-y-auto bg-white p-8 md:p-12 space-y-16">

          {/* 1. Color Tokens */}
          <section id="colors" className="scroll-mt-6">
            <div className="border-b border-[#E5E7EB] pb-2 mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Color Tokens
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
                <div className="h-10 w-full rounded bg-[#10B981] mb-2.5" />
                <div className="text-[13px] font-medium text-[#18181B]">Today</div>
                <div className="text-[11px] font-mono text-[#71717A]">#10B981</div>
                <div className="text-[11px] text-[#71717A] mt-1">Calendar & badge</div>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
                <div className="h-10 w-full rounded bg-[#8B5CF6] mb-2.5" />
                <div className="text-[13px] font-medium text-[#18181B]">Upcoming</div>
                <div className="text-[11px] font-mono text-[#71717A]">#8B5CF6</div>
                <div className="text-[11px] text-[#71717A] mt-1">Scheduled tasks</div>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
                <div className="h-10 w-full rounded bg-[#F59E0B] mb-2.5" />
                <div className="text-[13px] font-medium text-[#18181B]">Someday</div>
                <div className="text-[11px] font-mono text-[#71717A]">#F59E0B</div>
                <div className="text-[11px] text-[#71717A] mt-1">Backlog & ideas</div>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
                <div className="h-10 w-full rounded bg-[#2563EB] mb-2.5" />
                <div className="text-[13px] font-medium text-[#18181B]">Inbox / Action</div>
                <div className="text-[11px] font-mono text-[#71717A]">#2563EB</div>
                <div className="text-[11px] text-[#71717A] mt-1">Primary buttons</div>
              </div>

              <div className="border border-[#E5E7EB] rounded-lg p-3 bg-white">
                <div className="h-10 w-full rounded bg-[#EF4444] mb-2.5" />
                <div className="text-[13px] font-medium text-[#18181B]">Overdue</div>
                <div className="text-[11px] font-mono text-[#71717A]">#EF4444</div>
                <div className="text-[11px] text-[#71717A] mt-1">Overdue alert</div>
              </div>
            </div>
          </section>

          {/* 2. Typography */}
          <section id="typography" className="scroll-mt-6">
            <div className="border-b border-[#E5E7EB] pb-2 mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Typography Specimen
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

          {/* 3. Checkbox Primitive */}
          <section id="checkbox" className="scroll-mt-6">
            <div className="border-b border-[#E5E7EB] pb-2 mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Checkbox (Mac Native Style)
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-10 py-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <Checkbox
                  checked={task1Checked}
                  onCheckedChange={setTask1Checked}
                />
                <span className="text-sm font-medium text-[#18181B]">
                  Unchecked (Click to toggle with audio pop)
                </span>
              </label>

              <label className="flex items-center gap-2.5 select-none">
                <Checkbox checked={true} readOnly />
                <span className="text-sm font-medium text-[#18181B]">
                  Checked state
                </span>
              </label>

              <label className="flex items-center gap-2.5 select-none opacity-45 cursor-not-allowed">
                <Checkbox checked={false} disabled />
                <span className="text-sm text-[#71717A]">
                  Disabled
                </span>
              </label>
            </div>
          </section>

          {/* 4. Badges & Tags */}
          <section id="badges" className="scroll-mt-6">
            <div className="border-b border-[#E5E7EB] pb-2 mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Badges & Tags
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

          {/* 5. Buttons */}
          <section id="buttons" className="scroll-mt-6">
            <div className="border-b border-[#E5E7EB] pb-2 mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Buttons
              </h2>
            </div>

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
              <Button variant="action" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New task
              </Button>
              <Button variant="ghost" size="sm">
                <Plus className="h-3.5 w-3.5 mr-1 text-[#2563EB]" />
                Add Project
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </section>

          {/* 6. Inputs & Search */}
          <section id="inputs" className="scroll-mt-6">
            <div className="border-b border-[#E5E7EB] pb-2 mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Inputs & Search
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <span className="text-xs font-medium text-[#71717A] block mb-1.5">
                  Quick find
                </span>
                <Input
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
                  Text input
                </span>
                <Input defaultValue="Build a portfolio website" />
              </div>
            </div>
          </section>

          {/* 7. Task Rows in Real Context */}
          <section id="task-rows" className="scroll-mt-6">
            <div className="border-b border-[#E5E7EB] pb-2 mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                Task Row Component (Exact Reference Anatomy)
              </h2>
            </div>

            <div className="max-w-2xl bg-white rounded-xl border border-[#E5E7EB] p-2 space-y-1">
              <TaskRow
                title="Daily Routine"
                completed={task2Checked}
                onCompletedChange={setTask2Checked}
                dateBadge={<Badge variant="today">Today</Badge>}
                selected={selectedTaskId === "row-1"}
                onSelect={() => setSelectedTaskId("row-1")}
              />

              <TaskRow
                title="Deep Exfoliation"
                dateBadge={<Badge variant="tomorrow">Tomorrow</Badge>}
                selected={selectedTaskId === "row-2"}
                onSelect={() => setSelectedTaskId("row-2")}
              />

              <TaskRow
                title="Gym Session - Upper Body"
                dateBadge={<Badge variant="today">Today</Badge>}
                selected={selectedTaskId === "row-3"}
                onSelect={() => setSelectedTaskId("row-3")}
                addedAgo="1h ago"
                showFolderIcon
              />

              <TaskRow
                title="Yoga Session"
                dateBadge={<Badge variant="overdue">Overdue (2 days)</Badge>}
                selected={selectedTaskId === "row-4"}
                onSelect={() => setSelectedTaskId("row-4")}
              />

              <TaskRow
                title="Complete client call notes"
                completed={task3Checked}
                onCompletedChange={setTask3Checked}
                selected={selectedTaskId === "row-5"}
                onSelect={() => setSelectedTaskId("row-5")}
                addedAgo="1h ago"
                categoryIcon={<Phone className="h-3.5 w-3.5" />}
              />
            </div>
          </section>

          {/* 8. User Profile */}
          <section id="profile" className="scroll-mt-6">
            <div className="border-b border-[#E5E7EB] pb-2 mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                User Profile
              </h2>
            </div>

            <div className="inline-flex items-center gap-3 px-3 py-2 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]">
              <Avatar initials="A" size="md" />
              <div>
                <p className="text-sm font-semibold text-[#18181B]">Abram Vaccaro</p>
                <p className="text-xs text-[#71717A]">Workspace User</p>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

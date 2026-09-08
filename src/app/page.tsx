"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { type InspectorTaskData } from "@/components/layout/inspector-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskRow } from "@/components/ui/task-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Plus, Phone, Sparkles } from "lucide-react";

const INITIAL_TASK: InspectorTaskData = {
  id: "task-1",
  title: "Daily Routine",
  projectEmoji: "😎",
  projectName: "Personal",
  dueDate: "November 3, 2024",
  dueBadge: "Today",
  status: "todo",
  assigneeName: "Abram Vaccaro",
  tags: ["Routine", "SelfCare"],
  notes:
    "My simple morning skincare steps.\nRemember to use sunscreen after moisturizing.\nCleanse, Tone\nMoisturize\nSunscreen.",
  subtasks: [
    { id: "sub-1", title: "Face Wash", completed: true },
    { id: "sub-2", title: "Apply Toner", completed: true },
    { id: "sub-3", title: "Apply Moisturizer", completed: false },
    { id: "sub-4", title: "Apply Sunscreen", completed: false },
  ],
  activity: [
    {
      id: "act-1",
      time: "11:00 AM",
      actor: "Abram Vaccaro",
      description: 'updated status to "To Do".',
    },
  ],
};

export default function HomePage() {
  const [activeView, setActiveView] = React.useState("project-personal");
  const [selectedTask, setSelectedTask] = React.useState<InspectorTaskData | null>(
    INITIAL_TASK
  );
  const [isInspectorOpen, setIsInspectorOpen] = React.useState(true);

  // Section collapse states
  const [openSkincare, setOpenSkincare] = React.useState(true);
  const [openFitness, setOpenFitness] = React.useState(true);
  const [openFamily, setOpenFamily] = React.useState(false);
  const [openGoals, setOpenGoals] = React.useState(false);

  // Task completion states
  const [t1Done, setT1Done] = React.useState(false);
  const [t2Done, setT2Done] = React.useState(false);
  const [t3Done, setT3Done] = React.useState(false);
  const [t4Done, setT4Done] = React.useState(false);
  const [t5Done, setT5Done] = React.useState(false);

  const handleSelectTask = (task: InspectorTaskData) => {
    setSelectedTask(task);
    setIsInspectorOpen(true);
  };

  return (
    <AppShell
      activeView={activeView}
      onSelectView={setActiveView}
      selectedTask={selectedTask}
      isInspectorOpen={isInspectorOpen}
      onCloseInspector={() => setIsInspectorOpen(false)}
      onStatusChange={(status) => {
        if (selectedTask) setSelectedTask({ ...selectedTask, status });
      }}
      onNotesChange={(notes) => {
        if (selectedTask) setSelectedTask({ ...selectedTask, notes });
      }}
      onSubtaskToggle={(subtaskId, completed) => {
        if (selectedTask) {
          setSelectedTask({
            ...selectedTask,
            subtasks: selectedTask.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, completed } : s
            ),
          });
        }
      }}
    >
      {/* Canvas Top Bar (Starts right after sidebar) */}
      <div className="h-11 px-8 border-b border-[#E5E7EB] flex items-center justify-between shrink-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            Sort: Newest
          </Button>
          <Button variant="outline" size="sm">
            Filter: Unread
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#71717A]">
          <a
            href="/ui-kit"
            className="text-xs font-semibold text-[#2563EB] hover:underline"
          >
            Open UI Kit Playground →
          </a>
        </div>
      </div>

      {/* Canvas Content Container */}
      <div className="flex-1 overflow-y-auto px-8 py-8 max-w-3xl space-y-8">
        {/* Big Display Header */}
        <div className="space-y-3">
          <div className="text-3xl select-none">😎</div>
          <h1 className="text-3xl font-bold tracking-tight text-[#18181B]">
            Personal
          </h1>

          <div>
            <Button
              variant="action"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              className="-ml-2.5"
            >
              New task
            </Button>
          </div>
        </div>

        {/* Section 1: Skincare */}
        <div className="space-y-1.5">
          <SectionHeader
            title="Skincare"
            count={4}
            isOpen={openSkincare}
            onToggle={() => setOpenSkincare(!openSkincare)}
          />

          {openSkincare && (
            <div className="space-y-0.5 pt-1">
              <TaskRow
                title="Daily Routine"
                completed={t1Done}
                onCompletedChange={setT1Done}
                dateBadge={<Badge variant="today">Today</Badge>}
                selected={selectedTask?.id === "task-1" && isInspectorOpen}
                onSelect={() => handleSelectTask(INITIAL_TASK)}
              />

              <TaskRow
                title="Deep Exfoliation"
                completed={t2Done}
                onCompletedChange={setT2Done}
                dateBadge={<Badge variant="tomorrow">Tomorrow</Badge>}
                selected={selectedTask?.id === "task-2" && isInspectorOpen}
                onSelect={() =>
                  handleSelectTask({
                    id: "task-2",
                    title: "Deep Exfoliation",
                    projectEmoji: "😎",
                    projectName: "Personal",
                    dueDate: "November 4, 2024",
                    dueBadge: "Tomorrow",
                    status: "todo",
                    assigneeName: "Abram Vaccaro",
                    tags: ["Routine", "Skincare"],
                    notes: "Use AHA/BHA gentle exfoliating serum.",
                    subtasks: [],
                    activity: [],
                  })
                }
              />
            </div>
          )}
        </div>

        {/* Section 2: Fitness */}
        <div className="space-y-1.5">
          <SectionHeader
            title="Fitness"
            count={3}
            emoji="🏋️"
            isOpen={openFitness}
            onToggle={() => setOpenFitness(!openFitness)}
          />

          {openFitness && (
            <div className="space-y-0.5 pt-1">
              <TaskRow
                title="5km Run"
                completed={t3Done}
                onCompletedChange={setT3Done}
                dateBadge={<Badge variant="tomorrow">Saturday</Badge>}
                selected={selectedTask?.id === "task-3" && isInspectorOpen}
                onSelect={() =>
                  handleSelectTask({
                    id: "task-3",
                    title: "5km Run",
                    projectEmoji: "😎",
                    projectName: "Personal",
                    dueDate: "November 9, 2024",
                    dueBadge: "Saturday",
                    status: "todo",
                    assigneeName: "Abram Vaccaro",
                    tags: ["Fitness", "Cardio"],
                    notes: "Target pace: 5:30/km.",
                    subtasks: [],
                    activity: [],
                  })
                }
              />

              <TaskRow
                title="Gym Session - Upper Body"
                completed={t4Done}
                onCompletedChange={setT4Done}
                dateBadge={<Badge variant="today">Today</Badge>}
                selected={selectedTask?.id === "task-4" && isInspectorOpen}
                onSelect={() =>
                  handleSelectTask({
                    id: "task-4",
                    title: "Gym Session - Upper Body",
                    projectEmoji: "😎",
                    projectName: "Personal",
                    dueDate: "November 3, 2024",
                    dueBadge: "Today",
                    status: "in_progress",
                    assigneeName: "Abram Vaccaro",
                    tags: ["Fitness", "Gym"],
                    notes: "Bench press, Incline dumbbell press, Pull-ups.",
                    subtasks: [],
                    activity: [],
                  })
                }
              />

              <TaskRow
                title="Yoga Session"
                completed={t5Done}
                onCompletedChange={setT5Done}
                dateBadge={<Badge variant="overdue">Overdue (2 days)</Badge>}
                selected={selectedTask?.id === "task-5" && isInspectorOpen}
                onSelect={() =>
                  handleSelectTask({
                    id: "task-5",
                    title: "Yoga Session",
                    projectEmoji: "😎",
                    projectName: "Personal",
                    dueDate: "November 1, 2024",
                    dueBadge: "Overdue (2 days)",
                    status: "todo",
                    assigneeName: "Abram Vaccaro",
                    tags: ["Fitness", "Mobility"],
                    notes: "20 min full body recovery flow.",
                    subtasks: [],
                    activity: [],
                  })
                }
              />
            </div>
          )}
        </div>

        {/* Section 3: Home & Family (Collapsed by default) */}
        <div className="space-y-1.5">
          <SectionHeader
            title="Home & Family"
            count={6}
            emoji="🏠"
            isOpen={openFamily}
            onToggle={() => setOpenFamily(!openFamily)}
          />
        </div>

        {/* Section 4: Long-term Goals (Collapsed by default) */}
        <div className="space-y-1.5">
          <SectionHeader
            title="Long-term Goals"
            count={1}
            emoji="🎯"
            isOpen={openGoals}
            onToggle={() => setOpenGoals(!openGoals)}
          />
        </div>
      </div>
    </AppShell>
  );
}

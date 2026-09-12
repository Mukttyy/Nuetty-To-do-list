"use client";

import * as React from "react";
import { taskCollectionSchema, taskConflictResponseSchema, taskSaveResponseSchema } from "@/lib/task-schema";
import type { Project, Task } from "@/types/task";

const SAVE_DELAY_MS = 250;
const KEEPALIVE_LIMIT_BYTES = 60_000;

export type TaskSyncStatus = "loading" | "saved" | "saving" | "error" | "conflict";
interface WorkspaceSnapshot { tasks: Task[]; projects: Project[] }
const serialize = (snapshot: WorkspaceSnapshot) => JSON.stringify(snapshot);

export function useTaskSync(ownerKey: string) {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [canSync, setCanSync] = React.useState(false);
  const [syncStatus, setSyncStatus] = React.useState<TaskSyncStatus>("loading");
  const [syncError, setSyncError] = React.useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = React.useState(0);

  const workspaceRef = React.useRef<WorkspaceSnapshot>({ tasks: [], projects: [] });
  const revisionRef = React.useRef(0);
  const conflictRevisionRef = React.useRef<number | null>(null);
  const lastSavedRef = React.useRef(serialize({ tasks: [], projects: [] }));
  const saveInFlightRef = React.useRef(false);
  const saveQueuedRef = React.useRef(false);
  const saveTimerRef = React.useRef<number | null>(null);
  const canSyncRef = React.useRef(false);
  const lastSaveFailedRef = React.useRef(false);
  const mountedRef = React.useRef(true);
  const flushRef = React.useRef<() => Promise<void>>(async () => undefined);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  const flushLatest = React.useCallback(async () => {
    if (!canSyncRef.current) return;
    if (saveInFlightRef.current) {
      saveQueuedRef.current = true;
      return;
    }
    const snapshot = serialize(workspaceRef.current);
    if (snapshot === lastSavedRef.current) {
      if (mountedRef.current) setSyncStatus("saved");
      return;
    }

    saveInFlightRef.current = true;
    saveQueuedRef.current = false;
    lastSaveFailedRef.current = false;
    let saveSucceeded = false;
    if (mountedRef.current) {
      setSyncStatus("saving");
      setSyncError(null);
    }
    const requestBody = JSON.stringify({ ...workspaceRef.current, revision: revisionRef.current });

    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
        keepalive: new TextEncoder().encode(requestBody).byteLength < KEEPALIVE_LIMIT_BYTES,
      });
      if (response.status === 409) {
        const conflict = taskConflictResponseSchema.parse(await response.json());
        conflictRevisionRef.current = conflict.revision;
        canSyncRef.current = false;
        if (mountedRef.current) {
          setCanSync(false);
          setSyncStatus("conflict");
          setSyncError("These tasks were changed in another tab.");
        }
        return;
      }
      if (!response.ok) throw new Error("Changes could not be saved.");
      const result = taskSaveResponseSchema.parse(await response.json());
      revisionRef.current = result.revision;
      lastSavedRef.current = snapshot;
      saveSucceeded = true;
      if (mountedRef.current && serialize(workspaceRef.current) === snapshot) setSyncStatus("saved");
    } catch (error) {
      lastSaveFailedRef.current = true;
      if (mountedRef.current) {
        setSyncStatus("error");
        setSyncError(error instanceof Error ? error.message : "Changes could not be saved.");
      }
    } finally {
      saveInFlightRef.current = false;
      if (saveSucceeded && canSyncRef.current && (saveQueuedRef.current || serialize(workspaceRef.current) !== lastSavedRef.current)) {
        saveQueuedRef.current = false;
        queueMicrotask(() => void flushRef.current());
      }
    }
  }, []);

  React.useEffect(() => { flushRef.current = flushLatest; }, [flushLatest]);

  React.useEffect(() => {
    const controller = new AbortController();
    canSyncRef.current = false;
    async function loadWorkspace() {
      try {
        const response = await fetch("/api/tasks", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Tasks could not be loaded.");
        const collection = taskCollectionSchema.parse(await response.json());
        const nextWorkspace = { tasks: collection.tasks as Task[], projects: collection.projects as Project[] };
        workspaceRef.current = nextWorkspace;
        revisionRef.current = collection.revision;
        conflictRevisionRef.current = null;
        lastSavedRef.current = serialize(nextWorkspace);
        setTasks(nextWorkspace.tasks);
        setProjects(nextWorkspace.projects);
        canSyncRef.current = true;
        setCanSync(true);
        setSyncStatus("saved");
        setSyncError(null);
      } catch (error) {
        if (controller.signal.aborted) return;
        setSyncStatus("error");
        setSyncError(error instanceof Error ? error.message : "Tasks could not be loaded.");
      } finally {
        if (!controller.signal.aborted) setIsLoaded(true);
      }
    }
    void loadWorkspace();
    return () => controller.abort();
  }, [ownerKey, loadAttempt]);

  React.useEffect(() => {
    workspaceRef.current = { tasks, projects };
    if (!isLoaded || !canSync) return;
    const snapshot = serialize(workspaceRef.current);
    if (snapshot === lastSavedRef.current) {
      setSyncStatus("saved");
      return;
    }
    setSyncStatus("saving");
    if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null;
      void flushRef.current();
    }, SAVE_DELAY_MS);
    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [tasks, projects, isLoaded, canSync]);

  React.useEffect(() => {
    const flushBeforeLeaving = () => {
      if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      void flushRef.current();
    };
    window.addEventListener("pagehide", flushBeforeLeaving);
    return () => window.removeEventListener("pagehide", flushBeforeLeaving);
  }, []);

  const mutateTasks = React.useCallback((updater: (current: Task[]) => Task[]) => {
    setTasks((current) => {
      const next = updater(current);
      workspaceRef.current = { ...workspaceRef.current, tasks: next };
      return next;
    });
  }, []);
  const mutateProjects = React.useCallback((updater: (current: Project[]) => Project[]) => {
    setProjects((current) => {
      const next = updater(current);
      workspaceRef.current = { ...workspaceRef.current, projects: next };
      return next;
    });
  }, []);

  const retrySync = React.useCallback(() => {
    setSyncError(null);
    if (!isLoaded || !canSyncRef.current) {
      setIsLoaded(false);
      setCanSync(false);
      setSyncStatus("loading");
      setLoadAttempt((attempt) => attempt + 1);
      return;
    }
    void flushRef.current();
  }, [isLoaded]);
  const loadServerCopy = React.useCallback(() => {
    conflictRevisionRef.current = null;
    setIsLoaded(false);
    setCanSync(false);
    setSyncStatus("loading");
    setSyncError(null);
    setLoadAttempt((attempt) => attempt + 1);
  }, []);
  const keepLocalCopy = React.useCallback(() => {
    if (conflictRevisionRef.current === null) return;
    revisionRef.current = conflictRevisionRef.current;
    conflictRevisionRef.current = null;
    canSyncRef.current = true;
    setCanSync(true);
    setSyncError(null);
    setSyncStatus("saving");
    void flushRef.current();
  }, []);
  const flushNow = React.useCallback(async (): Promise<boolean> => {
    if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
    const deadline = Date.now() + 10_000;
    while (Date.now() < deadline) {
      await flushRef.current();
      if (!canSyncRef.current || lastSaveFailedRef.current) return false;
      if (!saveInFlightRef.current && serialize(workspaceRef.current) === lastSavedRef.current) return true;
      await new Promise((resolve) => window.setTimeout(resolve, 25));
    }
    return false;
  }, []);

  return { tasks, projects, isLoaded, syncStatus, syncError, mutateTasks, mutateProjects, retrySync, loadServerCopy, keepLocalCopy, flushNow };
}

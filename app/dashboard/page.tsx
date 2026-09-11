"use client";

import { useState } from "react";
import { 
  DEFAULT_EVENT, 
  INITIAL_DIVISIONS, 
  INITIAL_COMMITTEE, 
  INITIAL_TASKS, 
  INITIAL_RISKS, 
  calculateEventHealth, 
  generateActionItems 
} from "@/lib/store";
import { FestivalEvent, Division, CommitteeMember, Task, Risk } from "@/lib/types";
import { HeaderNav } from "@/components/command-center/HeaderNav";
import { EventContextBar } from "@/components/command-center/EventContextBar";
import { EventHealthBanner } from "@/components/command-center/EventHealthBanner";
import { KpiPanel } from "@/components/command-center/KpiPanel";
import { ActionNeededPanel } from "@/components/command-center/ActionNeededPanel";
import { EventManagementTab } from "@/components/command-center/EventManagementTab";
import { DivisionsTab } from "@/components/command-center/DivisionsTab";
import { CommitteeTab } from "@/components/command-center/CommitteeTab";
import { TasksTab } from "@/components/command-center/TasksTab";
import { RisksTab } from "@/components/command-center/RisksTab";
import { AuditLogTab } from "@/components/command-center/AuditLogTab";
import { Building, Users, CheckSquare, AlertTriangle } from "lucide-react";

export default function CommandCenterDashboard() {
  // State Management
  const [events, setEvents] = useState<FestivalEvent[]>([DEFAULT_EVENT]);
  const [currentEvent, setCurrentEvent] = useState<FestivalEvent>(DEFAULT_EVENT);
  const [divisions, setDivisions] = useState<Division[]>(INITIAL_DIVISIONS);
  const [committee, setCommittee] = useState<CommitteeMember[]>(INITIAL_COMMITTEE);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [risks, setRisks] = useState<Risk[]>(INITIAL_RISKS);

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "events" | "divisions" | "committee" | "tasks" | "risks" | "audit"
  >("dashboard");

  // Calculations
  const eventHealth = calculateEventHealth(tasks, risks, divisions);
  const actionItems = generateActionItems(tasks, risks, divisions);

  // Handlers for Event
  const handleSaveEvent = (updated: FestivalEvent) => {
    setCurrentEvent(updated);
    setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const handleCreateEvent = (newEvent: FestivalEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    setCurrentEvent(newEvent);
  };

  // Handlers for Divisions
  const handleAddDivision = (div: Division) => setDivisions(prev => [...prev, div]);
  const handleUpdateDivision = (div: Division) => setDivisions(prev => prev.map(d => d.id === div.id ? div : d));
  const handleDeleteDivision = (id: string) => setDivisions(prev => prev.filter(d => d.id !== id));

  // Handlers for Committee
  const handleAddMember = (m: CommitteeMember) => setCommittee(prev => [...prev, m]);
  const handleUpdateMember = (m: CommitteeMember) => setCommittee(prev => prev.map(c => c.id === m.id ? m : c));
  const handleDeleteMember = (id: string) => setCommittee(prev => prev.filter(c => c.id !== id));

  // Handlers for Tasks
  const handleAddTask = (t: Task) => setTasks(prev => [t, ...prev]);
  const handleUpdateTask = (t: Task) => setTasks(prev => prev.map(tk => tk.id === t.id ? t : tk));
  const handleDeleteTask = (id: string) => setTasks(prev => prev.filter(tk => tk.id !== id));

  // Handlers for Risks
  const handleAddRisk = (r: Risk) => setRisks(prev => [r, ...prev]);
  const handleUpdateRisk = (r: Risk) => setRisks(prev => prev.map(rk => rk.id === r.id ? r : rk));
  const handleDeleteRisk = (id: string) => setRisks(prev => prev.filter(rk => rk.id !== id));

  // Navigation handler from Action Needed Panel
  const handleNavigateTab = (tab: string, targetId?: string) => {
    setActiveTab(tab as any);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Header & Global Navigation */}
      <HeaderNav
        currentEvent={currentEvent}
        events={events}
        onSelectEvent={setCurrentEvent}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole="Ketua Panitia SaaS"
        userName="H. Zaki"
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Event Context Header */}
        <EventContextBar event={currentEvent} />

        {/* Tab 1: Command Center Dashboard (Default Control Center) */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            {/* Event Health & Readiness Banner */}
            <EventHealthBanner health={eventHealth} />

            {/* 5 Core KPIs */}
            <KpiPanel
              event={currentEvent}
              readinessPercentage={eventHealth.readiness_percentage}
              tasks={tasks}
            />

            {/* CEO Action Panel: WHAT NEEDS MY ATTENTION? */}
            <ActionNeededPanel
              items={actionItems}
              onNavigateTab={handleNavigateTab}
            />

            {/* Overview Grids: Divisions & Urgent Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Division Overview Card */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Building className="w-5 h-5 text-teal-400" /> Status Divisi Panitia
                  </h3>
                  <button
                    onClick={() => setActiveTab("divisions")}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    Kelola Divisi &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {divisions.slice(0, 4).map((d) => {
                    const total = d.total_tasks || 0;
                    const completed = d.completed_tasks || 0;
                    const pct = total ? Math.round((completed / total) * 100) : 0;

                    return (
                      <div key={d.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">Divisi {d.name}</span>
                          <span className="font-mono text-slate-400">{completed}/{total} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${pct >= 80 ? "bg-emerald-400" : pct >= 50 ? "bg-teal-400" : "bg-amber-400"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tasks Engine Quick Card */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-emerald-400" /> Task Critical & Overdue
                  </h3>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    Buka Task Engine &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {tasks
                    .filter(t => t.priority === "CRITICAL" || t.is_overdue || t.status === "BLOCKED")
                    .slice(0, 3)
                    .map((t) => (
                      <div key={t.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{t.title}</span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-rose-500 text-slate-950">
                              {t.priority}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">PIC: {t.pic_name} • Divisi {t.division_name}</div>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-amber-400 font-bold shrink-0">
                          {t.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Events Configuration */}
        {activeTab === "events" && (
          <EventManagementTab
            currentEvent={currentEvent}
            events={events}
            onSaveEvent={handleSaveEvent}
            onCreateEvent={handleCreateEvent}
          />
        )}

        {/* Tab 3: Divisions */}
        {activeTab === "divisions" && (
          <DivisionsTab
            divisions={divisions}
            onAddDivision={handleAddDivision}
            onUpdateDivision={handleUpdateDivision}
            onDeleteDivision={handleDeleteDivision}
          />
        )}

        {/* Tab 4: Committee */}
        {activeTab === "committee" && (
          <CommitteeTab
            committee={committee}
            divisions={divisions}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {/* Tab 5: Tasks Engine */}
        {activeTab === "tasks" && (
          <TasksTab
            tasks={tasks}
            divisions={divisions}
            committee={committee}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {/* Tab 6: Risk Matrix */}
        {activeTab === "risks" && (
          <RisksTab
            risks={risks}
            committee={committee}
            onAddRisk={handleAddRisk}
            onUpdateRisk={handleUpdateRisk}
            onDeleteRisk={handleDeleteRisk}
          />
        )}

        {/* Tab 7: Audit Logs */}
        {activeTab === "audit" && <AuditLogTab />}
      </main>
    </div>
  );
}

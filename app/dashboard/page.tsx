"use client";

import { useState } from "react";
import { 
  DEFAULT_EVENT, 
  INITIAL_DIVISIONS, 
  INITIAL_COMMITTEE, 
  INITIAL_TASKS, 
  INITIAL_RISKS, 
  INITIAL_COMPETITIONS,
  INITIAL_PARTICIPANTS,
  INITIAL_REGISTRATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_TRAIL,
  calculateEventHealth, 
  generateActionItems 
} from "@/lib/store";
import { 
  FestivalEvent, 
  Division, 
  CommitteeMember, 
  Task, 
  Risk, 
  Competition,
  Participant,
  Registration,
  NotificationItem,
  AuditTrailItem,
  ParticipantLifecycleStatus,
  RegistrationStatus
} from "@/lib/types";
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
import { CompetitionsTab } from "@/components/command-center/CompetitionsTab";
import { ParticipantsTab } from "@/components/command-center/ParticipantsTab";
import { ParticipantDashboardTab } from "@/components/command-center/ParticipantDashboardTab";
import { NotificationsTab } from "@/components/command-center/NotificationsTab";
import { AuditTrailTab } from "@/components/command-center/AuditTrailTab";
import { Building, CheckSquare, Award, UserCheck } from "lucide-react";

export default function CommandCenterDashboard() {
  // State Management (Part 1 + Part 2)
  const [events, setEvents] = useState<FestivalEvent[]>([DEFAULT_EVENT]);
  const [currentEvent, setCurrentEvent] = useState<FestivalEvent>(DEFAULT_EVENT);
  const [divisions, setDivisions] = useState<Division[]>(INITIAL_DIVISIONS);
  const [committee, setCommittee] = useState<CommitteeMember[]>(INITIAL_COMMITTEE);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [risks, setRisks] = useState<Risk[]>(INITIAL_RISKS);

  // Part 2 States
  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditItems, setAuditItems] = useState<AuditTrailItem[]>(INITIAL_AUDIT_TRAIL);

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "events" | "competitions" | "participants" | "my_portal" | "divisions" | "committee" | "tasks" | "risks" | "notifications" | "audit"
  >("dashboard");

  // Calculations
  const eventHealth = calculateEventHealth(tasks, risks, divisions);
  const actionItems = generateActionItems(tasks, risks, divisions);
  const unreadNotifCount = notifications.filter(n => !n.is_read).length;

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

  // Handlers for Competitions (Part 2)
  const handleAddCompetition = (cmp: Competition) => {
    setCompetitions(prev => [...prev, cmp]);
    addAuditLog("Panitia (Acara)", "CREATED_COMPETITION", cmp.name, `Membuat cabang lomba baru ${cmp.name}`);
  };
  const handleUpdateCompetition = (cmp: Competition) => {
    setCompetitions(prev => prev.map(c => c.id === cmp.id ? cmp : c));
    addAuditLog("Panitia (Acara)", "UPDATED_COMPETITION", cmp.name, `Memperbarui status/juknis ${cmp.name}`);
  };
  const handleDeleteCompetition = (id: string) => setCompetitions(prev => prev.filter(c => c.id !== id));

  // Handlers for Participants & Registrations (Part 2)
  const handleAddParticipant = (p: Participant, competitionIds: string[]) => {
    setParticipants(prev => [p, ...prev]);

    // Create 1 Participant -> N Registrations
    const newRegs: Registration[] = competitionIds.map((cId, idx) => {
      const cmp = competitions.find(c => c.id === cId);
      return {
        id: `reg-${Date.now()}-${idx}`,
        participant_id: p.id,
        participant_name: p.name,
        competition_id: cId,
        competition_name: cmp?.name || "Lomba",
        registration_number: `REG-2026-${Math.floor(100 + Math.random() * 900)}`,
        status: "REGISTERED",
        payment_status: "FREE",
        registered_at: new Date().toISOString(),
      };
    });

    setRegistrations(prev => [...newRegs, ...prev]);
    addAuditLog("Official / Peserta", "CREATED_PARTICIPANT", p.name, `Registrasi peserta baru ${p.name} (${p.group_name})`);
  };

  const handleUpdateParticipantStatus = (participantId: string, status: ParticipantLifecycleStatus) => {
    setParticipants(prev => prev.map(p => p.id === participantId ? { ...p, status } : p));
  };

  const handleUpdateRegistrationStatus = (registrationId: string, status: RegistrationStatus) => {
    setRegistrations(prev => prev.map(r => {
      if (r.id === registrationId) {
        return {
          ...r,
          status,
          verified_at: status === "VERIFICATION" || status === "APPROVED" ? new Date().toISOString() : r.verified_at,
          approved_at: status === "APPROVED" ? new Date().toISOString() : r.approved_at,
        };
      }
      return r;
    }));

    const reg = registrations.find(r => r.id === registrationId);
    if (reg) {
      addAuditLog("Siti Rahma (Registrasi)", `REGISTRATION_${status}`, `${reg.participant_name} (${reg.registration_number})`, `Status pendaftaran diperbarui ke ${status}`);
    }
  };

  const addAuditLog = (who: string, did_what: string, on_what: string, details: string) => {
    const newLog: AuditTrailItem = {
      id: `aud-${Date.now()}`,
      who,
      did_what,
      when: new Date().toLocaleString("id-ID"),
      on_what,
      details,
    };
    setAuditItems(prev => [newLog, ...prev]);
  };

  const handleMarkAllNotifAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

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
        userRole="Panitia & System Command"
        userName="H. Zaki"
        unreadCount={unreadNotifCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Event Context Header */}
        <EventContextBar event={currentEvent} />

        {/* Tab 1: Command Center Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            <EventHealthBanner health={eventHealth} />

            <KpiPanel
              event={currentEvent}
              readinessPercentage={eventHealth.readiness_percentage}
              tasks={tasks}
              participants={participants}
              competitions={competitions}
            />

            <ActionNeededPanel
              items={actionItems}
              onNavigateTab={handleNavigateTab}
            />

            {/* Overview Grids: Participants & Competitions Quick Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Participant Engine Summary */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-teal-400" /> Ringkasan Registrasi Peserta
                  </h3>
                  <button
                    onClick={() => setActiveTab("participants")}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    Buka Engine Peserta &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {participants.slice(0, 4).map((p) => (
                    <div key={p.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{p.group_name} • {p.category}</div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                        p.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" : "bg-teal-500/20 text-teal-300"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitions Summary */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" /> Cabang Perlombaan Aktif
                  </h3>
                  <button
                    onClick={() => setActiveTab("competitions")}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    Kelola Lomba &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {competitions.slice(0, 4).map((c) => (
                    <div key={c.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-white">{c.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{c.category} • Kuota: {c.registered_count || 0}/{c.quota}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900 border border-slate-800 text-emerald-400`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Competitions */}
        {activeTab === "competitions" && (
          <CompetitionsTab
            competitions={competitions}
            onAddCompetition={handleAddCompetition}
            onUpdateCompetition={handleUpdateCompetition}
            onDeleteCompetition={handleDeleteCompetition}
          />
        )}

        {/* Tab 3: Participants */}
        {activeTab === "participants" && (
          <ParticipantsTab
            participants={participants}
            registrations={registrations}
            competitions={competitions}
            onAddParticipant={handleAddParticipant}
            onUpdateParticipantStatus={handleUpdateParticipantStatus}
            onUpdateRegistrationStatus={handleUpdateRegistrationStatus}
          />
        )}

        {/* Tab 4: Participant Portal */}
        {activeTab === "my_portal" && (
          <ParticipantDashboardTab
            registrations={registrations}
            competitions={competitions}
          />
        )}

        {/* Tab 5: Events */}
        {activeTab === "events" && (
          <EventManagementTab
            currentEvent={currentEvent}
            events={events}
            onSaveEvent={handleSaveEvent}
            onCreateEvent={handleCreateEvent}
          />
        )}

        {/* Tab 6: Divisions */}
        {activeTab === "divisions" && (
          <DivisionsTab
            divisions={divisions}
            onAddDivision={handleAddDivision}
            onUpdateDivision={handleUpdateDivision}
            onDeleteDivision={handleDeleteDivision}
          />
        )}

        {/* Tab 7: Committee */}
        {activeTab === "committee" && (
          <CommitteeTab
            committee={committee}
            divisions={divisions}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {/* Tab 8: Tasks Engine */}
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

        {/* Tab 9: Risk Matrix */}
        {activeTab === "risks" && (
          <RisksTab
            risks={risks}
            committee={committee}
            onAddRisk={handleAddRisk}
            onUpdateRisk={handleUpdateRisk}
            onDeleteRisk={handleDeleteRisk}
          />
        )}

        {/* Tab 10: Notifications */}
        {activeTab === "notifications" && (
          <NotificationsTab
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotifAsRead}
          />
        )}

        {/* Tab 11: Audit Trail */}
        {activeTab === "audit" && <AuditTrailTab auditItems={auditItems} />}
      </main>
    </div>
  );
}

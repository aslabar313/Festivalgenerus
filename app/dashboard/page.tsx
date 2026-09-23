"use client";

import { useState, useEffect } from "react";
import { 
  DEFAULT_EVENT, 
  INITIAL_DIVISIONS, 
  INITIAL_COMMITTEE, 
  INITIAL_TASKS, 
  INITIAL_RISKS, 
  INITIAL_COMPETITIONS,
  INITIAL_PARTICIPANTS,
  INITIAL_REGISTRATIONS,
  INITIAL_CRITERIA,
  INITIAL_COMPETITION_JUDGES,
  INITIAL_SCORES,
  INITIAL_VENUES,
  INITIAL_SCHEDULES,
  INITIAL_INCIDENTS,
  INITIAL_INVENTORY,
  INITIAL_TRANSACTIONS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_TRAIL,
  INITIAL_MUSYAWAROH,
  calculateEventHealth, 
  generateActionItems,
  detectScheduleConflicts 
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
  Criterion,
  CompetitionJudge,
  ScoreItem,
  Venue,
  ScheduleItem,
  IncidentItem,
  InventoryItem,
  TransactionItem,
  DocumentItem,
  NotificationItem,
  AuditTrailItem,
  MusyawarohItem
} from "@/lib/types";
import { getAllowedTabsForRole, isFullAccessRole, EventPhaseMode } from "@/lib/rbac";
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
import { JudgeExperienceTab } from "@/components/command-center/JudgeExperienceTab";
import { ScoringResultsTab } from "@/components/command-center/ScoringResultsTab";
import { SchedulesTab } from "@/components/command-center/SchedulesTab";
import { LiveEventTab } from "@/components/command-center/LiveEventTab";
import { IncidentsTab } from "@/components/command-center/IncidentsTab";
import { LogisticsTab } from "@/components/command-center/LogisticsTab";
import { FinanceTab } from "@/components/command-center/FinanceTab";
import { DocumentsTab } from "@/components/command-center/DocumentsTab";
import { ReportsTab } from "@/components/command-center/ReportsTab";
import { MusyawarohTab } from "@/components/command-center/MusyawarohTab";
import { EventCountdownTab } from "@/components/command-center/EventCountdownTab";
import { Star, Trophy, Calendar, ShieldAlert, DollarSign, Package, AlertTriangle, Flame, Clock, Sliders } from "lucide-react";

export default function CommandCenterDashboard() {
  const [events, setEvents] = useState<FestivalEvent[]>([DEFAULT_EVENT]);
  const [currentEvent, setCurrentEvent] = useState<FestivalEvent>(DEFAULT_EVENT);
  const [divisions, setDivisions] = useState<Division[]>(INITIAL_DIVISIONS);
  const [committee, setCommittee] = useState<CommitteeMember[]>(INITIAL_COMMITTEE);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [risks, setRisks] = useState<Risk[]>(INITIAL_RISKS);

  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [criteria, setCriteria] = useState<Criterion[]>(INITIAL_CRITERIA);
  const [competitionJudges, setCompetitionJudges] = useState<CompetitionJudge[]>(INITIAL_COMPETITION_JUDGES);
  const [scores, setScores] = useState<ScoreItem[]>(INITIAL_SCORES);
  const [venues, setVenues] = useState<Venue[]>(INITIAL_VENUES);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [incidents, setIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditItems, setAuditItems] = useState<AuditTrailItem[]>(INITIAL_AUDIT_TRAIL);
  const [musyawarohList, setMusyawarohList] = useState<MusyawarohItem[]>(INITIAL_MUSYAWAROH);

  const [eventPhaseMode, setEventPhaseMode] = useState<EventPhaseMode>("REGISTRATION_OPEN");

  const [currentUser, setCurrentUser] = useState<{ full_name: string; role: string }>({
    full_name: "Super Admin PPG",
    role: "superadmin",
  });

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "countdown" | "live_event" | "musyawaroh" | "incidents" | "judge_panel" | "scoring_results" | "schedules" | "events" | "competitions" | "participants" | "my_portal" | "divisions" | "committee" | "tasks" | "risks" | "logistics" | "finance" | "documents" | "reports" | "notifications" | "audit"
  >("dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("fg_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.full_name && parsed.role) {
            setCurrentUser({ full_name: parsed.full_name, role: parsed.role });
            
            const allowed = getAllowedTabsForRole(parsed.role, eventPhaseMode);
            if (allowed.length > 0 && !allowed.includes(activeTab)) {
              setActiveTab(allowed[0] as any);
            }
          }
        }
      } catch (e) {
        console.error("Failed to parse fg_user from localStorage", e);
      }
    }
  }, [eventPhaseMode]);

  // Calculations
  const eventHealth = calculateEventHealth(tasks, risks, divisions, participants, competitionJudges, venues, inventory);
  const actionItems = generateActionItems(tasks, risks, divisions);
  const conflicts = detectScheduleConflicts(schedules, competitionJudges, registrations);
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

  // Handlers for Competitions
  const handleAddCompetition = (cmp: Competition) => {
    setCompetitions(prev => [...prev, cmp]);
    addAuditLog("Panitia (Acara)", "CREATED_COMPETITION", cmp.name, `Membuat cabang lomba baru ${cmp.name}`);
  };
  const handleUpdateCompetition = (cmp: Competition) => {
    setCompetitions(prev => prev.map(c => c.id === cmp.id ? cmp : c));
    addAuditLog("Panitia (Acara)", "UPDATED_COMPETITION", cmp.name, `Memperbarui status/juknis ${cmp.name}`);
  };
  const handleDeleteCompetition = (id: string) => setCompetitions(prev => prev.filter(c => c.id !== id));

  // Handlers for Participants & Check-in
  const handleAddParticipant = (p: Participant, competitionIds: string[]) => {
    setParticipants(prev => [p, ...prev]);
    const newRegs: Registration[] = competitionIds.map(cId => {
      const comp = competitions.find(c => c.id === cId);
      return {
        id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        participant_id: p.id,
        participant_name: p.name,
        competition_id: cId,
        competition_name: comp?.name || "Lomba",
        registration_number: `REG-2026-${Math.floor(100 + Math.random() * 900)}`,
        status: "APPROVED",
        payment_status: "FREE",
        registered_at: new Date().toISOString(),
      };
    });
    setRegistrations(prev => [...newRegs, ...prev]);
    addAuditLog(currentUser.full_name, "REGISTER_PARTICIPANT", p.name, `Mendaftarkan peserta ${p.name} ke ${competitionIds.length} cabang lomba`);
  };

  const handleUpdateParticipantStatus = (id: string, status: Participant["status"]) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleCheckInParticipant = (participantId: string) => {
    setParticipants(prev => prev.map(p => p.id === participantId ? { ...p, status: "CHECK_IN" } : p));
    addAuditLog("Loket Registrasi", "CHECK_IN_PARTICIPANT", participantId, `Check-in kehadiran lokasi peserta`);
  };

  // Handlers for Scoring & Judges
  const handleSaveScores = (newScores: ScoreItem[]) => {
    setScores(prev => {
      const filtered = prev.filter(s => 
        !newScores.some(ns => ns.competition_id === s.competition_id && ns.participant_id === s.participant_id && ns.criterion_id === s.criterion_id && ns.judge_id === s.judge_id)
      );
      return [...filtered, ...newScores];
    });
    addAuditLog("Dewan Juri", "SUBMIT_SCORES", newScores[0]?.competition_id || "Lomba", `Penilaian skor juri dikirim & dikunci.`);
  };

  const handleUnlockScores = (competitionId: string, participantId: string) => {
    setScores(prev => prev.map(s => (s.competition_id === competitionId && s.participant_id === participantId) ? { ...s, is_locked: false } : s));
    addAuditLog(currentUser.full_name, "UNLOCK_SCORE", `${competitionId}/${participantId}`, `Superadmin membuka kunci nilai peserta`);
  };

  // Handlers for Schedules
  const handleAddSchedule = (sch: ScheduleItem) => setSchedules(prev => [...prev, sch]);
  const handleDeleteSchedule = (id: string) => setSchedules(prev => prev.filter(s => s.id !== id));

  // Handlers for Part 4 (Incidents, Inventory, Finance, Documents)
  const handleAddIncident = (inc: IncidentItem) => setIncidents(prev => [inc, ...prev]);
  const handleUpdateIncidentStatus = (id: string, status: IncidentItem["status"]) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status, resolved_at: status === "RESOLVED" ? new Date().toISOString() : i.resolved_at } : i));
  };

  const handleAddInventory = (item: InventoryItem) => setInventory(prev => [...prev, item]);
  const handleUpdateInventoryStatus = (id: string, status: InventoryItem["status"]) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const handleAddTransaction = (trx: TransactionItem) => {
    setTransactions(prev => [trx, ...prev]);
    addAuditLog("Bendahara Panitia", "CREATE_TRANSACTION", trx.description, `Pencatatan kas ${trx.type} Rp ${trx.amount}`);
  };
  const handleApproveTransaction = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: "APPROVED", approved_by: "Anisa Fitri (Bendahara)" } : t));
    addAuditLog("Anisa Fitri (Bendahara)", "APPROVE_TRANSACTION", id, `Persetujuan transaksi keuangan kas`);
  };

  const handleAddDocument = (doc: DocumentItem) => {
    setDocuments(prev => [doc, ...prev]);
    addAuditLog("Panitia Sekretariat", "UPLOAD_DOCUMENT", doc.name, `Unggah dokumen arsip ${doc.category}`);
  };

  const handleAddMusyawaroh = (item: MusyawarohItem) => {
    setMusyawarohList(prev => [item, ...prev]);
    addAuditLog(item.leader_name, "CREATED_MUSYAWAROH", item.title, `Pencatatan notulensi musyawaroh baru`);
  };

  const handleAddTaskFromMusyawaroh = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    addAuditLog(currentUser.full_name, "ASSIGNED_MUSYAWAROH_TASK", task.title, `Penugasan instruksi musyawaroh ke Divisi ${task.division_name}`);
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

  const handleMarkAllNotifAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  const handleNavigateTab = (tab: string, targetId?: string) => setActiveTab(tab as any);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Header & Global Navigation */}
      <HeaderNav
        currentEvent={currentEvent}
        events={events}
        onSelectEvent={setCurrentEvent}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={currentUser.role}
        userName={currentUser.full_name}
        unreadCount={unreadNotifCount}
        conflictCount={conflicts.length}
        eventPhaseMode={eventPhaseMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Event Context Header & Phase Switcher */}
        <div className="space-y-3">
          <EventContextBar event={currentEvent} />

          {/* Phase Control Bar for Admin / Organizers */}
          {isFullAccessRole(currentUser.role) && (
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Sliders className="w-4 h-4 text-emerald-400" /> Mode Alur Pendaftaran & Event:
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEventPhaseMode("REGISTRATION_OPEN")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    eventPhaseMode === "REGISTRATION_OPEN"
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  1. Pendaftaran Buka
                </button>
                <button
                  onClick={() => setEventPhaseMode("COUNTDOWN_ONLY")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    eventPhaseMode === "COUNTDOWN_ONLY"
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  2. Pendaftaran Tutup (Countdown)
                </button>
                <button
                  onClick={() => setEventPhaseMode("EVENT_DAY_LIVE")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    eventPhaseMode === "EVENT_DAY_LIVE"
                      ? "bg-teal-400 text-slate-950 shadow-md shadow-teal-400/20"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  3. Hari-H (Live Score)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab Countdown View for Admin Kelompok & Admin Desa */}
        {activeTab === "countdown" && (
          <EventCountdownTab
            event={currentEvent}
            userRole={currentUser.role}
            userName={currentUser.full_name}
          />
        )}

        {/* Tab 1: Command Center Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            {conflicts.length > 0 && (
              <div className="p-4 bg-rose-950/60 border-2 border-rose-600 rounded-2xl flex items-center justify-between gap-4 text-rose-100 shadow-xl shadow-rose-950/40">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">🔴 CRITICAL: {conflicts.length} SCHEDULING CONFLICTS TERDETEKSI</h3>
                    <p className="text-xs text-rose-300">Terdapat tumpang tindih waktu pada panggung venue, dewan juri, atau peserta.</p>
                  </div>
                </div>
                <button onClick={() => setActiveTab("schedules")} className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black rounded-xl text-xs shrink-0 shadow-md shadow-rose-500/30">
                  RESOLVE NOW &rarr;
                </button>
              </div>
            )}

            <EventHealthBanner health={eventHealth} />

            <KpiPanel
              event={currentEvent}
              readinessPercentage={eventHealth.readiness_percentage}
              tasks={tasks}
              participants={participants}
              competitions={competitions}
            />

            <ActionNeededPanel items={actionItems} onNavigateTab={handleNavigateTab} />
          </div>
        )}

        {/* Tab Musyawaroh */}
        {activeTab === "musyawaroh" && (
          <MusyawarohTab
            musyawarohList={musyawarohList}
            divisions={divisions}
            committee={committee}
            currentUserUsername={currentUser.full_name}
            currentUserRole={currentUser.role}
            onAddMusyawaroh={handleAddMusyawaroh}
            onAddTaskFromMusyawaroh={handleAddTaskFromMusyawaroh}
          />
        )}

        {/* Tab 2: Live Event (Hari-H) */}
        {activeTab === "live_event" && (
          <LiveEventTab
            participants={participants}
            competitions={competitions}
            schedules={schedules}
            incidents={incidents}
            judges={competitionJudges}
            onCheckInParticipant={handleCheckInParticipant}
          />
        )}

        {/* Tab 3: Incidents */}
        {activeTab === "incidents" && (
          <IncidentsTab
            incidents={incidents}
            committee={committee}
            onAddIncident={handleAddIncident}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
          />
        )}

        {/* Tab 4: Judge Panel */}
        {activeTab === "judge_panel" && (
          <JudgeExperienceTab
            competitions={competitions}
            participants={participants}
            criteria={criteria}
            scores={scores}
            judges={competitionJudges}
            onSaveScores={handleSaveScores}
            onUnlockScores={handleUnlockScores}
          />
        )}

        {/* Tab 5: Scoring Results */}
        {activeTab === "scoring_results" && (
          <ScoringResultsTab
            competitions={competitions}
            participants={participants}
            criteria={criteria}
            scores={scores}
          />
        )}

        {/* Tab 6: Schedules */}
        {activeTab === "schedules" && (
          <SchedulesTab
            schedules={schedules}
            venues={venues}
            competitions={competitions}
            competitionJudges={competitionJudges}
            registrations={registrations}
            onAddSchedule={handleAddSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            onAddVenue={(v) => setVenues(prev => [...prev, v])}
          />
        )}

        {/* Tab 7: Competitions */}
        {activeTab === "competitions" && (
          <CompetitionsTab
            competitions={competitions}
            onAddCompetition={handleAddCompetition}
            onUpdateCompetition={handleUpdateCompetition}
            onDeleteCompetition={handleDeleteCompetition}
          />
        )}

        {/* Tab 8: Participants Engine */}
        {activeTab === "participants" && (
          <ParticipantsTab
            participants={participants}
            competitions={competitions}
            registrations={registrations}
            onAddParticipant={handleAddParticipant}
            onUpdateParticipantStatus={handleUpdateParticipantStatus}
            onUpdateRegistrationStatus={(rId, status) => setRegistrations(prev => prev.map(r => r.id === rId ? { ...r, status } : r))}
          />
        )}

        {/* Tab 9: Logistics */}
        {activeTab === "logistics" && (
          <LogisticsTab
            inventory={inventory}
            onAddInventory={handleAddInventory}
            onUpdateInventoryStatus={handleUpdateInventoryStatus}
          />
        )}

        {/* Tab 10: Finance (Kas) */}
        {activeTab === "finance" && (
          <FinanceTab
            transactions={transactions}
            userRole={currentUser.role}
            onAddTransaction={handleAddTransaction}
            onApproveTransaction={handleApproveTransaction}
          />
        )}

        {/* Tab 11: Documents */}
        {activeTab === "documents" && (
          <DocumentsTab
            documents={documents}
            onAddDocument={handleAddDocument}
          />
        )}

        {/* Tab 12: Reports */}
        {activeTab === "reports" && (
          <ReportsTab
            event={currentEvent}
            participants={participants}
            competitions={competitions}
            transactions={transactions}
            tasks={tasks}
            incidents={incidents}
          />
        )}

        {/* Tab 13: Portal Peserta */}
        {activeTab === "my_portal" && (
          <ParticipantDashboardTab
            registrations={registrations}
            competitions={competitions}
          />
        )}

        {/* Tab 14: Events */}
        {activeTab === "events" && (
          <EventManagementTab
            currentEvent={currentEvent}
            events={events}
            onSaveEvent={handleSaveEvent}
            onCreateEvent={handleCreateEvent}
          />
        )}

        {/* Tab 15: Divisions */}
        {activeTab === "divisions" && (
          <DivisionsTab
            divisions={divisions}
            onAddDivision={handleAddDivision}
            onUpdateDivision={handleUpdateDivision}
            onDeleteDivision={handleDeleteDivision}
          />
        )}

        {/* Tab 16: Committee */}
        {activeTab === "committee" && (
          <CommitteeTab
            committee={committee}
            divisions={divisions}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {/* Tab 17: Tasks Engine */}
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

        {/* Tab 18: Risk Matrix */}
        {activeTab === "risks" && (
          <RisksTab
            risks={risks}
            committee={committee}
            onAddRisk={handleAddRisk}
            onUpdateRisk={handleUpdateRisk}
            onDeleteRisk={handleDeleteRisk}
          />
        )}

        {/* Tab 19: Notifications */}
        {activeTab === "notifications" && (
          <NotificationsTab
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllNotifAsRead}
          />
        )}

        {/* Tab 20: Audit Trail */}
        {activeTab === "audit" && <AuditTrailTab auditItems={auditItems} />}
      </main>
    </div>
  );
}

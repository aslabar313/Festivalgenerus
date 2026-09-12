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
  ParticipantLifecycleStatus,
  RegistrationStatus,
  MusyawarohItem
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
import { Star, Trophy, Calendar, ShieldAlert, DollarSign, Package, AlertTriangle, Flame } from "lucide-react";

export default function CommandCenterDashboard() {
  // State Management (Part 1 + Part 2 + Part 3 + Part 4)
  const [events, setEvents] = useState<FestivalEvent[]>([DEFAULT_EVENT]);
  const [currentEvent, setCurrentEvent] = useState<FestivalEvent>(DEFAULT_EVENT);
  const [divisions, setDivisions] = useState<Division[]>(INITIAL_DIVISIONS);
  const [committee, setCommittee] = useState<CommitteeMember[]>(INITIAL_COMMITTEE);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [risks, setRisks] = useState<Risk[]>(INITIAL_RISKS);

  // Part 2 & Part 3 & Part 4 States
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

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "live_event" | "musyawaroh" | "incidents" | "judge_panel" | "scoring_results" | "schedules" | "events" | "competitions" | "participants" | "my_portal" | "divisions" | "committee" | "tasks" | "risks" | "logistics" | "finance" | "documents" | "reports" | "notifications" | "audit"
  >("dashboard");

  const [currentUser, setCurrentUser] = useState<{ full_name: string; role: string }>({
    full_name: "Super Admin PPG",
    role: "Superadmin (PPG Magetan Timur)",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("fg_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.full_name && parsed.role) {
            setCurrentUser({ full_name: parsed.full_name, role: parsed.role });
          }
        }
      } catch (e) {
        console.error("Failed to parse fg_user from localStorage", e);
      }
    }
  }, []);

  // Calculations
  const eventHealth = calculateEventHealth(tasks, risks, divisions);
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

  const handleCheckInParticipant = (participantId: string) => {
    setParticipants(prev => prev.map(p => p.id === participantId ? { ...p, status: "CHECK_IN" } : p));
    const p = participants.find(p => p.id === participantId);
    addAuditLog("Loket Registrasi Hari-H", "PARTICIPANT_CHECK_IN", p?.name || participantId, `Check-in fisik lokasi & penyerahan nomor dada`);
  };

  const handleUpdateRegistrationStatus = (registrationId: string, status: RegistrationStatus) => {
    setRegistrations(prev => prev.map(r => r.id === registrationId ? { ...r, status } : r));
  };

  // Handlers for Scoring & Locking
  const handleSaveScores = (newScores: ScoreItem[]) => {
    setScores(prev => {
      const filtered = prev.filter(s => 
        !newScores.some(ns => ns.competition_id === s.competition_id && ns.participant_id === s.participant_id && ns.criterion_id === s.criterion_id && ns.judge_id === s.judge_id)
      );
      return [...filtered, ...newScores];
    });
    if (newScores[0]) {
      addAuditLog("Ustadz Kyai Kholil (Dewan Juri)", "SUBMIT_AND_LOCK_SCORE", newScores[0].competition_id, `Input skor & lock penilaian peserta`);
    }
  };

  const handleUnlockScores = (competitionId: string, participantId: string) => {
    setScores(prev => prev.map(s => {
      if (s.competition_id === competitionId && s.participant_id === participantId) {
        return { ...s, is_locked: false };
      }
      return s;
    }));
    addAuditLog("H. Zaki (Ketua Panitia)", "AUTHORIZED_UNLOCK_SCORE", participantId, `Membuka kunci skor untuk revisi dewan juri`);
  };

  // Handlers for Schedules & Venues
  const handleAddSchedule = (sch: ScheduleItem) => {
    setSchedules(prev => [...prev, sch]);
    addAuditLog("Panitia (Acara)", "CREATED_SCHEDULE", sch.competition_name || "Lomba", `Alokasi panggung & jam tampil`);
  };
  const handleDeleteSchedule = (id: string) => setSchedules(prev => prev.filter(s => s.id !== id));
  const handleAddVenue = (venue: Venue) => setVenues(prev => [...prev, venue]);

  // Handlers for Part 4 (Incidents, Logistics, Finance, Documents)
  const handleAddIncident = (inc: IncidentItem) => {
    setIncidents(prev => [inc, ...prev]);
    addAuditLog(inc.reported_by, "REPORT_INCIDENT", inc.title, `Laporan insiden di ${inc.location}`);
  };
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
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Event Context Header */}
        <EventContextBar event={currentEvent} />

        {/* Tab 1: Command Center Dashboard (FINAL CEO DASHBOARD FORMAT) */}
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

            {/* 1. EVENT HEALTH & READINESS */}
            <EventHealthBanner health={eventHealth} />

            <KpiPanel
              event={currentEvent}
              readinessPercentage={eventHealth.readiness_percentage}
              tasks={tasks}
              participants={participants}
              competitions={competitions}
            />

            {/* 2. WHAT NEEDS MY ATTENTION? */}
            <ActionNeededPanel items={actionItems} onNavigateTab={handleNavigateTab} />

            {/* 3. CURRENT & NEXT EVENT (LIVE OPERATIONAL QUICK BAR) */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Flame className="w-5 h-5 text-emerald-400" /> Operational Hari-H & Incidents
                </h3>
                <button onClick={() => setActiveTab("live_event")} className="text-xs text-emerald-400 hover:underline font-semibold">
                  Buka Live Event OS &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">CURRENT RUNNING</span>
                  <div className="font-bold text-white text-sm mt-1">Tahfidz Juz 30 (Round 2)</div>
                  <div className="text-slate-400">Panggung Utama Gedung A</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-teal-400 uppercase">NEXT UP (10:30 WIB)</span>
                  <div className="font-bold text-white text-sm mt-1">Lomba Adzan & Iqamah</div>
                  <div className="text-slate-400">Masjid Agung Generus Area 1</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">FINANCE BALANCE KAS</span>
                  <div className="font-bold text-amber-400 text-base font-mono mt-1">Rp 23.500.000</div>
                  <div className="text-slate-400">Terverifikasi Bendahara</div>
                </div>
              </div>
            </div>
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
            onAddVenue={handleAddVenue}
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

        {/* Tab 8: Participants */}
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

        {/* Tab 9: Logistics */}
        {activeTab === "logistics" && (
          <LogisticsTab
            inventory={inventory}
            onAddInventory={handleAddInventory}
            onUpdateInventoryStatus={handleUpdateInventoryStatus}
          />
        )}

        {/* Tab 10: Finance */}
        {activeTab === "finance" && (
          <FinanceTab
            transactions={transactions}
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

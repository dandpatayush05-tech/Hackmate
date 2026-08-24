import React from 'react';
import { HackathonProvider, useHackathon } from './context/HackathonContext';
import { ThemeProvider } from './context/ThemeProvider';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Overview } from './components/Overview';
import { AIOperationsCenter } from './components/AIOperationsCenter';
import { AIConcierge } from './components/AIConcierge';
import { TeamMatchmaking } from './components/TeamMatchmaking';
import { ScheduleView } from './components/ScheduleView';
import { AutomatedReminders } from './components/AutomatedReminders';
import { SubmissionAuditView } from './components/SubmissionAudit';
import { SupportQueue } from './components/SupportQueue';
import { KnowledgeBaseView } from './components/KnowledgeBase';
import { LiveEventMonitor } from './components/LiveEventMonitor';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { ParticipantsView } from './components/ParticipantsView';
import { ParticipantDashboard } from './components/ParticipantDashboard';
import { ArchitectureView } from './components/ArchitectureView';
import { AppointmentsManager } from './components/AppointmentsManager';
import { SupabaseDataCenter } from './components/SupabaseDataCenter';
import { BookAppointmentModal } from './components/BookAppointmentModal';
import { AuthModal } from './components/AuthModal';
import { EnrollmentPage } from './components/EnrollmentPage';
import { ToastContainer } from './components/ToastContainer';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AskAIModal } from './components/AskAIModal';

const DashboardContent: React.FC = () => {
  const { currentTab } = useHackathon();

  switch (currentTab) {
    case 'overview':
      return <Overview />;
    case 'ops-center':
      return <AIOperationsCenter />;
    case 'supabase':
      return <SupabaseDataCenter />;
    case 'concierge':
      return <AIConcierge />;
    case 'participants':
      return <ParticipantsView />;
    case 'teams':
      return <TeamMatchmaking />;
    case 'schedule':
      return <ScheduleView />;
    case 'appointments':
      return <AppointmentsManager />;
    case 'reminders':
      return <AutomatedReminders />;
    case 'submissions':
      return <SubmissionAuditView />;
    case 'support':
      return <SupportQueue />;
    case 'knowledge':
      return <KnowledgeBaseView />;
    case 'monitor':
      return <LiveEventMonitor />;
    case 'analytics':
      return <AnalyticsView />;
    case 'settings':
      return <SettingsView />;
    default:
      return <Overview />;
  }
};


const MainAppLayout: React.FC = () => {
  const { viewMode } = useHackathon();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {viewMode === 'landing' && <LandingPage />}

        {viewMode === 'enroll' && <EnrollmentPage />}

        {viewMode === 'participant' && <ParticipantDashboard />}

        {viewMode === 'architecture' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <ArchitectureView />
          </div>
        )}

        {viewMode === 'dashboard' && (
          <div className="flex-1 flex max-w-7xl w-full mx-auto">
            <Sidebar />
            <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto max-h-[calc(100vh-4rem)]">
              <DashboardContent />
            </div>
          </div>
        )}
      </main>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <NotificationDrawer />
      <AskAIModal />
      <BookAppointmentModal />
      <AuthModal />
    </div>
  );
};


export default function App() {
  return (
    <ThemeProvider>
      <HackathonProvider>
        <MainAppLayout />
      </HackathonProvider>
    </ThemeProvider>
  );
}

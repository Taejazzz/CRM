import React from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import KanbanView from './components/KanbanView';
import CardView from './components/CardView';
import CompactView from './components/CompactView';
import ActivityFeedView from './components/ActivityFeedView';

const CRMAppContent = () => {
  const { currentView, error } = useCRM();

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'kanban':
        return <KanbanView />;
      case 'cards':
        return <CardView />;
      case 'compact':
        return <CompactView />;
      case 'feed':
        return <ActivityFeedView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <Layout>
      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-100 rounded-xl p-4 text-rose-800 text-xs font-semibold">
          {error}
        </div>
      )}
      {renderActiveView()}
    </Layout>
  );
};

function App() {
  return (
    <CRMProvider>
      <CRMAppContent />
    </CRMProvider>
  );
}

export default App;

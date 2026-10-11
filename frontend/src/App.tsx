import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { TopBar } from './components/layout/TopBar';
import { TriggerStudio } from './components/screens/TriggerStudio';
import { DistressMap } from './components/screens/DistressMap';
import { DataTrust } from './components/screens/DataTrust';
import { SeasonReplay } from './components/screens/SeasonReplay';
import { HeatDayDesk } from './components/screens/HeatDayDesk';
import { CohortRegistry } from './components/screens/CohortRegistry';
import { ActuarialStressStudio } from './components/screens/ActuarialStressStudio';
import { DisbursementSandbox } from './components/screens/DisbursementSandbox';
import { DecisionRecord } from './components/screens/DecisionRecord';
import { PolicyContractSchedule } from './components/screens/PolicyContractSchedule';
import { DatasetCatalog } from './components/screens/DatasetCatalog';
import { UrbanMicroclimateAudit } from './components/screens/UrbanMicroclimateAudit';
import { LoginPage } from './components/screens/LoginPage';

const MainWorkbench: React.FC = () => {
  const { user } = useAuth();
  const [activeScreen, setActiveScreen] = useState<string>('studio');

  // Landing page is strictly the Login Page when not authenticated
  if (!user) {
    return <LoginPage onSuccess={() => {}} />;
  }

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'studio':
        return <TriggerStudio />;
      case 'distress':
        return <DistressMap />;
      case 'datatrust':
        return <DataTrust />;
      case 'datasets':
        return <DatasetCatalog />;
      case 'microclimate':
        return <UrbanMicroclimateAudit />;
      case 'replay':
        return <SeasonReplay />;
      case 'desk':
        return <HeatDayDesk />;
      case 'cohorts':
        return <CohortRegistry />;
      case 'actuarial':
        return <ActuarialStressStudio />;
      case 'disbursement':
        return <DisbursementSandbox />;
      case 'decisions':
        return <DecisionRecord />;
      case 'contract':
        return <PolicyContractSchedule />;
      default:
        return <TriggerStudio />;
    }
  };

  return (
    <div className="app-container">
      <TopBar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
      />

      <main className="main-content">
        {renderActiveScreen()}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainWorkbench />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;

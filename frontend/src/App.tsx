import React, { useState } from 'react';
import { TopBar } from './components/layout/TopBar';
import { TriggerStudio } from './components/screens/TriggerStudio';
import { DataTrust } from './components/screens/DataTrust';
import { SeasonReplay } from './components/screens/SeasonReplay';
import { HeatDayDesk } from './components/screens/HeatDayDesk';
import { DecisionRecord } from './components/screens/DecisionRecord';

export const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<string>('studio');

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'studio':
        return <TriggerStudio />;
      case 'datatrust':
        return <DataTrust />;
      case 'replay':
        return <SeasonReplay />;
      case 'desk':
        return <HeatDayDesk />;
      case 'decisions':
        return <DecisionRecord />;
      default:
        return <TriggerStudio />;
    }
  };

  return (
    <div className="app-container">
      <TopBar activeScreen={activeScreen} onSelectScreen={setActiveScreen} />

      <main className="main-content">{renderActiveScreen()}</main>
    </div>
  );
};

export default App;

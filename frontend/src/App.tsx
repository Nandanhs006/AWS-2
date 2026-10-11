import React, { useState } from 'react';
import { TopBar } from './components/layout/TopBar';

export const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<string>('studio');

  return (
    <div className="app-container">
      <TopBar activeScreen={activeScreen} onSelectScreen={setActiveScreen} />

      <main className="main-content">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h1 className="panel-title">Mausam Dhaal Workbench</h1>
              <p className="panel-subtitle">Parametric heat protection trigger design and basis risk evaluation</p>
            </div>
            <span className="badge badge-observed">Active Screen: {activeScreen}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Initialising workbench components...
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;

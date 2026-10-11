import React, { useState, useEffect } from 'react';

interface SampleComparison {
  date: string;
  station_observed_c: number;
  reanalysis_modelled_c: number;
  station_trigger: string;
  reanalysis_trigger: string;
  status: string;
}

interface CityDataTrust {
  city_id: string;
  city_name: string;
  station_name: string;
  comparison_period: string;
  total_comparison_days: number;
  station_temp_mean_c: number;
  reanalysis_temp_mean_c: number;
  mean_temp_diff_c: number;
  rmse_temp_c: number;
  false_pay_days_count: number;
  missed_pay_days_count: number;
  basis_risk_score_pct: number;
  assessment: string;
  sample_comparisons: SampleComparison[];
}

export const DataTrust: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('ahmedabad');

  useEffect(() => {
    fetch('/data/data_trust_comparison.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Failed to load data trust comparison:', err));
  }, []);

  if (!data) {
    return (
      <div className="panel" style={{ padding: '30px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading surface station comparison dataset...</p>
      </div>
    );
  }

  const cities: CityDataTrust[] = data.cities;
  const currentCity = cities.find((c) => c.city_id === selectedCityId) || cities[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Overview & City Picker */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Weather Data Trust & Basis Risk Audit</h2>
            <p className="panel-subtitle">
              Ground-truth audit comparing satellite reanalysis against official airport weather station observations
            </p>
          </div>
          <span className="badge badge-observed">Observed Ground Stations</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="form-select"
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            style={{ minWidth: '320px', fontSize: '13px', padding: '6px 12px' }}
          >
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.city_name} — Basis Risk: {city.basis_risk_score_pct}% ({city.station_name.split('(')[0]})
              </option>
            ))}
          </select>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Auditing {cities.length} primary meteorological stations against ERA5 reanalysis
          </span>
        </div>
      </div>

      {/* Summary Scorecards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div className="metric-card" style={{ borderLeft: '3px solid #0972D3' }}>
          <div className="metric-title">Ground Station vs Reanalysis Disagreement</div>
          <div className="metric-value">{currentCity.basis_risk_score_pct}%</div>
          <div className="metric-sub">{currentCity.comparison_period}</div>
        </div>

        <div className="metric-card" style={{ borderLeft: '3px solid #C0392B' }}>
          <div className="metric-title">Missed-Pay Days (Station Hotter)</div>
          <div className="metric-value" style={{ color: '#C0392B' }}>
            {currentCity.missed_pay_days_count} days
          </div>
          <div className="metric-sub">Workers suffered heat, model failed to trigger</div>
        </div>

        <div className="metric-card" style={{ borderLeft: '3px solid #FF9900' }}>
          <div className="metric-title">False-Pay Days (Model Higher)</div>
          <div className="metric-value" style={{ color: '#B78103' }}>
            {currentCity.false_pay_days_count} days
          </div>
          <div className="metric-sub">Model triggered, station was below trigger</div>
        </div>

        <div className="metric-card">
          <div className="metric-title">Mean Temperature Bias / RMSE</div>
          <div className="metric-value">{currentCity.mean_temp_diff_c}°C</div>
          <div className="metric-sub">RMSE: {currentCity.rmse_temp_c}°C across {currentCity.total_comparison_days} days</div>
        </div>
      </div>

      {/* Deep-Dive Audit & Station Analysis */}
      <div className="panel-grid">
        {/* Left: Meteorological Assessment */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Station Blind Spot Assessment</h3>
              <p className="panel-subtitle">{currentCity.station_name}</p>
            </div>
            <span className="badge badge-observed">Observed IMD</span>
          </div>

          <div
            style={{
              padding: '14px',
              backgroundColor: '#FAFAFA',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              marginBottom: '14px',
              lineHeight: 1.6,
            }}
          >
            <p style={{ fontSize: '13px', color: 'var(--text-main)' }}>{currentCity.assessment}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Station Surface Mean:</span>
              <span style={{ fontWeight: 600 }}>{currentCity.station_temp_mean_c}°C (Observed)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ERA5 Grid Reanalysis Mean:</span>
              <span style={{ fontWeight: 600 }}>{currentCity.reanalysis_temp_mean_c}°C (Modelled)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Urban Heat Island Disconnect:</span>
              <span style={{ fontWeight: 600, color: '#C0392B' }}>
                {Math.abs(currentCity.mean_temp_diff_c)}°C variance at informal settlement level
              </span>
            </div>
          </div>
        </div>

        {/* Right: Daily Audit Disagreement Log */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Day-Level Basis Risk Disagreement Log</h3>
              <p className="panel-subtitle">Sample historical dates showing data discrepancy</p>
            </div>
            <span className="badge badge-modelled">Model vs Station</span>
          </div>

          <table className="dense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Station (Observed)</th>
                <th>Reanalysis (Modelled)</th>
                <th>Audit Outcome</th>
              </tr>
            </thead>
            <tbody>
              {currentCity.sample_comparisons.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{row.date}</td>
                  <td>
                    {row.station_observed_c}°C{' '}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({row.station_trigger})</span>
                  </td>
                  <td>
                    {row.reanalysis_modelled_c}°C{' '}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({row.reanalysis_trigger})</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        backgroundColor: row.status.includes('Agreed') ? '#EDF7ED' : '#FEECEB',
                        color: row.status.includes('Agreed') ? '#1E4620' : '#C0392B',
                        fontWeight: 600,
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 16-City Basis Risk Leaderboard Table */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Nationwide {cities.length || 31}-City Station Basis Risk Leaderboard</h3>
            <p className="panel-subtitle">Comparative audit ranking all {cities.length || 31} Indian hubs by trigger disagreement rate</p>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Territory Hub</th>
                <th>Primary Weather Station</th>
                <th>Station Temp Mean</th>
                <th>Reanalysis Mean</th>
                <th>Temp Bias (Δ)</th>
                <th>RMSE</th>
                <th>Missed Days</th>
                <th>Basis Risk Disagreement</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr
                  key={city.city_id}
                  style={{
                    backgroundColor: city.city_id === selectedCityId ? 'rgba(255, 153, 0, 0.08)' : undefined,
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedCityId(city.city_id)}
                >
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{city.city_name}</td>
                  <td>{city.station_name}</td>
                  <td>{city.station_temp_mean_c.toFixed(1)}°C</td>
                  <td>{city.reanalysis_temp_mean_c.toFixed(1)}°C</td>
                  <td>{city.mean_temp_diff_c > 0 ? `+${city.mean_temp_diff_c}` : city.mean_temp_diff_c}°C</td>
                  <td>{city.rmse_temp_c.toFixed(2)}°C</td>
                  <td style={{ color: city.missed_pay_days_count > 20 ? '#D13212' : undefined, fontWeight: 600 }}>
                    {city.missed_pay_days_count}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: city.basis_risk_score_pct >= 25 ? 'rgba(209, 50, 18, 0.15)' : 'rgba(9, 114, 211, 0.15)',
                        color: city.basis_risk_score_pct >= 25 ? '#D13212' : '#0972D3',
                        fontWeight: 700,
                      }}
                    >
                      {city.basis_risk_score_pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

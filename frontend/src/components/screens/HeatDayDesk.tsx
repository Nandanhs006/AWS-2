import React, { useState, useEffect } from 'react';
import { Download, Send, Globe, UserCheck, ChevronRight } from 'lucide-react';
import { DiurnalHeatCurve } from '../common/DiurnalHeatCurve';


interface CityForecast {
  city_id: string;
  city_name: string;
  state: string;
  cohort_size: number;
  date: string;
  forecast_t_max_c: number;
  forecast_t_min_c: number;
  forecast_rh_pct: number;
  forecast_tw_max_c: number;
  forecast_wbgt_max_c: number;
  tier_triggered: string | null;
  consecutive_day_count: number;
  payout_due_inr: number;
  total_cohort_payout_inr: number;
  status_label: string;
  status_detail: string;
  advisory_generated: boolean;
}

interface DiurnalPoint {
  hour: string;
  t_max_c: number;
  rh_pct: number;
  tw_c: number;
  wbgt_c: number;
  danger_zone: boolean;
}

interface ChecklistItem {
  task: string;
  department: string;
  status: string;
}

export const HeatDayDesk: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [diurnalData, setDiurnalData] = useState<Record<string, { curve: DiurnalPoint[] }>>({});
  const [selectedCityId, setSelectedCityId] = useState<string>('kolkata'); // Default to Kolkata where trigger fired
  const [activeLang, setActiveLang] = useState<'english' | 'kannada' | 'marathi' | 'telugu' | 'hindi' | 'gujarati' | 'tamil' | 'bengali'>('english');
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [viewTab, setViewTab] = useState<'active_city' | 'nationwide_matrix'>('active_city');

  useEffect(() => {
    fetch('/data/today_forecast.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setChecklist(json.city_action_checklist || []);
      })
      .catch((err) => console.error('Failed to load today forecast:', err));

    fetch('/data/diurnal_curves.json')
      .then((res) => res.json())
      .then((json) => setDiurnalData(json))
      .catch((err) => console.error('Failed to load diurnal curves:', err));
  }, []);

  if (!data) {
    return (
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading operational forecast evaluation...</p>
      </div>
    );
  }

  const cities: CityForecast[] = data.cities;
  const currentCity = cities.find((c) => c.city_id === selectedCityId) || cities[0];
  const isTriggered = currentCity.tier_triggered !== null;
  const currentCurve = diurnalData[currentCity.city_id]?.curve || [];

  const totalCohort = cities.reduce((acc, c) => acc + c.cohort_size, 0);
  const totalPayoutDue = cities.reduce((acc, c) => acc + c.total_cohort_payout_inr, 0);
  const activeTriggerCount = cities.filter((c) => c.tier_triggered !== null).length;

  // Download Payout Instruction CSV
  const handleDownloadCsv = () => {
    const headers = ['Member_ID', 'Full_Name', 'City', 'Phone', 'UPI_VPA', 'Trigger_Tier', 'Payout_Amount_INR', 'Status'];
    const sampleWorkers = [
      [`SEWA-${currentCity.city_id.toUpperCase().slice(0, 3)}-10021`, 'Ramilaben V. Parmar', currentCity.city_name, '98250XXXXX', '98250XXXXX@sbi', currentCity.tier_triggered || 'None', currentCity.payout_due_inr, 'Approved'],
      [`SEWA-${currentCity.city_id.toUpperCase().slice(0, 3)}-10044`, 'Kankuben D. Solanki', currentCity.city_name, '98791XXXXX', '98791XXXXX@upi', currentCity.tier_triggered || 'None', currentCity.payout_due_inr, 'Approved'],
      [`SEWA-${currentCity.city_id.toUpperCase().slice(0, 3)}-10118`, 'Lilaben M. Vaghela', currentCity.city_name, '94263XXXXX', 'lilaben@oksbi', currentCity.tier_triggered || 'None', currentCity.payout_due_inr, 'Approved'],
      [`SEWA-${currentCity.city_id.toUpperCase().slice(0, 3)}-10202`, 'Bhavnaben K. Rathod', currentCity.city_name, '99099XXXXX', 'bhavna@axisbank', currentCity.tier_triggered || 'None', currentCity.payout_due_inr, 'Approved'],
      [`SEWA-${currentCity.city_id.toUpperCase().slice(0, 3)}-10355`, 'Manjulaben P. Chauhan', currentCity.city_name, '98242XXXXX', 'manjula@paytm', currentCity.tier_triggered || 'None', currentCity.payout_due_inr, 'Approved'],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...sampleWorkers.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `heatsutra_payout_${currentCity.city_id}_${currentCity.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateEmailSend = () => {
    setEmailStatus('Advisory dispatched to registered employer and contractor lists.');
    setTimeout(() => setEmailStatus(null), 5000);
  };

  const toggleChecklist = (idx: number) => {
    setChecklist((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' } : item
      )
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner & Multi-City Overview Ribbon */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className={`badge ${activeTriggerCount > 0 ? 'badge-danger' : 'badge-success'}`}>
                {activeTriggerCount > 0 ? `${activeTriggerCount} City Triggers Fired Today` : 'All 16 Hubs Standby'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Evaluation Run: {new Date(data.evaluation_timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
              Heat-Day Desk — Daily Operations & Advisory Broadcast
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '820px', lineHeight: 1.5 }}>
              Daily 06:00 AM automated execution of parametric triggers across {cities.length} Indian cities covering {totalCohort.toLocaleString()} enrolled informal outdoor workers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`nav-tab-btn ${viewTab === 'active_city' ? 'active' : ''}`}
              onClick={() => setViewTab('active_city')}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Territory Dispatch View
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${viewTab === 'nationwide_matrix' ? 'active' : ''}`}
              onClick={() => setViewTab('nationwide_matrix')}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Nationwide Shield ({cities.length} Hubs)
            </button>
          </div>
        </div>
      </div>

      {viewTab === 'nationwide_matrix' ? (
        /* Multi-Territory Overview Table */
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                National Parametric Trigger Matrix ({cities.length} Hubs — Season 2026)
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Total Enrolled Workers: {totalCohort.toLocaleString()} | Today's Committed Relief: ₹{totalPayoutDue.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Territory / Hub</th>
                  <th>State</th>
                  <th>Cohort Sizing</th>
                  <th>Forecast T_max</th>
                  <th>Peak Wet-Bulb</th>
                  <th>Outdoor WBGT</th>
                  <th>Trigger Status</th>
                  <th>Payout / Member</th>
                  <th>Total Committed</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => {
                  const fired = city.tier_triggered !== null;
                  return (
                    <tr
                      key={city.city_id}
                      style={{
                        backgroundColor: fired ? 'rgba(209, 50, 18, 0.04)' : undefined,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setSelectedCityId(city.city_id);
                        setViewTab('active_city');
                      }}
                    >
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{city.city_name}</td>
                      <td>{city.state}</td>
                      <td>{city.cohort_size.toLocaleString()}</td>
                      <td style={{ fontWeight: 600 }}>{city.forecast_t_max_c.toFixed(1)}°C</td>
                      <td style={{ color: city.forecast_tw_max_c >= 29.5 ? '#D13212' : undefined, fontWeight: 600 }}>
                        {city.forecast_tw_max_c.toFixed(2)}°C
                      </td>
                      <td style={{ color: city.forecast_wbgt_max_c >= 30.5 ? '#D13212' : undefined, fontWeight: 600 }}>
                        {city.forecast_wbgt_max_c.toFixed(2)}°C
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: fired
                              ? city.tier_triggered === 'Full'
                                ? 'rgba(209, 50, 18, 0.15)'
                                : 'rgba(255, 153, 0, 0.15)'
                              : 'rgba(30, 70, 32, 0.1)',
                            color: fired
                              ? city.tier_triggered === 'Full'
                                ? '#D13212'
                                : '#B35900'
                              : '#1E4620',
                            fontWeight: 600,
                          }}
                        >
                          {city.status_label}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{city.payout_due_inr.toFixed(0)}</td>
                      <td style={{ fontWeight: 700, color: fired ? '#D13212' : 'var(--text-secondary)' }}>
                        ₹{city.total_cohort_payout_inr.toLocaleString()}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCityId(city.city_id);
                            setViewTab('active_city');
                          }}
                        >
                          Inspect <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Single Territory Detailed Operations */
        <>
          {/* City Selector Bar */}
          <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Hub:</span>
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                style={{ fontSize: '13px', padding: '6px 12px', minWidth: '240px' }}
              >
                {cities.map((c) => (
                  <option key={c.city_id} value={c.city_id}>
                    {c.city_name} ({c.state}) — {c.status_label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
              <span>Cohort: <strong>{currentCity.cohort_size.toLocaleString()} workers</strong></span>
              <span style={{ color: 'var(--border-color)' }}>|</span>
              <span>Daily Wage Mandate: <strong>₹{data.daily_wage_rate_inr}</strong></span>
              <span style={{ color: 'var(--border-color)' }}>|</span>
              <span>Relief Payout: <strong style={{ color: isTriggered ? '#D13212' : 'inherit' }}>₹{currentCity.payout_due_inr}</strong></span>
            </div>
          </div>

          {/* Trigger Outcome Hero Banner */}
          <div
            className="card"
            style={{
              padding: '20px 24px',
              borderLeft: isTriggered ? '5px solid #D13212' : '5px solid #1E4620',
              backgroundColor: isTriggered ? 'rgba(209, 50, 18, 0.04)' : 'rgba(30, 70, 32, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: isTriggered ? '#D13212' : '#1E4620',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}
                  >
                    {currentCity.status_label}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {currentCity.city_name} Hub · {currentCity.date}
                  </span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '6px 0', color: 'var(--text-primary)' }}>
                  {isTriggered
                    ? `Heat Stress Trigger Fired: ₹${currentCity.total_cohort_payout_inr.toLocaleString()} Committed for ${currentCity.cohort_size.toLocaleString()} Members`
                    : `Thresholds Maintained: Normal Operating Standby in ${currentCity.city_name}`}
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  {currentCity.status_detail} Peak Wet-Bulb: {currentCity.forecast_tw_max_c.toFixed(2)}°C | Outdoor WBGT: {currentCity.forecast_wbgt_max_c.toFixed(2)}°C | Dry-Bulb T_max: {currentCity.forecast_t_max_c.toFixed(1)}°C.
                </p>
              </div>

              {isTriggered && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleDownloadCsv}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 16px' }}
                >
                  <Download size={15} /> Export UPI Payment CSV
                </button>
              )}
            </div>
          </div>

          {/* 24-Hour Diurnal Heat Curve (11:30 AM - 4:30 PM Red Danger Band) */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <DiurnalHeatCurve curve={currentCurve} cityName={currentCity.city_name} />
          </div>

          {/* Operational Communications & Checklists Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
            {/* Multi-Language Plain-Text SMS Dispatch */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={15} color="var(--aws-orange)" />
                  Worker SMS Advisory Dispatch
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {([
                    { id: 'english', label: 'English' },
                    { id: 'kannada', label: 'ಕನ್ನಡ' },
                    { id: 'marathi', label: 'मराठी' },
                    { id: 'telugu', label: 'తెలుగు' },
                    { id: 'hindi', label: 'हिन्दी' },
                    { id: 'gujarati', label: 'ગુજરાતી' },
                    { id: 'tamil', label: 'தமிழ்' },
                  ] as const).map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setActiveLang(lang.id as any)}
                      style={{
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: '2px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: activeLang === lang.id ? 'var(--aws-orange)' : 'var(--bg-app)',
                        color: activeLang === lang.id ? '#111827' : 'var(--text-secondary)',
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '2px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: 'var(--text-primary)',
                  minHeight: '90px',
                }}
              >
                {data.worker_message_templates[activeLang] || data.worker_message_templates.english}
              </div>

              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Target Delivery: {currentCity.cohort_size.toLocaleString()} SMS Broadcasts via DLT Template
                </span>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleSimulateEmailSend}
                  style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Send size={12} /> Dispatch Employer Advisory
                </button>
              </div>

              {emailStatus && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#1E4620', fontWeight: 600 }}>
                  ✓ {emailStatus}
                </div>
              )}
            </div>

            {/* Municipal Heat-Action Coordination Checklist */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={15} color="var(--aws-orange)" />
                Inter-Agency Heat Action Protocol ({currentCity.city_name})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {checklist.map((item, idx) => {
                  const isDone = item.status === 'Completed' || item.status === 'Dispatched';
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleChecklist(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: 'var(--bg-app)',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" checked={isDone} readOnly style={{ cursor: 'pointer' }} />
                        <span style={{ fontSize: '12px', color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none' }}>
                          {item.task}
                        </span>
                      </div>
                      <span className="badge" style={{ fontSize: '10px' }}>
                        {item.department}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

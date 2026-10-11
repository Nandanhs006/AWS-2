import React, { useState, useEffect } from 'react';

interface CityForecast {
  city_id: string;
  city_name: string;
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

interface ChecklistItem {
  task: string;
  department: string;
  status: string;
}

export const HeatDayDesk: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [selectedCityId, setSelectedCityId] = useState<string>('kolkata'); // Default to Kolkata where trigger fired
  const [activeLang, setActiveLang] = useState<'english' | 'hindi' | 'gujarati'>('english');
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    fetch('/data/today_forecast.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setChecklist(json.city_action_checklist || []);
      })
      .catch((err) => console.error('Failed to load today forecast:', err));
  }, []);

  if (!data) {
    return (
      <div className="panel" style={{ padding: '30px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading operational forecast evaluation...</p>
      </div>
    );
  }

  const cities: CityForecast[] = data.cities;
  const currentCity = cities.find((c) => c.city_id === selectedCityId) || cities[0];
  const isTriggered = currentCity.tier_triggered !== null;

  // Download Payout Instruction CSV
  const handleDownloadCsv = () => {
    const headers = ['Member_ID', 'Full_Name', 'City', 'Phone', 'UPI_VPA', 'Trigger_Tier', 'Payout_Amount_INR', 'Status'];
    const sampleWorkers = [
      ['SEWA-AHM-10021', 'Ramilaben V. Parmar', currentCity.city_name, '98250XXXXX', '98250XXXXX@sbi', currentCity.tier_triggered || 'None', currentCity.payout_due_inr, 'Approved'],
      ['SEWA-AHM-10044', 'Kankuben D. Solanki', currentCity.city_name, '98791XXXXX', '98791XXXXX@upi', currentCity.tier_triggered || 'None', currentCity.payout_due_inr, 'Approved'],
      ['SEWA-AHM-10118', 'Lilaben M. Vaghela', currentCity.city_name, '94263XXXXX', 'lilaben@oksbi', currentCity.tier_triggered || 'None', currentCity.payout_due_inr, 'Approved'],
      ['SEWA-AHM-10202', 'Bhavnaben K. Rathod', currentCity.city_name, '99099XXXXX', 'bhavna@axisbank', currentCity.tier_triggered || 'None', currentCity.payout_due_inr, 'Approved'],
      ['SEWA-AHM-10355', 'Manjulaben P. Chauhan', currentCity.city_name, '98242XXXXX', 'manjula@paytm', currentCity.tier_triggered || 'None', currentCity.payout_due_inr, 'Approved'],
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...sampleWorkers.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mausam_dhaal_payout_${currentCity.city_id}_${currentCity.date}.csv`);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header and City Selector */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Heat-Day Desk — Operational Evaluation</h2>
            <p className="panel-subtitle">
              Daily forecast monitoring, automated action protocols, and income-protection disbursement instructions
            </p>
          </div>
          <span className="badge badge-observed">Evaluation: {currentCity.date}</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {cities.map((city) => (
            <button
              key={city.city_id}
              type="button"
              className={selectedCityId === city.city_id ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setSelectedCityId(city.city_id)}
            >
              {city.city_name}: {city.tier_triggered ? `Trigger Fired (${city.tier_triggered})` : 'Standby'}
            </button>
          ))}
        </div>
      </div>

      {/* Operational Trigger Banner */}
      <div
        style={{
          backgroundColor: isTriggered ? '#FEECEB' : '#EDF7ED',
          border: isTriggered ? '1px solid #F5B7B1' : '1px solid #C8E6C9',
          borderRadius: '4px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: isTriggered ? '#C0392B' : '#1E4620',
              textTransform: 'uppercase',
            }}
          >
            {currentCity.status_label}
          </span>
          {isTriggered && (
            <span className="badge badge-full">Disbursement Due: ₹{currentCity.payout_due_inr} / Member</span>
          )}
        </div>
        <p style={{ fontSize: '13px', color: isTriggered ? '#922B21' : '#1E4620', lineHeight: 1.5 }}>
          {currentCity.status_detail}
        </p>

        {isTriggered && (
          <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
            <button type="button" className="btn-primary" onClick={handleDownloadCsv}>
              Export Payout Instruction CSV ({data.cohort_size.toLocaleString()} Members)
            </button>
            <button type="button" className="btn-secondary" onClick={handleSimulateEmailSend}>
              Dispatch Employer Advisory
            </button>
            {emailStatus && (
              <span style={{ fontSize: '12px', color: '#1E4620', fontWeight: 600, alignSelf: 'center' }}>
                {emailStatus}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meteorological Observations & Forecast Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div className="metric-card">
          <div className="metric-title">Forecast Max Dry-Bulb</div>
          <div className="metric-value">{currentCity.forecast_t_max_c}°C</div>
          <div className="metric-sub">Min: {currentCity.forecast_t_min_c}°C</div>
        </div>

        <div className="metric-card" style={{ borderLeft: '3px solid #FF9900' }}>
          <div className="metric-title">Forecast Relative Humidity</div>
          <div className="metric-value">{currentCity.forecast_rh_pct}%</div>
          <div className="metric-sub">Moisture level</div>
        </div>

        <div className="metric-card" style={{ borderLeft: '3px solid #C0392B' }}>
          <div className="metric-title">Peak Wet-Bulb (Stull Tw)</div>
          <div className="metric-value" style={{ color: currentCity.forecast_tw_max_c >= 30 ? '#C0392B' : 'inherit' }}>
            {currentCity.forecast_tw_max_c}°C
          </div>
          <div className="metric-sub">
            {currentCity.forecast_tw_max_c >= 30 ? 'Lethal physiological threshold' : 'Within tolerance'}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-title">Total Cohort Payout Commitment</div>
          <div className="metric-value" style={{ color: isTriggered ? '#C0392B' : 'inherit' }}>
            {isTriggered ? `₹${(currentCity.total_cohort_payout_inr / 10000000).toFixed(2)} Cr` : '₹0.00'}
          </div>
          <div className="metric-sub">{data.cohort_size.toLocaleString()} registered workers</div>
        </div>
      </div>

      {/* Split Panels: Worker Message Preview & City Action Checklist */}
      <div className="panel-grid">
        {/* Left: Worker Message Preview */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Worker Notification Preview</h3>
              <p className="panel-subtitle">Plain-language broadcast message sent to verified workers</p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['english', 'hindi', 'gujarati'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={activeLang === lang ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '4px 10px', fontSize: '11px', textTransform: 'capitalize' }}
                  onClick={() => setActiveLang(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#FAFAFA',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              fontFamily: activeLang === 'english' ? 'inherit' : 'sans-serif',
              lineHeight: 1.6,
              fontSize: '14px',
              minHeight: '120px',
            }}
          >
            {isTriggered ? (
              <p>{data.worker_message_templates[activeLang]}</p>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>
                No trigger fired today for {currentCity.city_name}. Standing worker notification is in standby mode.
              </p>
            )}
          </div>

          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Employer Advisory Text
            </h4>
            <div
              style={{
                marginTop: '8px',
                padding: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-subtle)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              <strong>{data.employer_advisory.subject}</strong>
              <p style={{ marginTop: '6px' }}>{data.employer_advisory.body}</p>
            </div>
          </div>
        </div>

        {/* Right: City Action Checklist */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Heat Action Plan (HAP) Checklist</h3>
              <p className="panel-subtitle">Departmental coordination tasks triggered upon heatwave alert</p>
            </div>
            <span className="badge badge-observed">Municipal Coordination</span>
          </div>

          <table className="dense-table">
            <thead>
              <tr>
                <th>Action Task</th>
                <th>Responsible Agency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{item.task}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.department}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{
                        padding: '3px 8px',
                        fontSize: '11px',
                        backgroundColor: item.status === 'Completed' ? '#EDF7ED' : '#FFFFFF',
                        color: item.status === 'Completed' ? '#1E4620' : 'var(--text-main)',
                      }}
                      onClick={() => toggleChecklist(idx)}
                    >
                      {item.status}
                    </button>
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

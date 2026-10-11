import React, { useState, useEffect } from 'react';

interface DayRecord {
  date: string;
  t_max_c: number;
  tw_max_c: number;
  wbgt_max_c: number;
  tier_triggered: string | null;
  payout_inr: number;
  consecutive_day_count: number;
  work_loss_proxy_pct: number;
  is_bad_year_miss: boolean;
  is_false_payout: boolean;
}

interface SeasonReplayData {
  season_year: number;
  city_id: string;
  policy_name: string;
  total_days_evaluated: number;
  payout_days: number;
  total_payout_per_member_inr: number;
  documented_reported_outcome: string;
  model_reproduced_outcome: string;
  is_reproduced_exact: boolean;
  explanation: string;
  daily_records: DayRecord[];
}

export const SeasonReplay: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<string>('ahmedabad');
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [selectedPolicyType, setSelectedPolicyType] = useState<string>('sewa_policy');

  useEffect(() => {
    fetch('/data/season_replays.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Failed to load season replays:', err));
  }, []);

  if (!data) {
    return (
      <div className="panel" style={{ padding: '30px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading historical season replay series...</p>
      </div>
    );
  }

  const cityData = data.cities[selectedCity];
  const seasonData = cityData ? cityData.seasons[selectedYear] : null;
  const currentReplay: SeasonReplayData | null = seasonData ? seasonData[selectedPolicyType] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Replay Controls Panel */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Historical Season Replay and Pilot Verification</h2>
            <p className="panel-subtitle">
              Replay documented summer seasons day-by-day against published micro-insurance triggers
            </p>
          </div>
          <span className="badge badge-modelled">Day-by-Day Replay</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '16px', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">City Cohort</label>
            <select
              className="form-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {data.cities ? (
                Object.keys(data.cities).map((cid) => (
                  <option key={cid} value={cid}>
                    {cid.charAt(0).toUpperCase() + cid.slice(1)} Hub (Historical Evaluation)
                  </option>
                ))
              ) : (
                <>
                  <option value="ahmedabad">Ahmedabad (SEWA Pilot Epicenter)</option>
                  <option value="kolkata">Kolkata</option>
                  <option value="sholapur">Sholapur</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Summer Season Year</label>
            <select
              className="form-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2023">2023 Season (Zero-Payout Pilot Failure)</option>
              <option value="2024">2024 Season (Historic May Heatwave)</option>
              <option value="2025">2025 Season (Narrow Miss Scheme)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Policy Configuration Under Test</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={selectedPolicyType === 'sewa_policy' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setSelectedPolicyType('sewa_policy')}
              >
                Published SEWA Rule (43.6°C / 44.1°C)
              </button>
              <button
                type="button"
                className={selectedPolicyType === 'revised_2026_policy' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setSelectedPolicyType('revised_2026_policy')}
              >
                Revised 2026 Rule (42.74°C)
              </button>
            </div>
          </div>
        </div>
      </div>

      {currentReplay && (
        <>
          {/* Ground Truth vs Model Match Banner */}
          <div
            style={{
              backgroundColor: currentReplay.is_reproduced_exact ? '#EDF7ED' : '#FFF8E1',
              border: currentReplay.is_reproduced_exact ? '1px solid #C8E6C9' : '1px solid #FFE082',
              borderRadius: '4px',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: currentReplay.is_reproduced_exact ? '#1E4620' : '#B78103', textTransform: 'uppercase' }}>
                {currentReplay.is_reproduced_exact ? 'Ground-Truth Match Confirmed' : 'Data Discrepancy Identified'}
              </span>
              <span className="badge badge-observed">
                Documented Pilot Outcome: {currentReplay.documented_reported_outcome}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: currentReplay.is_reproduced_exact ? '#1E4620' : '#684B00', lineHeight: 1.5 }}>
              {currentReplay.explanation}
            </p>
          </div>

          {/* Season High-Level Scorecards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div className="metric-card">
              <div className="metric-title">Season Days Evaluated</div>
              <div className="metric-value">{currentReplay.total_days_evaluated} days</div>
              <div className="metric-sub">April 1 to June 30 ({selectedYear})</div>
            </div>

            <div className="metric-card" style={{ borderLeft: '3px solid #0972D3' }}>
              <div className="metric-title">Days Trigger Fired</div>
              <div className="metric-value" style={{ color: currentReplay.payout_days > 0 ? '#1E4620' : '#C0392B' }}>
                {currentReplay.payout_days} days
              </div>
              <div className="metric-sub">
                {currentReplay.payout_days === 0 ? 'Zero payout condition reproduced' : 'Relief payout activated'}
              </div>
            </div>

            <div className="metric-card" style={{ borderLeft: '3px solid #FF9900' }}>
              <div className="metric-title">Total Benefit per Member</div>
              <div className="metric-value">₹{currentReplay.total_payout_per_member_inr}</div>
              <div className="metric-sub">Calculated under {currentReplay.policy_name}</div>
            </div>

            <div className="metric-card">
              <div className="metric-title">Reported Reality</div>
              <div className="metric-value" style={{ fontSize: '16px', marginTop: '8px' }}>
                {currentReplay.documented_reported_outcome}
              </div>
              <div className="metric-sub">Field pilot audit log</div>
            </div>
          </div>

          {/* Day-by-Day Replay Table */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">{selectedYear} Summer Season Day-by-Day Trace</h3>
                <p className="panel-subtitle">Consecutive heat tracker and tier trigger evaluations</p>
              </div>
              <span className="badge badge-modelled">Modelled Series</span>
            </div>

            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table className="dense-table">
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#FAFAFA', zIndex: 10 }}>
                  <tr>
                    <th>Date</th>
                    <th>Max Dry-Bulb (Tmax)</th>
                    <th>Max Wet-Bulb (Tw)</th>
                    <th>WBGT Index</th>
                    <th>Consecutive Days</th>
                    <th>Tier Fired</th>
                    <th>Payout (INR)</th>
                    <th>Work Loss Proxy</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReplay.daily_records.map((day) => {
                    const isHot = day.t_max_c >= 43.6 || day.tw_max_c >= 30.0;
                    return (
                      <tr
                        key={day.date}
                        style={{
                          backgroundColor: day.tier_triggered ? '#FEECEB' : isHot ? '#FFFDE7' : 'inherit',
                        }}
                      >
                        <td style={{ fontWeight: 600 }}>{day.date}</td>
                        <td style={{ fontWeight: day.t_max_c >= 43.6 ? 700 : 400, color: day.t_max_c >= 44.0 ? '#C0392B' : 'inherit' }}>
                          {day.t_max_c}°C
                        </td>
                        <td>{day.tw_max_c}°C</td>
                        <td>{day.wbgt_max_c}°C</td>
                        <td style={{ fontWeight: day.consecutive_day_count >= 2 ? 700 : 400 }}>
                          {day.consecutive_day_count} {day.consecutive_day_count === 1 ? '(Day 1)' : day.consecutive_day_count >= 2 ? '(Streak 2+)' : ''}
                        </td>
                        <td>
                          {day.tier_triggered ? (
                            <span
                              className={`badge ${
                                day.tier_triggered === 'Advisory'
                                  ? 'badge-advisory'
                                  : day.tier_triggered === 'Partial'
                                  ? 'badge-partial'
                                  : 'badge-full'
                              }`}
                            >
                              {day.tier_triggered}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>None</span>
                          )}
                        </td>
                        <td style={{ fontWeight: day.payout_inr > 0 ? 700 : 400 }}>
                          {day.payout_inr > 0 ? `₹${day.payout_inr}` : '₹0'}
                        </td>
                        <td>
                          <span style={{ color: day.work_loss_proxy_pct > 30 ? '#C0392B' : 'inherit', fontWeight: day.work_loss_proxy_pct > 30 ? 600 : 400 }}>
                            {day.work_loss_proxy_pct}% loss
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

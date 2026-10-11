import React, { useState, useEffect } from 'react';

interface TierData {
  name: string;
  threshold_value: number;
  payout_inr: number;
}

interface SplitMetrics {
  period_label: string;
  total_days: number;
  payout_days_count: number;
  payout_frequency_pct: number;
  annual_payout_events_mean: number;
  annual_expected_payout_inr: number;
  indicative_premium_inr: number;
  bad_year_misses: number;
  false_payouts: number;
  uncompensated_wage_loss_inr: number;
}

interface StudioEvaluationItem {
  template: {
    id: string;
    family: string;
    label: string;
    consecutive_days: number;
    tiers: TierData[];
    loading_factor: number;
  };
  result: {
    city_id: string;
    city_name: string;
    train_metrics: SplitMetrics;
    test_metrics: SplitMetrics;
    combined_indicative_premium_inr: number;
    headline_notes: string[];
  };
}

export const TriggerStudio: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<string>('ahmedabad');
  const [selectedPolicy, setSelectedPolicy] = useState<string>('dry_bulb_sewa_pilot');
  const [loadingAssumption, setLoadingAssumption] = useState<number>(20); // 20%
  const [budgetMode, setBudgetMode] = useState<boolean>(false);
  const [targetBudget, setTargetBudget] = useState<number>(400);
  const [workerContrib, setWorkerContrib] = useState<number>(100);

  useEffect(() => {
    fetch('/data/studio_precomputed.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Failed to load studio precomputed data:', err));
  }, []);

  if (!data) {
    return (
      <div className="panel" style={{ padding: '30px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading trigger evaluation catalog...</p>
      </div>
    );
  }

  const cityEval = data.evaluations[selectedCity];
  const activeItem: StudioEvaluationItem | undefined = cityEval ? cityEval[selectedPolicy] : undefined;

  // Dynamically recalculate indicative premium based on editable loading assumption
  const calcPremium = (expectedPayout: number) => {
    return Math.round(expectedPayout * (1 + loadingAssumption / 100));
  };

  const trainMetrics = activeItem?.result.train_metrics;
  const testMetrics = activeItem?.result.test_metrics;

  const trainPremium = trainMetrics ? calcPremium(trainMetrics.annual_expected_payout_inr) : 0;
  const testPremium = testMetrics ? calcPremium(testMetrics.annual_expected_payout_inr) : 0;
  const combinedPremium = Math.round((trainPremium + testPremium) / 2);

  // Budget mode calculations
  const sponsorShare = Math.max(0, targetBudget - workerContrib);
  const budgetGap = Math.max(0, combinedPremium - targetBudget);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Configuration Ribbon */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Trigger Design and Calibration</h2>
            <p className="panel-subtitle">
              Calibrate parametric thresholds against multi-decade climate series and held-out test periods
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className={budgetMode ? 'btn-secondary' : 'btn-primary'}
              onClick={() => setBudgetMode(false)}
            >
              Trigger Studio
            </button>
            <button
              type="button"
              className={budgetMode ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setBudgetMode(true)}
            >
              Budget Mode
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">City Cohort</label>
            <select
              className="form-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {data.cities && data.cities.length > 0 ? (
                data.cities.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state}) — {c.climate_type}
                  </option>
                ))
              ) : (
                <>
                  <option value="ahmedabad">Ahmedabad (Hero / Semi-Arid Heat)</option>
                  <option value="kolkata">Kolkata (Humid-Heat Delta)</option>
                  <option value="sholapur">Sholapur (Transition Plateau)</option>
                </>
              )}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Trigger Family & Rule</label>
            <select
              className="form-select"
              value={selectedPolicy}
              onChange={(e) => setSelectedPolicy(e.target.value)}
            >
              <option value="dry_bulb_sewa_pilot">Published SEWA 2-Day Dry-Bulb Pilot (43.6°C / 44.1°C)</option>
              <option value="dry_bulb_lowered_2026">Revised Gujarat 2026 Standard (42.74°C)</option>
              <option value="wet_bulb_standard">Stull Wet-Bulb Physiological Stress (29.8°C / 30.8°C)</option>
              <option value="hybrid_dual_metric">Mausam Dhaal Hybrid (Extreme Dry Heat OR Humid Spikes)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Loading Assumption ({loadingAssumption}%)</label>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={loadingAssumption}
              onChange={(e) => setLoadingAssumption(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Main Studio View or Budget Mode View */}
      {!budgetMode ? (
        <>
          {/* Headline Note Alert */}
          {activeItem?.result.headline_notes && activeItem.result.headline_notes.length > 0 && (
            <div
              style={{
                backgroundColor: '#FFF8E1',
                border: '1px solid #FFE082',
                borderRadius: '4px',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#B78103', textTransform: 'uppercase' }}>
                Basis Risk & Climate Shift Notice
              </span>
              {activeItem.result.headline_notes.map((note, idx) => (
                <p key={idx} style={{ fontSize: '13px', color: '#684B00' }}>
                  {note}
                </p>
              ))}
            </div>
          )}

          {/* Actuarial Metrics Split Grid */}
          <div className="panel-grid">
            {/* Left: Trigger Tiers Definition */}
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Active Trigger Tiers</h3>
                  <p className="panel-subtitle">Threshold criteria and scheduled benefit per verified member</p>
                </div>
                <span className="badge badge-modelled">Modelled Rules</span>
              </div>

              <table className="dense-table">
                <thead>
                  <tr>
                    <th>Tier</th>
                    <th>Metric Threshold</th>
                    <th>Consecutive Days</th>
                    <th>Payout per Member</th>
                  </tr>
                </thead>
                <tbody>
                  {activeItem?.template.tiers.map((tier) => (
                    <tr key={tier.name}>
                      <td>
                        <span
                          className={`badge ${
                            tier.name === 'Advisory'
                              ? 'badge-advisory'
                              : tier.name === 'Partial'
                              ? 'badge-partial'
                              : 'badge-full'
                          }`}
                        >
                          {tier.name}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {tier.threshold_value}°C{' '}
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {activeItem.template.family.includes('wet_bulb') ? '(Wet-Bulb)' : '(Dry-Bulb)'}
                        </span>
                      </td>
                      <td>{activeItem.template.consecutive_days} {activeItem.template.consecutive_days === 1 ? 'day' : 'days'}</td>
                      <td style={{ fontWeight: 700, color: tier.payout_inr > 0 ? '#16191F' : 'var(--text-muted)' }}>
                        {tier.payout_inr > 0 ? `₹${tier.payout_inr}` : 'Advisory Only (₹0)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '16px', padding: '12px', background: '#FAFAFA', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Combined Indicative Premium (Modelled)
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                  ₹{combinedPremium}{' '}
                  <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-secondary)' }}>
                    per member / season (incl. {loadingAssumption}% loading)
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Validation Split (Train 1991-2015 vs Test 2016-2025) */}
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">Held-Out Historical Validation</h3>
                  <p className="panel-subtitle">Stress-tested across 35 years of ERA5 daily observations</p>
                </div>
                <span className="badge badge-modelled">Split Verification</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div className="metric-card">
                  <div className="metric-title">Train (1991–2015, 25 Yrs)</div>
                  <div className="metric-value">{trainMetrics?.payout_frequency_pct}%</div>
                  <div className="metric-sub">
                    {trainMetrics?.annual_payout_events_mean} events/yr · ₹{trainPremium} prem
                  </div>
                </div>

                <div className="metric-card" style={{ borderLeft: '3px solid #FF9900' }}>
                  <div className="metric-title">Test (2016–2025, 10 Yrs)</div>
                  <div className="metric-value" style={{ color: '#C0392B' }}>
                    {testMetrics?.payout_frequency_pct}%
                  </div>
                  <div className="metric-sub">
                    {testMetrics?.annual_payout_events_mean} events/yr · ₹{testPremium} prem
                  </div>
                </div>
              </div>

              <table className="dense-table">
                <thead>
                  <tr>
                    <th>Performance Metric</th>
                    <th>Train (1991–2015)</th>
                    <th>Test (2016–2025)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Evaluated Days</td>
                    <td>{trainMetrics?.total_days} days (Observed ERA5)</td>
                    <td>{testMetrics?.total_days} days (Observed ERA5)</td>
                  </tr>
                  <tr>
                    <td>Days Trigger Fired</td>
                    <td>{trainMetrics?.payout_days_count} days</td>
                    <td style={{ fontWeight: 600 }}>{testMetrics?.payout_days_count} days</td>
                  </tr>
                  <tr>
                    <td>Bad-Year Misses (Severe Loss Unpaid)</td>
                    <td>{trainMetrics?.bad_year_misses} days</td>
                    <td style={{ color: testMetrics && testMetrics.bad_year_misses > 0 ? '#C0392B' : 'inherit', fontWeight: 600 }}>
                      {testMetrics?.bad_year_misses} days
                    </td>
                  </tr>
                  <tr>
                    <td>False Payouts (Mild Loss Triggered)</td>
                    <td>{trainMetrics?.false_payouts} days</td>
                    <td>{testMetrics?.false_payouts} days</td>
                  </tr>
                  <tr>
                    <td>Uncompensated Worker Wage Loss</td>
                    <td>₹{trainMetrics?.uncompensated_wage_loss_inr} / member / yr</td>
                    <td style={{ color: '#C0392B', fontWeight: 600 }}>
                      ₹{testMetrics?.uncompensated_wage_loss_inr} / member / yr
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Budget Mode Screen */
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Per-Member Budget Solver</h3>
              <p className="panel-subtitle">
                Fit coverage to available programme funds, worker contributions, and donor subsidy gap
              </p>
            </div>
            <span className="badge badge-modelled">Actuarial Calibration</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <div className="form-group">
                <label className="form-label">Total Target Budget per Member per Season (INR)</label>
                <input
                  type="number"
                  className="form-input"
                  value={targetBudget}
                  step="50"
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Total funds available from all sources (worker fees + union reserves + sponsors)
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Worker Contribution per Season (INR)</label>
                <input
                  type="number"
                  className="form-input"
                  value={workerContrib}
                  step="25"
                  onChange={(e) => setWorkerContrib(Number(e.target.value))}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Informal worker willingness-to-pay benchmark (typically ₹100–₹200 / season)
                </span>
              </div>

              <div style={{ padding: '12px', background: '#FAFAFA', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Worker Self-Financed Share:</span>
                  <span style={{ fontWeight: 600 }}>₹{workerContrib} ({targetBudget > 0 ? Math.round((workerContrib / targetBudget) * 100) : 0}%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sponsor / Welfare Fund Share:</span>
                  <span style={{ fontWeight: 600 }}>₹{sponsorShare}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="metric-card" style={{ borderLeft: '4px solid #0972D3' }}>
                <div className="metric-title">Indicative Actuarial Premium for Adequate Protection</div>
                <div className="metric-value">₹{combinedPremium}</div>
                <div className="metric-sub">
                  Calculated based on {selectedCity.toUpperCase()} historical heatwave recurrence
                </div>
              </div>

              <div
                className="metric-card"
                style={{
                  borderLeft: budgetGap > 0 ? '4px solid #C0392B' : '4px solid #1E4620',
                  background: budgetGap > 0 ? '#FEECEB' : '#EDF7ED',
                }}
              >
                <div className="metric-title" style={{ color: budgetGap > 0 ? '#C0392B' : '#1E4620' }}>
                  {budgetGap > 0 ? 'Philanthropic / Subsidy Gap' : 'Fully Funded Budget'}
                </div>
                <div className="metric-value" style={{ color: budgetGap > 0 ? '#C0392B' : '#1E4620' }}>
                  {budgetGap > 0 ? `₹${budgetGap} / member deficit` : 'No Deficit (Sufficient Funds)'}
                </div>
                <div className="metric-sub" style={{ color: 'var(--text-secondary)' }}>
                  {budgetGap > 0
                    ? `For 25,000 workers, an external grant subsidy of ₹${((budgetGap * 25000) / 100000).toFixed(1)} Lakhs is needed to prevent basis risk.`
                    : 'Target budget covers the required actuarial risk premium.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

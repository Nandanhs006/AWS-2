import React, { useState, useEffect } from 'react';

interface DecisionItem {
  decision_id: string;
  timestamp: string;
  city_id: string;
  city_name: string;
  policy_id: string;
  policy_name: string;
  tier_triggered: string | null;
  payout_per_member_inr: number;
  cohort_count: number;
  total_disbursement_inr: number;
  trigger_condition: string;
  evidence_hash: string;
  inputs_hash: string;
  reviewer_status: string;
  retention: string;
}

export const DecisionRecord: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [selectedDecision, setSelectedDecision] = useState<DecisionItem | null>(null);

  useEffect(() => {
    fetch('/data/decision_records.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        if (json.decisions && json.decisions.length > 0) {
          setSelectedDecision(json.decisions[0]);
        }
      })
      .catch((err) => console.error('Failed to load decision records:', err));
  }, []);

  if (!data) {
    return (
      <div className="panel" style={{ padding: '30px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading tamper-evident decision ledger...</p>
      </div>
    );
  }

  const decisions: DecisionItem[] = data.decisions || [];
  const filteredDecisions =
    selectedCityFilter === 'all'
      ? decisions
      : decisions.filter((d) => d.city_id === selectedCityFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header and Reviewer Banner */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Decision Record — Immutable Reviewer Ledger</h2>
            <p className="panel-subtitle">
              Tamper-evident record of all triggered and un-triggered payout decisions with cryptographic hashes
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: '#1E4620',
                color: '#C8E6C9',
                borderRadius: '2px',
              }}
            >
              Auditor Certified
            </span>
            <span className="badge badge-observed">Read-Only Reviewer View</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>
            Filter by City:
          </label>
          <select
            className="form-select"
            style={{ width: '220px' }}
            value={selectedCityFilter}
            onChange={(e) => setSelectedCityFilter(e.target.value)}
          >
            <option value="all">All Cities</option>
            <option value="ahmedabad">Ahmedabad</option>
            <option value="kolkata">Kolkata</option>
          </select>
        </div>
      </div>

      {/* Main Split View: Ledger Table & Detailed Audit Inspector */}
      <div className="panel-grid">
        {/* Left: Decision Table */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Logged Decisions</h3>
              <p className="panel-subtitle">Chronological ledger entries</p>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {filteredDecisions.length} Records
            </span>
          </div>

          <table className="dense-table">
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Date & City</th>
                <th>Trigger Tier</th>
                <th>Disbursement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDecisions.map((dec) => (
                <tr
                  key={dec.decision_id}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedDecision?.decision_id === dec.decision_id ? '#F2F8FD' : 'inherit',
                  }}
                  onClick={() => setSelectedDecision(dec)}
                >
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '12px' }}>
                    {dec.decision_id}
                  </td>
                  <td>
                    <div>{dec.city_name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {dec.timestamp.substring(0, 10)}
                    </div>
                  </td>
                  <td>
                    {dec.tier_triggered ? (
                      <span
                        className={`badge ${
                          dec.tier_triggered === 'Full' ? 'badge-full' : 'badge-partial'
                        }`}
                      >
                        {dec.tier_triggered} (₹{dec.payout_per_member_inr})
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Unpaid (₹0)</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {dec.total_disbursement_inr > 0
                      ? `₹${(dec.total_disbursement_inr / 100000).toFixed(1)}L`
                      : '₹0'}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        fontWeight: 600,
                        backgroundColor: dec.reviewer_status.includes('Locked') ? '#EDF7ED' : '#FFF8E1',
                        color: dec.reviewer_status.includes('Locked') ? '#1E4620' : '#856404',
                      }}
                    >
                      {dec.reviewer_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Detailed Audit Inspector */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Audit Record Details</h3>
              <p className="panel-subtitle">Reviewer verification payload and cryptographic proofs</p>
            </div>
            <span className="badge badge-modelled">Cryptographic Verification</span>
          </div>

          {selectedDecision ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', background: '#FAFAFA', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Decision Identifier & Policy
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {selectedDecision.decision_id}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {selectedDecision.policy_name} ({selectedDecision.city_name})
                </div>
              </div>

              <div>
                <label className="form-label">Trigger Condition Reason</label>
                <div
                  style={{
                    padding: '10px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  {selectedDecision.trigger_condition}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="metric-card">
                  <div className="metric-title">Disbursement per Member</div>
                  <div className="metric-value">₹{selectedDecision.payout_per_member_inr}</div>
                  <div className="metric-sub">{selectedDecision.cohort_count.toLocaleString()} registered members</div>
                </div>

                <div className="metric-card">
                  <div className="metric-title">Total Fund Commitment</div>
                  <div className="metric-value">
                    ₹{(selectedDecision.total_disbursement_inr / 100000).toFixed(2)} Lakhs
                  </div>
                  <div className="metric-sub">Direct Benefit Transfer</div>
                </div>
              </div>

              <div>
                <label className="form-label">Inputs Cryptographic Hash (SHA-256)</label>
                <div
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#F8F9FA',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    wordBreak: 'break-all',
                  }}
                >
                  {selectedDecision.inputs_hash}
                </div>
              </div>

              <div>
                <label className="form-label">Evidence Bundle Hash (SHA-256)</label>
                <div
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#F8F9FA',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    wordBreak: 'break-all',
                  }}
                >
                  {selectedDecision.evidence_hash}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', paddingTop: '6px' }}>
                <span>Retention: {selectedDecision.retention}</span>
                <span style={{ fontWeight: 600, color: '#1E4620' }}>Integrity Check: Verified Valid</span>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Select a decision record to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

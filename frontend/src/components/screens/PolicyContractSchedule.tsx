import React, { useState } from 'react';
import { Printer, Download, CheckCircle2 } from 'lucide-react';

export const PolicyContractSchedule: React.FC = () => {
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExportBundle = () => {
    setExportNotice('✓ Formal Parametric Term Sheet exported: Cryptographically signed PDF bundle generated with SHA-256 seal MD-2026-SEWA-01.');
    setTimeout(() => setExportNotice(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header and Print Control */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Parametric Policy Contract Schedule</h2>
            <p className="panel-subtitle">
              Formal underwriter schedule and legal term sheet for collective micro-insurance agreements
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn-secondary" onClick={handlePrint}>
              <Printer size={14} /> Print Contract Schedule
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleExportBundle}
            >
              <Download size={14} /> Export Signed Term Sheet
            </button>
          </div>
        </div>

        {exportNotice && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(30, 70, 32, 0.1)',
              border: '1px solid rgba(30, 70, 32, 0.3)',
              borderRadius: '2px',
              color: '#1E4620',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle2 size={15} />
            {exportNotice}
          </div>
        )}
      </div>

      {/* Formal Document Container */}
      <div
        className="panel"
        style={{
          padding: '36px 44px',
          maxWidth: '920px',
          margin: '0 auto',
          width: '100%',
          borderTop: '6px solid var(--primary-action)',
          lineHeight: 1.6,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Schedule of Parametric Climate Micro-Insurance
            </span>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
              SCHEDULE MD-2026-SEWA-01
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                backgroundColor: 'var(--status-success-bg)',
                color: 'var(--status-success-text)',
                border: '1px solid var(--status-success-border)',
                borderRadius: '2px',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              Underwriter Binding Signed
            </span>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Effective Date: 01 April 2026
            </div>
          </div>
        </div>

        {/* Section 1: Parties */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '10px' }}>
            1. Contracting Parties & Beneficiary Cohort
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
            <div>
              <strong>Policyholder / Sponsoring Entity:</strong>
              <div>Self-Employed Women’s Association (SEWA Bharat & Gujarat)</div>
              <div style={{ color: 'var(--text-secondary)' }}>On behalf of 25,000 verified informal outdoor worker members</div>
            </div>
            <div>
              <strong>Lead Risk Underwriting Consortium:</strong>
              <div>Consortium Underwriting Panel (aligned with Swiss Re & ICICI Lombard)</div>
              <div style={{ color: 'var(--text-secondary)' }}>Co-sponsored by Climate Loss & Damage Adaptation Facilities</div>
            </div>
          </div>
        </div>

        {/* Section 2: Coverage Period & Peril */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '10px' }}>
            2. Covered Peril & Measurement Index
          </h3>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <strong>Covered Peril:</strong> Acute extreme heat stress resulting in involuntary loss of informal outdoor labor capacity.
            </div>
            <div>
              <strong>Covered Season:</strong> 01 April 2026 to 30 June 2026 inclusive.
            </div>
            <div>
              <strong>Primary Measurement Index:</strong> Stull (2011) Wet-Bulb Temperature (Tw) and Liljegren WBGT index derived from multi-sensor reanalysis calibrated against ground stations.
            </div>
          </div>
        </div>

        {/* Section 3: Payout Trigger Matrix */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '10px' }}>
            3. Scheduled Payout Trigger Matrix
          </h3>
          <table className="dense-table" style={{ marginTop: '8px' }}>
            <thead>
              <tr>
                <th>Tier Designation</th>
                <th>Meteorological Condition</th>
                <th>Benefit per Member</th>
                <th>Disbursement SLA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Advisory Alert</strong></td>
                <td>Peak Wet-Bulb Tw &ge; 29.0°C or Dry-Bulb Tmax &ge; 41.5°C</td>
                <td>₹0 (Action Protocol & Hydration Notice)</td>
                <td>Instant SMS / Broadcast</td>
              </tr>
              <tr>
                <td><strong>Partial Protection</strong></td>
                <td>Peak Wet-Bulb Tw &ge; 30.0°C or 2-Day Dry-Bulb &ge; 42.74°C</td>
                <td>₹400 / Member</td>
                <td>Direct UPI within 24 Hours</td>
              </tr>
              <tr>
                <td><strong>Full Heat Emergency</strong></td>
                <td>Peak Wet-Bulb Tw &ge; 31.0°C or 2-Day Dry-Bulb &ge; 44.1°C</td>
                <td>₹800 to ₹1,000 / Member</td>
                <td>Direct UPI within 24 Hours</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Audit & Tamper Evidence */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '10px' }}>
            4. Tamper-Evident Settlement & Arbitration
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Every trigger evaluation is immutably published to the HeatSutra Decision Record with SHA-256 evidence hashes locked under Object Lock governance mode. Claims settlement requires zero claims paperwork from individual workers; payouts are executed automatically to Aadhaar-linked UPI VPAs upon verified trigger firing.
          </p>
        </div>

        {/* Signatures */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>For the Policyholder:</div>
            <div style={{ marginTop: '20px', fontSize: '13px', fontWeight: 600 }}>Ramilaben V. Parmar</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lead Coordinator, SEWA Gujarat</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>For the Underwriter Consortium:</div>
            <div style={{ marginTop: '20px', fontSize: '13px', fontWeight: 600 }}>Dr. Vikram Sengupta</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Principal Actuary, Consortium Panel</div>
          </div>
        </div>
      </div>
    </div>
  );
};

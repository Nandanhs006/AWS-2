import React, { useState } from 'react';
import { RefreshCw, Download } from 'lucide-react';

interface UpiTransaction {
  txn_id: string;
  worker_id: string;
  name: string;
  vpa: string;
  amount_inr: number;
  rrn_code: string;
  status: 'Settled' | 'Processing' | 'Failed (VPA Inactive)';
  timestamp: string;
}

const SAMPLE_TRANSACTIONS: UpiTransaction[] = [
  {
    txn_id: 'TXN-UPI-20261011-8012',
    worker_id: 'SEWA-AHM-10021',
    name: 'Ramilaben V. Parmar',
    vpa: '98250XXXXX@sbi',
    amount_inr: 400,
    rrn_code: '428819028811',
    status: 'Settled',
    timestamp: '07:15:22 IST',
  },
  {
    txn_id: 'TXN-UPI-20261011-8013',
    worker_id: 'SEWA-AHM-10044',
    name: 'Kankuben D. Solanki',
    vpa: '98791XXXXX@upi',
    amount_inr: 400,
    rrn_code: '428819028812',
    status: 'Settled',
    timestamp: '07:15:24 IST',
  },
  {
    txn_id: 'TXN-UPI-20261011-8014',
    worker_id: 'SEWA-AHM-10118',
    name: 'Lilaben M. Vaghela',
    vpa: 'lilaben@oksbi',
    amount_inr: 400,
    rrn_code: '428819028813',
    status: 'Settled',
    timestamp: '07:15:25 IST',
  },
  {
    txn_id: 'TXN-UPI-20261011-8015',
    worker_id: 'SEWA-AHM-10355',
    name: 'Manjulaben P. Chauhan',
    vpa: 'manjula@paytm',
    amount_inr: 400,
    rrn_code: '428819028814',
    status: 'Failed (VPA Inactive)',
    timestamp: '07:15:28 IST',
  },
  {
    txn_id: 'TXN-UPI-20261011-8016',
    worker_id: 'SEWA-KOL-20104',
    name: 'Subhashish Das',
    vpa: 'subhashish@paytm',
    amount_inr: 400,
    rrn_code: '428819028815',
    status: 'Settled',
    timestamp: '07:15:30 IST',
  },
];

export const DisbursementSandbox: React.FC = () => {
  const [transactions, setTransactions] = useState<UpiTransaction[]>(SAMPLE_TRANSACTIONS);
  const [retrying, setRetrying] = useState(false);

  const totalAmount = transactions.reduce((acc, t) => acc + t.amount_inr, 0);
  const settledCount = transactions.filter((t) => t.status === 'Settled').length;
  const failedCount = transactions.filter((t) => t.status.includes('Failed')).length;

  const handleRetryFailed = () => {
    setRetrying(true);
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((t) =>
          t.status.includes('Failed')
            ? { ...t, status: 'Settled', rrn_code: '428819029999', timestamp: 'Just now (Retried)' }
            : t
        )
      );
      setRetrying(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Panel */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Direct Benefit Transfer (DBT) UPI Batch Engine</h2>
            <p className="panel-subtitle">
              Simulated NPCI UPI Aadhaar-linked payment processing sandbox with real-time settlement reconciliation
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleRetryFailed}
              disabled={retrying || failedCount === 0}
            >
              <RefreshCw size={14} className={retrying ? 'animate-spin' : ''} />
              {retrying ? 'Retrying Failed VPAs...' : 'Retry Failed Transfers'}
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => alert('Bank Reconciliation File (NACH/NPCI Format) exported.')}
            >
              <Download size={14} /> Export Settlement Advice
            </button>
          </div>
        </div>

        {/* Batch Status Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div className="metric-card" style={{ borderLeft: '3px solid #0972D3' }}>
            <div className="metric-title">Active Batch Identifier</div>
            <div className="metric-value" style={{ fontSize: '16px', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
              DBT-20261011-KOL
            </div>
            <div className="metric-sub">Kolkata Humid-Heat Partial Tier</div>
          </div>

          <div className="metric-card" style={{ borderLeft: '3px solid #1E4620' }}>
            <div className="metric-title">Settled Transactions (UPI 2.0)</div>
            <div className="metric-value" style={{ color: '#1E4620' }}>
              {settledCount} / {transactions.length}
            </div>
            <div className="metric-sub">Directly deposited to worker accounts</div>
          </div>

          <div className="metric-card" style={{ borderLeft: '3px solid #C0392B' }}>
            <div className="metric-title">Failed / Dormant VPAs</div>
            <div className="metric-value" style={{ color: failedCount > 0 ? '#C0392B' : '#1E4620' }}>
              {failedCount}
            </div>
            <div className="metric-sub">Queued for SMS fallback / bank assist</div>
          </div>

          <div className="metric-card" style={{ borderLeft: '3px solid #FF9900' }}>
            <div className="metric-title">Total Batch Disbursement</div>
            <div className="metric-value">₹{totalAmount.toLocaleString()}</div>
            <div className="metric-sub">Average latency: 1.4 seconds</div>
          </div>
        </div>
      </div>

      {/* Real-time Ledger */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Real-Time Transaction Stream</h3>
            <p className="panel-subtitle">NPCI Retrieval Reference Numbers (RRN) and beneficiary settlement status</p>
          </div>
          <span className="badge badge-observed">NPCI Switch Connected</span>
        </div>

        <table className="dense-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Member ID & Name</th>
              <th>Destination VPA</th>
              <th>Disbursement Amount</th>
              <th>NPCI RRN</th>
              <th>Settlement Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.txn_id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{txn.txn_id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{txn.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{txn.worker_id}</div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{txn.vpa}</td>
                <td style={{ fontWeight: 700 }}>₹{txn.amount_inr}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{txn.rrn_code}</td>
                <td>
                  <span
                    className={`badge ${
                      txn.status === 'Settled'
                        ? 'badge-observed'
                        : txn.status.includes('Failed')
                        ? 'badge-full'
                        : 'badge-advisory'
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{txn.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

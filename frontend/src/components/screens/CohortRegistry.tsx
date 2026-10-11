import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Beneficiary {
  id: string;
  name: string;
  city: string;
  trade: string;
  vulnerability_tier: 'Critical' | 'High' | 'Moderate';
  heat_exposure_multiplier: number;
  aadhaar_verified: boolean;
  upi_vpa: string;
  sewa_union_id: string;
  last_payout_date: string;
}

const BENEFICIARIES: Beneficiary[] = [
  {
    id: 'BEN-AHM-10021',
    name: 'Ramilaben V. Parmar',
    city: 'Ahmedabad',
    trade: 'Street Vegetable Vendor',
    vulnerability_tier: 'Critical',
    heat_exposure_multiplier: 1.25,
    aadhaar_verified: true,
    upi_vpa: '98250XXXXX@sbi',
    sewa_union_id: 'SEWA-GJ-8821',
    last_payout_date: '2024-05-24',
  },
  {
    id: 'BEN-AHM-10044',
    name: 'Kankuben D. Solanki',
    city: 'Ahmedabad',
    trade: 'Construction Laborer',
    vulnerability_tier: 'Critical',
    heat_exposure_multiplier: 1.35,
    aadhaar_verified: true,
    upi_vpa: '98791XXXXX@upi',
    sewa_union_id: 'SEWA-GJ-9042',
    last_payout_date: '2024-05-24',
  },
  {
    id: 'BEN-AHM-10118',
    name: 'Lilaben M. Vaghela',
    city: 'Ahmedabad',
    trade: 'Tin-Roof Garment Worker',
    vulnerability_tier: 'High',
    heat_exposure_multiplier: 1.20,
    aadhaar_verified: true,
    upi_vpa: 'lilaben@oksbi',
    sewa_union_id: 'SEWA-GJ-4311',
    last_payout_date: '2024-05-24',
  },
  {
    id: 'BEN-KOL-20104',
    name: 'Subhashish Das',
    city: 'Kolkata',
    trade: 'Wholesale Headload Porter',
    vulnerability_tier: 'Critical',
    heat_exposure_multiplier: 1.30,
    aadhaar_verified: true,
    upi_vpa: 'subhashish@paytm',
    sewa_union_id: 'WB-HWW-0921',
    last_payout_date: '2024-04-29',
  },
  {
    id: 'BEN-KOL-20233',
    name: 'Pratima Mondal',
    city: 'Kolkata',
    trade: 'Pavement Fish Seller',
    vulnerability_tier: 'Critical',
    heat_exposure_multiplier: 1.25,
    aadhaar_verified: true,
    upi_vpa: 'pratima@axisbank',
    sewa_union_id: 'WB-FSW-1144',
    last_payout_date: '2024-04-29',
  },
  {
    id: 'BEN-SHL-30012',
    name: 'Gajanan Rao Koli',
    city: 'Sholapur',
    trade: 'Powerloom Shed Operator',
    vulnerability_tier: 'High',
    heat_exposure_multiplier: 1.20,
    aadhaar_verified: true,
    upi_vpa: 'gajanan@icici',
    sewa_union_id: 'MH-PLO-5510',
    last_payout_date: '2024-05-22',
  },
  {
    id: 'BEN-SHL-30089',
    name: 'Sunita Mane',
    city: 'Sholapur',
    trade: 'Agricultural Day Laborer',
    vulnerability_tier: 'Critical',
    heat_exposure_multiplier: 1.35,
    aadhaar_verified: true,
    upi_vpa: 'sunita@okhdfc',
    sewa_union_id: 'MH-ALW-6721',
    last_payout_date: '2024-05-22',
  },
  {
    id: 'BEN-AHM-10202',
    name: 'Bhavnaben K. Rathod',
    city: 'Ahmedabad',
    trade: 'Salt Pan Worker (Surendranagar)',
    vulnerability_tier: 'Critical',
    heat_exposure_multiplier: 1.40,
    aadhaar_verified: true,
    upi_vpa: 'bhavna@axisbank',
    sewa_union_id: 'SEWA-SP-1092',
    last_payout_date: '2024-05-24',
  },
];

export const CohortRegistry: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = BENEFICIARIES.filter((b) => {
    const matchCity = selectedCity === 'all' || b.city.toLowerCase() === selectedCity.toLowerCase();
    const matchTier = selectedTier === 'all' || b.vulnerability_tier === selectedTier;
    const matchSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trade.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCity && matchTier && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header and Summary Ribbon */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Worker Cohort Registry & Micro-Vulnerability Index</h2>
            <p className="panel-subtitle">
              Enrolled informal worker database with occupational microclimate risk segmentation and Aadhaar-verified UPI mappings
            </p>
          </div>
          <span className="badge badge-observed">25,000 Enrolled Members</span>
        </div>

        {/* Cohort Occupational Categories Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '14px' }}>
          <div className="metric-card" style={{ borderLeft: '3px solid #C0392B' }}>
            <div className="metric-title">Street Hawkers & Vendors</div>
            <div className="metric-value">9,400</div>
            <div className="metric-sub">1.25x Asphalt Reflected Heat Multiplier</div>
          </div>

          <div className="metric-card" style={{ borderLeft: '3px solid #78281F' }}>
            <div className="metric-title">Scaffolding & Construction</div>
            <div className="metric-value">6,800</div>
            <div className="metric-sub">1.35x Metal Insolation Multiplier</div>
          </div>

          <div className="metric-card" style={{ borderLeft: '3px solid #FF9900' }}>
            <div className="metric-title">Salt Pan & Agricultural Day Labor</div>
            <div className="metric-value">5,200</div>
            <div className="metric-sub">1.40x Direct Solar Radiation Multiplier</div>
          </div>

          <div className="metric-card" style={{ borderLeft: '3px solid #0972D3' }}>
            <div className="metric-title">Tin-Roof & Indoor Mill Workers</div>
            <div className="metric-value">3,600</div>
            <div className="metric-sub">1.20x Trapped Thermal Load Multiplier</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '34px' }}
              placeholder="Search by worker name, member ID, or trade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="all">All Cities</option>
            <option value="ahmedabad">Ahmedabad</option>
            <option value="kolkata">Kolkata</option>
            <option value="sholapur">Sholapur</option>
          </select>

          <select
            className="form-select"
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
          >
            <option value="all">All Vulnerability Tiers</option>
            <option value="Critical">Critical (Multiplier ≥ 1.25x)</option>
            <option value="High">High (Multiplier 1.20x)</option>
          </select>
        </div>
      </div>

      {/* Beneficiary Roster Table */}
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">Active Member Roster ({filtered.length} Displayed)</h3>
            <p className="panel-subtitle">Direct Benefit Transfer destination accounts</p>
          </div>
          <span className="badge badge-observed">Aadhaar / PM-Jan Dhan Linked</span>
        </div>

        <table className="dense-table">
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Full Name</th>
              <th>City</th>
              <th>Trade / Occupation</th>
              <th>Vulnerability Tier</th>
              <th>Exposure Factor</th>
              <th>UPI Virtual Address</th>
              <th>Last Relief Payout</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{member.id}</td>
                <td style={{ fontWeight: 600 }}>
                  {member.name}{' '}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ({member.sewa_union_id})
                  </span>
                </td>
                <td>{member.city}</td>
                <td>{member.trade}</td>
                <td>
                  <span
                    className={`badge ${
                      member.vulnerability_tier === 'Critical' ? 'badge-full' : 'badge-advisory'
                    }`}
                  >
                    {member.vulnerability_tier}
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--primary-action-text)' }}>
                  {member.heat_exposure_multiplier}x
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{member.upi_vpa}</td>
                <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {member.last_payout_date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

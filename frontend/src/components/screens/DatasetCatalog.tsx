import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle2, Search, FileCode2 } from 'lucide-react';

interface DatasetItem {
  id: string;
  name: string;
  institution: string;
  spatial_resolution: string;
  temporal_coverage: string;
  parameters: string[];
  license: string;
  api_access: string;
  source_url: string;
  role_in_engine: string;
  sample_record: Record<string, any>;
}

interface DatasetsCatalogPayload {
  catalog_title: string;
  description: string;
  last_synced: string;
  datasets: DatasetItem[];
}

export const DatasetCatalog: React.FC = () => {
  const [catalog, setCatalog] = useState<DatasetsCatalogPayload | null>(null);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('copernicus-era5-land');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewTab, setViewTab] = useState<'overview' | 'inspector' | 'matrix'>('overview');

  useEffect(() => {
    fetch('/data/datasets_registry.json')
      .then((res) => res.json())
      .then((data) => setCatalog(data))
      .catch((err) => console.error('Failed to load datasets registry', err));
  }, []);

  if (!catalog) {
    return (
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading open datasets registry...</div>
      </div>
    );
  }

  const selectedDataset = catalog.datasets.find((d) => d.id === selectedDatasetId) || catalog.datasets[0];

  const filteredDatasets = catalog.datasets.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.parameters.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} />
                Open Access & Free Telemetry
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {catalog.datasets.length} Active Public Sources Ingested
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
              Open Climate & Worker Datasets Registry
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '820px', lineHeight: 1.5 }}>
              Mausam Dhaal grounds all parametric calculations in freely accessible, peer-reviewed global climate reanalyses,
              official India Meteorological Department gridded observations, NASA insolation records, and national informal labour databases.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`nav-tab-btn ${viewTab === 'overview' ? 'active' : ''}`}
              onClick={() => setViewTab('overview')}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Datasets Catalog
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${viewTab === 'inspector' ? 'active' : ''}`}
              onClick={() => setViewTab('inspector')}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Payload Inspector
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${viewTab === 'matrix' ? 'active' : ''}`}
              onClick={() => setViewTab('matrix')}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Basis Risk Attribution
            </button>
          </div>
        </div>
      </div>

      {viewTab === 'overview' && (
        <>
          {/* Search Bar */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search datasets by provider, parameters, or variables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '32px', fontSize: '12px' }}
              />
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Showing {filteredDatasets.length} of {catalog.datasets.length} sources
            </span>
          </div>

          {/* Dataset Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
            {filteredDatasets.map((ds) => (
              <div
                key={ds.id}
                className="card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: ds.id === selectedDatasetId ? '4px solid var(--aws-orange)' : undefined,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSelectedDatasetId(ds.id);
                  setViewTab('inspector');
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span className="badge" style={{ backgroundColor: 'rgba(9, 114, 211, 0.1)', color: '#0972D3', fontWeight: 600 }}>
                      {ds.spatial_resolution}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{ds.license.split('(')[0]}</span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                    {ds.name}
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--aws-orange)', fontWeight: 600, marginBottom: '8px' }}>
                    {ds.institution}
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '12px' }}>
                    {ds.role_in_engine}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                    {ds.parameters.slice(0, 3).map((param, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '2px',
                          backgroundColor: 'var(--bg-app)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        {param}
                      </span>
                    ))}
                    {ds.parameters.length > 3 && (
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', padding: '2px 4px' }}>
                        +{ds.parameters.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '11px',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Coverage: {ds.temporal_coverage}</span>
                  <a
                    href={ds.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--aws-blue)',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Source <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewTab === 'inspector' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '16px' }}>
          {/* Left Selection List */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Select Source to Inspect
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {catalog.datasets.map((ds) => (
                <button
                  key={ds.id}
                  type="button"
                  onClick={() => setSelectedDatasetId(ds.id)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: '2px',
                    backgroundColor: ds.id === selectedDatasetId ? 'rgba(255, 153, 0, 0.12)' : 'transparent',
                    border: ds.id === selectedDatasetId ? '1px solid var(--aws-orange)' : '1px solid transparent',
                    cursor: 'pointer',
                    color: ds.id === selectedDatasetId ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{ds.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>{ds.institution}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Inspection Details */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-success" style={{ marginBottom: '6px' }}>{selectedDataset.license}</span>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0', color: 'var(--text-primary)' }}>
                  {selectedDataset.name}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--aws-orange)', fontWeight: 600 }}>
                  {selectedDataset.institution}
                </div>
              </div>

              <a
                href={selectedDataset.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                Open Official Repository <ExternalLink size={13} />
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Spatial Grid</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedDataset.spatial_resolution}
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Temporal Record</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedDataset.temporal_coverage}
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Ingestion Access Protocol</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0972D3', marginTop: '2px' }}>
                  {selectedDataset.api_access.split('/')[0]}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Role in Mausam Dhaal Engine
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {selectedDataset.role_in_engine}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Ingested Parameters & Variables
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedDataset.parameters.map((p, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(9, 114, 211, 0.08)',
                      color: 'var(--aws-blue)',
                      border: '1px solid rgba(9, 114, 211, 0.2)',
                      fontWeight: 500,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Record Preview */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCode2 size={14} color="var(--aws-orange)" />
                  Sample Telemetry Payload (JSON)
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Live Normalized Format</span>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: '16px',
                  backgroundColor: '#1E293B',
                  color: '#F8FAFC',
                  borderRadius: '2px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                }}
              >
                {JSON.stringify(selectedDataset.sample_record, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {viewTab === 'matrix' && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
              Data Triangulation & Basis Risk Attribution Matrix
            </h2>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              How Mausam Dhaal reconciles differences between official meteorological instruments and informal worker microclimates.
            </p>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data Layer</th>
                  <th>Primary Source</th>
                  <th>Spatial Scale</th>
                  <th>Known Basis Risk Blind Spot</th>
                  <th>Mausam Dhaal Mitigation Engine</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Airport Runway Thermometers</td>
                  <td>IMD Airport Weather Stations (AWS)</td>
                  <td>Point sensor (Runway tarmac)</td>
                  <td style={{ color: '#D13212' }}>
                    Fails to capture urban heat island effects; unshaded informal workers endure +3.5°C higher radiant heat.
                  </td>
                  <td>Applied empirical ward-level Urban Heat Island offset (+2.5°C to +4.5°C) calibrated via ISRO Bhuvan TIR.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>ERA5-Land Climate Reanalysis</td>
                  <td>Copernicus C3S / ECMWF</td>
                  <td>0.1° (~9 km grid)</td>
                  <td style={{ color: '#B35900' }}>
                    Smooths local micro-convective spikes; underestimates extreme dry-bulb peaks by ~0.7°C.
                  </td>
                  <td>Used for 35-year historical pricing distribution, validated against IMD Pune gridded observations.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Solar Radiation & Insolation</td>
                  <td>NASA POWER (MERRA-2)</td>
                  <td>0.5° x 0.625° global grid</td>
                  <td style={{ color: '#0972D3' }}>
                    Calculates top-of-atmosphere and surface irradiance, but does not capture informal tin-roof trapping.
                  </td>
                  <td>Integrated with Mahila Housing Trust (MHT) logger telemetry to adjust indoor worker triggers.</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Informal Worker Demographics</td>
                  <td>Ministry of Labour e-Shram</td>
                  <td>District & Trade Aggregates</td>
                  <td style={{ color: '#1E4620' }}>
                    Static registration counts; requires verification of live daily wage losses.
                  </td>
                  <td>Linked to SEWA union verified roster and Aadhaar/UPI disbursement sandbox.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

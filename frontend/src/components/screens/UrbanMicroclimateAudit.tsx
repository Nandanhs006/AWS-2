import React, { useState, useEffect } from 'react';
import { Flame, Gauge } from 'lucide-react';

interface WardDetail {
  ward_name: string;
  category: string;
  roof_type: string;
  vegetation_cover_pct: number;
  lst_anomaly_c: number;
  wbgt_offset_c: number;
  worker_density_sqkm: number;
  basis_risk_impact: string;
}

interface CityMicroclimate {
  city_id: string;
  city_name: string;
  state: string;
  official_airport_station: string;
  climate_zone: string;
  average_urban_heat_island_offset_c: number;
  max_microclimate_discrepancy_c: number;
  wards: WardDetail[];
}

export const UrbanMicroclimateAudit: React.FC = () => {
  const [citiesData, setCitiesData] = useState<CityMicroclimate[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>('ahmedabad');
  const [simAmbientTemp, setSimAmbientTemp] = useState<number>(43.0);
  const [selectedWardIndex, setSelectedWardIndex] = useState<number>(0);

  useEffect(() => {
    fetch('/data/urban_heat_islands.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.cities) {
          setCitiesData(data.cities);
        }
      })
      .catch((err) => console.error('Failed to load urban heat island data', err));
  }, []);

  if (citiesData.length === 0) {
    return (
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading urban microclimate telemetry...</div>
      </div>
    );
  }

  const currentCity = citiesData.find((c) => c.city_id === selectedCityId) || citiesData[0];
  const activeWard = currentCity.wards[selectedWardIndex] || currentCity.wards[0];

  // Microclimate Heat Calculations
  const effectiveWardTemp = Math.round((simAmbientTemp + activeWard.lst_anomaly_c) * 10) / 10;
  const effectiveWbgt = Math.round((30.5 + activeWard.wbgt_offset_c) * 10) / 10;
  const sweatRatePerHour = Math.round((0.8 + (effectiveWardTemp - 38.0) * 0.12) * 100) / 100;
  const cardiacStrain = effectiveWbgt >= 32.5 ? 'Extreme (Heat Stroke Threshold)' : effectiveWbgt >= 30.0 ? 'High (Vasodilation Limit)' : 'Moderate';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={12} />
                Urban Heat Island (UHI) Ward Telemetry
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                ISRO Bhuvan TIR & MHT Ground Logger Calibrated
              </span>
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
              Ward-Level Microclimate & Basis Risk Audit
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '840px', lineHeight: 1.5 }}>
              Parametric triggers relying solely on airport runways overlook informal settlements where corrugated tin roofing,
              asbestos sheds, asphalt radiation, and absent tree canopies create microclimates +3.5°C to +5.2°C hotter than official sensors.
            </p>
          </div>

          {/* City Selector */}
          <div style={{ minWidth: '220px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Select Pilot City ({citiesData.length} Covered)
            </label>
            <select
              value={selectedCityId}
              onChange={(e) => {
                setSelectedCityId(e.target.value);
                setSelectedWardIndex(0);
              }}
              style={{ width: '100%', fontSize: '13px', padding: '8px' }}
            >
              {citiesData.map((c) => (
                <option key={c.city_id} value={c.city_id}>
                  {c.city_name} ({c.state})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* City Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Official Sensor Station</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            {currentCity.official_airport_station}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Baseline runway elevation</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Average UHI Heat Offset</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#D13212', marginTop: '4px' }}>
            +{currentCity.average_urban_heat_island_offset_c}°C
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Over airport runway readings</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Max Microclimate Gap</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#B35900', marginTop: '4px' }}>
            +{currentCity.max_microclimate_discrepancy_c}°C
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Tin-roof informal colonies</div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Climate Classification</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            {currentCity.climate_zone}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Macro meteorological zone</div>
        </div>
      </div>

      {/* Ward Cards Grid */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
          Monitored Microclimate Wards in {currentCity.city_name}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {currentCity.wards.map((ward, idx) => (
            <div
              key={idx}
              className="card"
              onClick={() => setSelectedWardIndex(idx)}
              style={{
                padding: '16px',
                cursor: 'pointer',
                border: selectedWardIndex === idx ? '2px solid var(--aws-orange)' : '1px solid var(--border-color)',
                backgroundColor: selectedWardIndex === idx ? 'rgba(255, 153, 0, 0.05)' : 'var(--bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span
                    className="badge"
                    style={{
                      backgroundColor: ward.lst_anomaly_c > 0 ? 'rgba(209, 50, 18, 0.1)' : 'rgba(30, 70, 32, 0.1)',
                      color: ward.lst_anomaly_c > 0 ? '#D13212' : '#1E4620',
                      fontWeight: 700,
                    }}
                  >
                    {ward.lst_anomaly_c > 0 ? `+${ward.lst_anomaly_c}°C` : `${ward.lst_anomaly_c}°C`} LST Anomaly
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    {ward.vegetation_cover_pct}% Canopy
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {ward.ward_name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--aws-orange)', marginBottom: '8px' }}>
                  {ward.category}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <div>Roof: <strong>{ward.roof_type}</strong></div>
                  <div>Outdoor WBGT Offset: <strong>+{ward.wbgt_offset_c}°C</strong></div>
                  <div>Worker Density: <strong>{ward.worker_density_sqkm.toLocaleString()} / km²</strong></div>
                </div>
              </div>

              <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', fontSize: '10px', color: '#D13212', fontWeight: 600 }}>
                {ward.basis_risk_impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Microclimate Heat Stress Simulator */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Gauge size={16} color="var(--aws-orange)" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Physiological Labor Heat Stress Simulator ({activeWard.ward_name})
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              See how the ward microclimate amplifies bodily strain and why the official airport thermometer missed the relief trigger.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Official Airport Temp:</span>
            <input
              type="range"
              min="36.0"
              max="47.0"
              step="0.5"
              value={simAmbientTemp}
              onChange={(e) => setSimAmbientTemp(parseFloat(e.target.value))}
              style={{ width: '130px' }}
            />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', minWidth: '46px' }}>
              {simAmbientTemp.toFixed(1)}°C
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Official Station Reading</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {simAmbientTemp.toFixed(1)}°C
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Airport weather station</div>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'rgba(209, 50, 18, 0.08)', border: '1px solid rgba(209, 50, 18, 0.25)', borderRadius: '2px' }}>
            <div style={{ fontSize: '11px', color: '#D13212', fontWeight: 600 }}>Actual Worksite Temperature</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#D13212', marginTop: '4px' }}>
              {effectiveWardTemp.toFixed(1)}°C
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              +{activeWard.lst_anomaly_c}°C ward heat island
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'rgba(255, 153, 0, 0.08)', border: '1px solid rgba(255, 153, 0, 0.25)', borderRadius: '2px' }}>
            <div style={{ fontSize: '11px', color: '#B35900', fontWeight: 600 }}>Simulated Worker WBGT Index</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#B35900', marginTop: '4px' }}>
              {effectiveWbgt.toFixed(1)}°C
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Sweat rate: ~{sweatRatePerHour} L/hr
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '2px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Physiological Strain Status</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: effectiveWbgt >= 32.0 ? '#D13212' : '#B35900', marginTop: '8px' }}>
              {cardiacStrain}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Productivity loss: ~{Math.min(100, Math.round((effectiveWbgt - 20) * 2.5))}%
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: 'rgba(9, 114, 211, 0.06)', borderLeft: '4px solid var(--aws-blue)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong>HeatSutra Microclimate Calibration:</strong> While the airport registered {simAmbientTemp.toFixed(1)}°C
          (often below the arbitrary 43.6°C pilot threshold), workers in {activeWard.ward_name} experienced {effectiveWardTemp.toFixed(1)}°C
          with WBGT reaching {effectiveWbgt.toFixed(1)}°C. By implementing Stull wet-bulb triggers or microclimate offset correction,
          HeatSutra guarantees relief payouts fire on these dangerous uncompensated heat days.
        </div>
      </div>
    </div>
  );
};

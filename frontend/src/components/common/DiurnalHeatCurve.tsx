import React, { useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

export interface DiurnalPoint {
  hour: string;
  t_max_c: number;
  rh_pct: number;
  tw_c: number;
  wbgt_c: number;
  danger_zone: boolean;
}

interface DiurnalHeatCurveProps {
  curve: DiurnalPoint[];
  cityName: string;
}

export const DiurnalHeatCurve: React.FC<DiurnalHeatCurveProps> = ({ curve, cityName }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(14); // Default to 14:00 (peak afternoon heat)
  const [showTa, setShowTa] = useState(true);
  const [showTw, setShowTw] = useState(true);
  const [showWbgt, setShowWbgt] = useState(true);

  if (!curve || curve.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Diurnal temperature curve data unavailable for this hub.
      </div>
    );
  }

  // SVG Chart Dimensions
  const svgWidth = 860;
  const svgHeight = 250;
  const margin = { top: 30, right: 35, bottom: 35, left: 45 };
  const plotWidth = svgWidth - margin.left - margin.right;
  const plotHeight = svgHeight - margin.top - margin.bottom;

  // Temperature Bounds (°C)
  const yMin = 18;
  const yMax = 48;

  const getX = (idx: number) => margin.left + (idx / (curve.length - 1)) * plotWidth;
  const getY = (temp: number) => {
    const clamped = Math.max(yMin, Math.min(yMax, temp));
    return margin.top + plotHeight - ((clamped - yMin) / (yMax - yMin)) * plotHeight;
  };

  // Build SVG Path strings using smooth Bézier curves
  const buildSmoothPath = (values: number[]) => {
    if (values.length === 0) return '';
    const points = values.map((val, idx) => ({ x: getX(idx), y: getY(val) }));
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return path;
  };

  // Build Area Path for Dry-Bulb Underfill
  const buildAreaPath = (values: number[]) => {
    const linePath = buildSmoothPath(values);
    if (!linePath) return '';
    const bottomY = margin.top + plotHeight;
    const startX = getX(0);
    const endX = getX(values.length - 1);
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  const taValues = curve.map((p) => p.t_max_c);
  const twValues = curve.map((p) => p.tw_c);
  const wbgtValues = curve.map((p) => p.wbgt_c);

  const taPath = buildSmoothPath(taValues);
  const taAreaPath = buildAreaPath(taValues);
  const twPath = buildSmoothPath(twValues);
  const wbgtPath = buildSmoothPath(wbgtValues);

  // Danger Band (11:30 AM to 16:30 PM)
  const dangerXStart = margin.left + (11.5 / (curve.length - 1)) * plotWidth;
  const dangerXEnd = margin.left + (16.5 / (curve.length - 1)) * plotWidth;
  const dangerWidth = dangerXEnd - dangerXStart;

  // Physiological Limit Line (30.0°C)
  const threshold30Y = getY(30.0);

  // Active Point on Hover
  const activePoint = hoveredIdx !== null && curve[hoveredIdx] ? curve[hoveredIdx] : curve[14];
  const activeX = hoveredIdx !== null ? getX(hoveredIdx) : getX(14);

  // Temperature ticks
  const yTicks = [20, 25, 30, 35, 40, 45];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header and Toggle Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="var(--aws-orange)" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              24-Hour Diurnal Heat Curve ({cityName})
            </h3>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Physiological thermal stress tracking with Stull wet-bulb formula and WBGT work-rest intervals
          </div>
        </div>

        {/* Metric Toggles */}
        <div style={{ display: 'flex', gap: '10px', fontSize: '12px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowTa(!showTa)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              opacity: showTa ? 1 : 0.4,
              color: 'var(--text-main)',
              fontWeight: 600,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#FF9900' }} />
            Ambient Dry-Bulb (Ta)
          </button>

          <button
            type="button"
            onClick={() => setShowTw(!showTw)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              opacity: showTw ? 1 : 0.4,
              color: 'var(--text-main)',
              fontWeight: 600,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#0972D3' }} />
            Stull Wet-Bulb (Tw)
          </button>

          <button
            type="button"
            onClick={() => setShowWbgt(!showWbgt)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              opacity: showWbgt ? 1 : 0.4,
              color: 'var(--text-main)',
              fontWeight: 600,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: '2px', backgroundColor: '#D13212' }} />
            Outdoor WBGT
          </button>
        </div>
      </div>

      {/* Dynamic Hover Metrics Pill */}
      {activePoint && (
        <div
          style={{
            backgroundColor: activePoint.danger_zone ? 'rgba(209, 50, 18, 0.08)' : 'var(--bg-surface-alt)',
            border: activePoint.danger_zone ? '1px solid rgba(209, 50, 18, 0.3)' : '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: activePoint.danger_zone ? '#D13212' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {activePoint.danger_zone && <AlertTriangle size={15} color="#D13212" />}
              {activePoint.hour} IST
            </span>
            <span className="badge" style={{ backgroundColor: activePoint.danger_zone ? '#D13212' : '#1E4620', color: '#FFF' }}>
              {activePoint.danger_zone ? 'Extreme Insolation Danger Band' : 'Normal Work Shift'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <span>
              Dry-Bulb (Ta): <strong style={{ color: '#FF9900' }}>{activePoint.t_max_c.toFixed(1)}°C</strong>
            </span>
            <span>
              Relative Humidity: <strong>{activePoint.rh_pct.toFixed(0)}%</strong>
            </span>
            <span>
              Stull Wet-Bulb (Tw): <strong style={{ color: '#0972D3' }}>{activePoint.tw_c.toFixed(2)}°C</strong>
            </span>
            <span>
              Outdoor WBGT: <strong style={{ color: '#D13212' }}>{activePoint.wbgt_c.toFixed(2)}°C</strong>
            </span>
            <span>
              Labor Capacity Loss:{' '}
              <strong style={{ color: activePoint.danger_zone ? '#D13212' : 'var(--text-secondary)' }}>
                {activePoint.wbgt_c >= 32 ? '>40% (Severe)' : activePoint.wbgt_c >= 30 ? '25%–35%' : '<10%'}
              </strong>
            </span>
          </div>
        </div>
      )}

      {/* Interactive SVG Heat Curve */}
      <div style={{ width: '100%', overflowX: 'auto', backgroundColor: 'var(--bg-surface)' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: 'auto', minWidth: '640px', display: 'block' }}
          onMouseLeave={() => setHoveredIdx(14)}
        >
          <defs>
            {/* Ambient Ta Fill Gradient */}
            <linearGradient id="taAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9900" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FF9900" stopOpacity="0.0" />
            </linearGradient>

            {/* Peak Afternoon Insolation Danger Band Gradient */}
            <linearGradient id="dangerBandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D13212" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#D13212" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Grid Lines & Y-Axis Ticks */}
          {yTicks.map((temp) => {
            const y = getY(temp);
            return (
              <g key={temp}>
                <line
                  x1={margin.left}
                  y1={y}
                  x2={svgWidth - margin.right}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeDasharray="2 2"
                />
                <text
                  x={margin.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--text-secondary)"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                >
                  {temp}°
                </text>
              </g>
            );
          })}

          {/* 11:30 AM – 16:30 PM Peak Insolation Danger Band */}
          <rect
            x={dangerXStart}
            y={margin.top}
            width={dangerWidth}
            height={plotHeight}
            fill="url(#dangerBandGrad)"
            stroke="rgba(209, 50, 18, 0.25)"
            strokeDasharray="3 3"
          />
          <text
            x={dangerXStart + dangerWidth / 2}
            y={margin.top + 14}
            textAnchor="middle"
            fill="#D13212"
            fontSize="10"
            fontWeight="700"
            letterSpacing="0.02em"
          >
            PEAK INSOLATION DANGER BAND (11:30 AM – 4:30 PM)
          </text>

          {/* Physiological Safety Threshold (30.0°C) */}
          <line
            x1={margin.left}
            y1={threshold30Y}
            x2={svgWidth - margin.right}
            y2={threshold30Y}
            stroke="#D13212"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={svgWidth - margin.right - 6}
            y={threshold30Y - 5}
            textAnchor="end"
            fill="#D13212"
            fontSize="10"
            fontWeight="700"
          >
            30.0°C Worker Physiological Threshold
          </text>

          {/* Dry-Bulb Area & Curve */}
          {showTa && (
            <>
              <path d={taAreaPath} fill="url(#taAreaGrad)" />
              <path d={taPath} fill="none" stroke="#FF9900" strokeWidth="2.5" />
            </>
          )}

          {/* Stull Wet-Bulb Curve */}
          {showTw && (
            <path d={twPath} fill="none" stroke="#0972D3" strokeWidth="2.5" />
          )}

          {/* Outdoor WBGT Curve */}
          {showWbgt && (
            <path d={wbgtPath} fill="none" stroke="#D13212" strokeWidth="2" strokeDasharray="5 3" />
          )}

          {/* Interactive Crosshair & Cursor Line */}
          {hoveredIdx !== null && (
            <g>
              <line
                x1={activeX}
                y1={margin.top}
                x2={activeX}
                y2={margin.top + plotHeight}
                stroke="var(--text-main)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {showTa && (
                <circle
                  cx={activeX}
                  cy={getY(activePoint.t_max_c)}
                  r="5"
                  fill="#FF9900"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}

              {showTw && (
                <circle
                  cx={activeX}
                  cy={getY(activePoint.tw_c)}
                  r="5"
                  fill="#0972D3"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}

              {showWbgt && (
                <circle
                  cx={activeX}
                  cy={getY(activePoint.wbgt_c)}
                  r="5"
                  fill="#D13212"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
            </g>
          )}

          {/* X-Axis Hour Labels & Invisible Hover Slices */}
          {curve.map((point, idx) => {
            const x = getX(idx);
            const sliceWidth = plotWidth / (curve.length - 1);
            return (
              <g key={point.hour}>
                {idx % 2 === 0 && (
                  <text
                    x={x}
                    y={margin.top + plotHeight + 18}
                    textAnchor="middle"
                    fill={hoveredIdx === idx ? 'var(--text-main)' : 'var(--text-secondary)'}
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    fontWeight={hoveredIdx === idx ? '700' : '400'}
                  >
                    {point.hour.slice(0, 2)}
                  </text>
                )}
                {/* Transparent hover detection rect */}
                <rect
                  x={x - sliceWidth / 2}
                  y={margin.top}
                  width={sliceWidth}
                  height={plotHeight + 25}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

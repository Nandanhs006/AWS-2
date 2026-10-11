import React, { useState } from 'react';
import { Presentation, ChevronLeft, ChevronRight, X, Play, ArrowUpRight } from 'lucide-react';


interface SeminarPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToScreen: (screenId: string) => void;
}

interface Slide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  keyPoints: { icon: string; title: string; desc: string }[];
  quote: string;
  statNumber: string;
  statLabel: string;
  targetScreen: string;
  targetScreenLabel: string;
}

const SLIDES: Slide[] = [
  {
    id: 'problem',
    badge: '1. The Real-World Flaw',
    title: 'Why Heat Insurance Triggers Have Visibly Failed',
    subtitle: 'India is piloting heat cover for informal workers, but triggers were set by guesswork.',
    keyPoints: [
      {
        icon: '⚠️',
        title: 'Arbitrary Pilot Thresholds',
        desc: 'In SEWA\'s Ahmedabad scheme, payouts required >43.6°C across 2 consecutive days. In 2023, extreme heat occurred on single days or peaked at 43.4°C, resulting in ZERO payout for thousands of suffering workers.',
      },
      {
        icon: '📉',
        title: 'Severe Uncompensated Wage Loss',
        desc: 'Outdoor hawkers, brick-kiln laborers, and headload porters lost 25%–40% of their daily wages to debilitating heat stress while the insurance policy sat idle.',
      },
      {
        icon: '🛑',
        title: 'The Trust Crisis',
        desc: 'Informal workers lose faith in parametric insurance when they endure extreme heat with no payout. Insurers struggle with basis risk disputes.',
      },
    ],
    quote: '"The 2023 pilot threshold was set so high that blisteringly hot days paid nothing. Workers lost income and got no relief."',
    statNumber: '₹0',
    statLabel: 'Paid to Ahmedabad workers in 2023 under original 43.6°C rule',
    targetScreen: 'replay',
    targetScreenLabel: 'Replay 2023 Season Flaw',
  },
  {
    id: 'basis-risk',
    badge: '2. The Microclimate Gap',
    title: 'The Basis Risk Dilemma: Airport Thermometers vs Slums',
    subtitle: 'Official weather stations measure asphalt runways, not informal workplaces.',
    keyPoints: [
      {
        icon: '🛫',
        title: 'Airport Runway Sensors',
        desc: 'Official IMD stations (e.g. SVPI Airport VAAH) are located 12–18 km from city centers over open tarmac buffers, far from informal worker concentrations.',
      },
      {
        icon: '🔥',
        title: 'Urban Heat Island Amplification',
        desc: 'Tin-roof settlements, asbestos powerloom sheds, and unshaded wholesale markets endure +3.5°C to +5.2°C higher radiant heat than official runway readings.',
      },
      {
        icon: '📍',
        title: 'Ground-Truth Divergence',
        desc: 'Mausam Dhaal audits basis risk across 16 Indian cities using ISRO Bhuvan thermal infrared data and Mahila Housing Trust (MHT) slum sensor loggers.',
      },
    ],
    quote: '"A worker under a corrugated galvanized iron roof in Behrampura suffers 48.9°C while the airport thermometer 15 km away reads only 43.2°C."',
    statNumber: '+4.6°C',
    statLabel: 'Peak microclimate thermal gap in informal wholesale wards',
    targetScreen: 'microclimate',
    targetScreenLabel: 'Inspect Ward Heat Islands',
  },
  {
    id: 'science',
    badge: '3. Physiological Core',
    title: 'The Science: Stull Wet-Bulb & WBGT Proxy',
    subtitle: 'Replacing dry-bulb guesswork with physiological heat stress indices.',
    keyPoints: [
      {
        icon: '💧',
        title: 'The Humidity Blind Spot',
        desc: 'Dry-bulb temperature misses lethal humid heat. In coastal and delta cities like Kolkata, Surat, or Chennai, air at 35°C with 78% RH creates lethal physiological strain (Tw = 31.8°C).',
      },
      {
        icon: '📐',
        title: 'Stull (2011) Wet-Bulb Formulation',
        desc: 'Mausam Dhaal computes empirical Stull wet-bulb temperature from relative humidity and air temperature, capturing sweat evaporation limits.',
      },
      {
        icon: '⏱️',
        title: '24-Hour Diurnal Heat Danger Band',
        desc: 'Our engine tracks the 11:30 AM – 4:30 PM red danger band where outdoor WBGT exceeds 30.0°C and labor capacity drops over 30%.',
      },
    ],
    quote: '"Wet-bulb temperature above 30.5°C exceeds human cooling limits during heavy labor. Dry-bulb triggers miss this completely."',
    statNumber: '31.54°C',
    statLabel: 'Stull wet-bulb benchmark at 40°C air / 53% relative humidity',
    targetScreen: 'datatrust',
    targetScreenLabel: 'Audit Station Discrepancies',
  },
  {
    id: 'actuarial',
    badge: '4. Actuarial Studio',
    title: 'Trigger Studio: Data-Driven Calibration',
    subtitle: 'Fitting optimal triggers to union budgets across 35 years of climate history.',
    keyPoints: [
      {
        icon: '📊',
        title: '35-Year Continuous Reanalysis',
        desc: 'Evaluates triggers against 12,784 daily records per city (1991–2025) using a strict train (1991–2015) and held-out test (2016–2025) actuarial split.',
      },
      {
        icon: '⚖️',
        title: 'Budget Fitting Optimizer',
        desc: 'Takes a target budget (e.g. ₹400/member) and automatically solves for the optimal trigger threshold that maximizes protection while preventing fund insolvency.',
      },
      {
        icon: '🛡️',
        title: 'Actuarial Solvency Testing',
        desc: 'Simulates 1,000 Monte Carlo climate seasons under +1.0°C and +2.0°C warming to calculate fund ruin probabilities and reinsurance stop-loss attachments.',
      },
    ],
    quote: '"Triggers should never be guessed by committee. They must be mathematically calibrated against historical burn costs and real member budgets."',
    statNumber: '366,000',
    statLabel: 'Enrolled informal outdoor workers covered across 16 pilot cities',
    targetScreen: 'studio',
    targetScreenLabel: 'Launch Trigger Studio',
  },
  {
    id: 'operations',
    badge: '5. Fast Execution & Audit',
    title: 'Daily Operations & Tamper-Evident Ledger',
    subtitle: 'Instant UPI direct payouts with zero paperwork and cryptographically sealed decisions.',
    keyPoints: [
      {
        icon: '🌅',
        title: '06:00 AM Automated Execution',
        desc: 'Every morning, the engine evaluates day forecasts across all 16 cities, automatically flagging trigger breaches before the heat peak.',
      },
      {
        icon: '📲',
        title: 'Multi-Language Plain SMS',
        desc: 'Workers never see complex meteorological science; they receive a single clear message in Hindi, Gujarati, Tamil, or Bengali with verified relief advice.',
      },
      {
        icon: '🔐',
        title: 'Tamper-Evident SHA-256 Ledger',
        desc: 'Every single payout and non-payout decision is cryptographically hashed with its input weather payload and sealed in an auditor-verifiable ledger.',
      },
    ],
    quote: '"Workers receive immediate relief deposited to their UPI bank accounts on heat mornings, and funders get an immutable cryptographic proof."',
    statNumber: '< 4 hrs',
    statLabel: 'From trigger breach detection to UPI account credit',
    targetScreen: 'desk',
    targetScreenLabel: 'Open Heat-Day Desk',
  },
];

export const SeminarPitchModal: React.FC<SeminarPitchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToScreen,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!isOpen) return null;

  const slide = SLIDES[currentSlideIndex];
  const isFirst = currentSlideIndex === 0;
  const isLast = currentSlideIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentSlideIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentSlideIndex((prev) => prev - 1);
  };

  const handleJumpToScreen = () => {
    onNavigateToScreen(slide.targetScreen);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: 'var(--top-bar-bg)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 153, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--aws-orange)',
              }}
            >
              <Presentation size={18} />
            </span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                Mausam Dhaal — Executive Pitch & Seminar Walkthrough
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                Slide {currentSlideIndex + 1} of {SLIDES.length} · Interactive Presentation Deck
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Slide Progress Indicator Bar */}
        <div style={{ display: 'flex', height: '4px', backgroundColor: 'var(--border-subtle)' }}>
          {SLIDES.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              style={{
                flex: 1,
                cursor: 'pointer',
                backgroundColor: idx <= currentSlideIndex ? 'var(--aws-orange)' : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
            />
          ))}
        </div>

        {/* Slide Body */}
        <div
          style={{
            padding: '32px',
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Slide Heading & Badge */}
          <div>
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(255, 153, 0, 0.15)',
                color: 'var(--aws-orange)',
                fontWeight: 700,
                fontSize: '11px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              {slide.badge}
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '6px 0 4px 0', color: 'var(--text-primary)' }}>
              {slide.title}
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
              {slide.subtitle}
            </p>
          </div>

          {/* Key Points Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {slide.keyPoints.map((pt, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-app)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '20px' }}>{pt.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {pt.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {pt.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Quote & Big Metric Highlight */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'stretch' }}>
            <div
              style={{
                padding: '18px 20px',
                borderLeft: '4px solid var(--aws-orange)',
                backgroundColor: 'rgba(255, 153, 0, 0.06)',
                borderRadius: '0 6px 6px 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {slide.quote}
              </p>
            </div>

            <div
              style={{
                padding: '16px 20px',
                backgroundColor: 'var(--bg-app)',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--aws-orange)' }}>
                {slide.statNumber}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {slide.statLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation & Jump to Screen */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: 'var(--bg-app)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              disabled={isFirst}
              onClick={handlePrev}
              style={{
                opacity: isFirst ? 0.4 : 1,
                cursor: isFirst ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <button
              type="button"
              className="btn-secondary"
              disabled={isLast}
              onClick={handleNext}
              style={{
                opacity: isLast ? 0.4 : 1,
                cursor: isLast ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleJumpToScreen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                padding: '8px 18px',
              }}
            >
              <Play size={14} /> Jump to Live Demo: {slide.targetScreenLabel} <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

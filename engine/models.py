"""Data models for HeatSutra Heat Coverage Workbench.

All models are strictly typed and validation-backed using Pydantic.
"""

from __future__ import annotations
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class TriggerFamily(str, Enum):
    DRY_BULB_TWO_DAY = "dry_bulb_two_day"
    WET_BULB = "wet_bulb"
    HYBRID = "hybrid"


class TierLevel(str, Enum):
    ADVISORY = "Advisory"
    PARTIAL = "Partial"
    FULL = "Full"


class TriggerTier(BaseModel):
    name: TierLevel
    threshold_value: float = Field(..., description="Threshold in °C (dry-bulb or wet-bulb depending on family)")
    payout_inr: float = Field(..., ge=0.0, description="Payout in INR per member upon trigger event")


class TriggerConfig(BaseModel):
    trigger_id: str
    family: TriggerFamily
    tiers: List[TriggerTier]
    consecutive_days: int = Field(default=2, ge=1, le=5)
    dry_bulb_threshold_c: Optional[float] = None
    wet_bulb_threshold_c: Optional[float] = None
    wbgt_threshold_c: Optional[float] = None
    loading_factor: float = Field(default=0.20, ge=0.0, le=1.0, description="Administrative & capital loading factor (e.g. 0.20 for 20%)")


class DailyWeatherRecord(BaseModel):
    date: str  # YYYY-MM-DD
    t_max_c: float
    t_min_c: float
    rh_mean_pct: float
    tw_max_c: float
    wbgt_max_c: float
    source: str = Field(default="Modelled", description="'Modelled' (ERA5 reanalysis) or 'Observed' (Surface Station)")


class DayEvaluation(BaseModel):
    date: str
    t_max_c: float
    tw_max_c: float
    wbgt_max_c: float
    tier_triggered: Optional[TierLevel] = None
    payout_inr: float = 0.0
    consecutive_day_count: int = 0
    work_loss_proxy_pct: float = 0.0  # Estimated labor productivity drop (2-3% per °C above 20°C WBGT)
    is_bad_year_miss: bool = False
    is_false_payout: bool = False


class ValidationSplitMetrics(BaseModel):
    period_label: str  # "Train (1991-2015)" or "Test (2016-2025)"
    total_days: int
    payout_days_count: int
    payout_frequency_pct: float
    annual_payout_events_mean: float
    annual_expected_payout_inr: float
    indicative_premium_inr: float
    bad_year_misses: int
    false_payouts: int
    uncompensated_wage_loss_inr: float


class TriggerStudioEvaluation(BaseModel):
    city_id: str
    city_name: str
    trigger_config: TriggerConfig
    train_metrics: ValidationSplitMetrics
    test_metrics: ValidationSplitMetrics
    combined_indicative_premium_inr: float
    headline_notes: List[str]


class BudgetOptimizationResult(BaseModel):
    target_budget_per_member_inr: float
    worker_contribution_inr: float
    sponsor_contribution_inr: float
    recommended_family: TriggerFamily
    recommended_tiers: List[TriggerTier]
    indicative_premium_inr: float
    funding_gap_inr: float
    payout_frequency_pct: float
    coverage_score_pct: float


class SeasonReplayOutcome(BaseModel):
    season_year: int
    city_id: str
    policy_name: str
    total_days_evaluated: int
    payout_days: int
    total_payout_per_member_inr: float
    documented_reported_outcome: str
    model_reproduced_outcome: str
    is_reproduced_exact: bool
    explanation: str
    daily_records: List[DayEvaluation]


class DataTrustStationComparison(BaseModel):
    city_id: str
    city_name: str
    station_name: str
    comparison_period: str
    total_comparison_days: int
    mean_temp_diff_c: float  # Reanalysis - Station (e.g. +1.4°C or -0.8°C)
    rmse_temp_c: float
    false_pay_days_count: int  # Days reanalysis says trigger but station was below
    missed_pay_days_count: int  # Days station was hot enough but reanalysis missed
    basis_risk_score_pct: float  # Percentage of disagreement days
    assessment: str

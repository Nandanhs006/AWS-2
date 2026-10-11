"""Unit tests for trigger evaluation, consecutive day mechanics, and budget optimizer."""

import pytest
import pandas as pd
from engine.models import (
    TriggerConfig,
    TriggerFamily,
    TierLevel,
    TriggerTier,
)
from engine.evaluator import (
    evaluate_daily_series,
    compute_split_metrics,
    optimize_trigger_for_budget,
)


@pytest.fixture
def sample_weather_df() -> pd.DataFrame:
    """Create a synthetic 10-day weather sequence with consecutive heatwaves."""
    dates = pd.date_range("2024-05-01", periods=10, freq="D").strftime("%Y-%m-%d").tolist()
    # Day 0: 42.0 (below)
    # Day 1: 43.8 (hot day 1)
    # Day 2: 44.2 (hot day 2 -> consecutive 2 reached!)
    # Day 3: 41.5 (reset)
    # Day 4: 44.5 (hot day 1)
    # Day 5: 44.0 (hot day 2 -> consecutive reached)
    # Day 6: 38.0
    # Day 7: 39.0 (high humidity: Tw = 31.0)
    # Day 8: 37.0
    # Day 9: 36.0
    t_max = [42.0, 43.8, 44.2, 41.5, 44.5, 44.0, 38.0, 39.0, 37.0, 36.0]
    tw_max = [26.0, 27.5, 28.0, 25.0, 28.5, 28.0, 25.0, 31.2, 24.0, 23.0]
    wbgt_max = [30.8, 32.4, 32.9, 30.0, 33.3, 32.8, 28.9, 33.5, 27.9, 26.9]

    return pd.DataFrame({
        "date": dates,
        "t_max_c": t_max,
        "tw_max_c": tw_max,
        "wbgt_max_c": wbgt_max,
    })


def test_consecutive_two_day_trigger(sample_weather_df: pd.DataFrame):
    """Test that two-day dry-bulb trigger fires only on day 2 of consecutive heat."""
    config = TriggerConfig(
        trigger_id="test_db_2day",
        family=TriggerFamily.DRY_BULB_TWO_DAY,
        consecutive_days=2,
        tiers=[
            TriggerTier(name=TierLevel.PARTIAL, threshold_value=43.6, payout_inr=400.0),
            TriggerTier(name=TierLevel.FULL, threshold_value=44.1, payout_inr=800.0),
        ],
    )

    evals = evaluate_daily_series(sample_weather_df, config)

    # Day 0: 42.0 -> no trigger
    assert evals[0].tier_triggered is None
    # Day 1: 43.8 -> consecutive = 1 -> no trigger yet
    assert evals[1].consecutive_day_count == 1
    assert evals[1].tier_triggered is None
    # Day 2: 44.2 -> consecutive = 2, >= 44.1 -> Full Tier payout 800!
    assert evals[2].consecutive_day_count == 2
    assert evals[2].tier_triggered == TierLevel.FULL
    assert evals[2].payout_inr == 800.0

    # Day 3: 41.5 -> reset to 0
    assert evals[3].consecutive_day_count == 0
    assert evals[3].tier_triggered is None


def test_wet_bulb_trigger_firing(sample_weather_df: pd.DataFrame):
    """Test wet-bulb trigger fires on humid-heat spike (Day 7: 39°C but Tw=31.2°C)."""
    config = TriggerConfig(
        trigger_id="test_wb",
        family=TriggerFamily.WET_BULB,
        tiers=[
            TriggerTier(name=TierLevel.ADVISORY, threshold_value=29.0, payout_inr=0.0),
            TriggerTier(name=TierLevel.PARTIAL, threshold_value=30.0, payout_inr=300.0),
            TriggerTier(name=TierLevel.FULL, threshold_value=31.0, payout_inr=700.0),
        ],
    )

    evals = evaluate_daily_series(sample_weather_df, config)

    # Day 7 has Tw=31.2°C, which breaches 31.0°C Full Tier
    assert evals[7].tier_triggered == TierLevel.FULL
    assert evals[7].payout_inr == 700.0


def test_split_metrics_and_loading(sample_weather_df: pd.DataFrame):
    """Test actuarial calculation and administrative loading."""
    config = TriggerConfig(
        trigger_id="test_db",
        family=TriggerFamily.DRY_BULB_TWO_DAY,
        consecutive_days=2,
        tiers=[
            TriggerTier(name=TierLevel.FULL, threshold_value=43.6, payout_inr=500.0),
        ],
        loading_factor=0.25,
    )

    evals = evaluate_daily_series(sample_weather_df, config)
    metrics = compute_split_metrics(evals, "Test Period", config.loading_factor)

    assert metrics.total_days == 10
    assert metrics.indicative_premium_inr > 0
    # Loading factor of 25% means premium = expected_payout * 1.25
    expected_premium = round(metrics.annual_expected_payout_inr * 1.25, 2)
    assert abs(metrics.indicative_premium_inr - expected_premium) < 0.05


def test_budget_optimization(sample_weather_df: pd.DataFrame):
    """Test budget optimizer returns valid configuration and calculates gap."""
    res = optimize_trigger_for_budget(
        city_id="ahmedabad",
        df_weather=sample_weather_df,
        target_budget_per_member_inr=400.0,
        worker_contribution_inr=150.0,
    )

    assert res.target_budget_per_member_inr == 400.0
    assert res.worker_contribution_inr == 150.0
    assert res.sponsor_contribution_inr == 250.0
    assert res.indicative_premium_inr > 0
    assert isinstance(res.funding_gap_inr, float)

"""Unit tests for Historical Season Replay and SEWA benchmark rules."""

import pytest
import pandas as pd
from engine.replay import (
    replay_season,
    SEWA_AHMEDABAD_POLICY_CONFIG,
    GUJARAT_REVISED_2026_CONFIG,
)


def test_sewa_policy_config_structure():
    """Verify SEWA Ahmedabad policy thresholds are encoded correctly."""
    assert SEWA_AHMEDABAD_POLICY_CONFIG.consecutive_days == 2
    tiers = {t.name: t.threshold_value for t in SEWA_AHMEDABAD_POLICY_CONFIG.tiers}
    assert tiers["Partial"] == 43.6
    assert tiers["Full"] == 44.1


def test_gujarat_2026_config_structure():
    """Verify revised Gujarat threshold is 42.74°C."""
    assert GUJARAT_REVISED_2026_CONFIG.consecutive_days == 2
    assert GUJARAT_REVISED_2026_CONFIG.tiers[0].threshold_value == 42.74


def test_season_replay_execution():
    """Verify season replay executes cleanly and identifies documented outcomes."""
    # Create summer season where heatwave occurred
    dates = pd.date_range("2024-05-01", periods=30, freq="D").strftime("%Y-%m-%d").tolist()
    # Days 10, 11 are >= 44.2C
    t_max = [40.0] * 30
    t_max[10] = 44.3
    t_max[11] = 44.5
    tw_max = [28.0] * 30
    wbgt_max = [32.0] * 30

    df_summer = pd.DataFrame({
        "date": dates,
        "t_max_c": t_max,
        "tw_max_c": tw_max,
        "wbgt_max_c": wbgt_max,
    })

    outcome = replay_season("ahmedabad", 2024, df_summer, SEWA_AHMEDABAD_POLICY_CONFIG)
    assert outcome.season_year == 2024
    assert outcome.payout_days >= 1
    assert outcome.total_payout_per_member_inr > 0
    assert outcome.model_reproduced_outcome == "Paid (Trigger Fired)"
    assert outcome.is_reproduced_exact is True

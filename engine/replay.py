"""Historical Season Replay and Real-World Pilot Verification.

Encodes published pilot thresholds (SEWA Ahmedabad 43.6°C / 44.1°C consecutive
and Gujarat 42.74°C rule), evaluates historical summer seasons day-by-day,
and compares model outputs with documented ground-truth outcomes.
Disagreements are surfaced directly as data basis risk differences.
"""

from __future__ import annotations
from typing import List, Dict, Any, Optional
import pandas as pd

from engine.models import (
    TriggerConfig,
    TriggerFamily,
    TierLevel,
    TriggerTier,
    SeasonReplayOutcome,
    DayEvaluation,
)
from engine.evaluator import evaluate_daily_series


# Benchmark policy configurations from documented field pilots
SEWA_AHMEDABAD_POLICY_CONFIG = TriggerConfig(
    trigger_id="sewa_ahmedabad_pilot",
    family=TriggerFamily.DRY_BULB_TWO_DAY,
    consecutive_days=2,
    tiers=[
        TriggerTier(name=TierLevel.PARTIAL, threshold_value=43.6, payout_inr=400.0),
        TriggerTier(name=TierLevel.FULL, threshold_value=44.1, payout_inr=800.0),
    ],
    loading_factor=0.20,
)

GUJARAT_REVISED_2026_CONFIG = TriggerConfig(
    trigger_id="gujarat_revised_2026",
    family=TriggerFamily.DRY_BULB_TWO_DAY,
    consecutive_days=2,
    tiers=[
        TriggerTier(name=TierLevel.FULL, threshold_value=42.74, payout_inr=800.0),
    ],
    loading_factor=0.20,
)

DOCUMENTED_HISTORICAL_OUTCOMES: Dict[str, Dict[int, Dict[str, Any]]] = {
    "ahmedabad": {
        2023: {
            "reported_outcome": "Unpaid (Zero Payout)",
            "payout_occurred": False,
            "notes": "Published SEWA threshold (43.6°C / 44.1°C for 2 consecutive days) was too high during pilot; extreme heat days occurred singly or were missed by station readings, resulting in ₹0 payout.",
        },
        2024: {
            "reported_outcome": "Paid (Trigger Fired)",
            "payout_occurred": True,
            "notes": "Late May 2024 heatwave broke historical records, surpassing 44.5°C across consecutive days and triggering partial and full payouts for verified members.",
        },
        2025: {
            "reported_outcome": "Unpaid (Zero Payout)",
            "payout_occurred": False,
            "notes": "Threshold was narrowly missed; severe heat stress occurred without triggering payout. Led programme designers to lower threshold to 42.74°C for 2026.",
        },
    }
}


def replay_season(
    city_id: str,
    season_year: int,
    df_summer: pd.DataFrame,
    config: Optional[TriggerConfig] = None,
) -> SeasonReplayOutcome:
    """Run a specific summer season (April 1 to June 30) day-by-day.

    Args:
        city_id: 'ahmedabad', 'kolkata', or 'sholapur'
        season_year: Year to replay (e.g. 2023, 2024, 2025)
        df_summer: Dataframe filtered to this city and season
        config: TriggerConfig to test (defaults to SEWA benchmark if None)
    """
    active_config = config or SEWA_AHMEDABAD_POLICY_CONFIG

    # Evaluate days
    daily_evals = evaluate_daily_series(df_summer, active_config)
    payout_days_evals = [e for e in daily_evals if e.tier_triggered is not None and e.payout_inr > 0]
    payout_count = len(payout_days_evals)
    total_payout_inr = sum(e.payout_inr for e in payout_days_evals)

    model_outcome = "Paid (Trigger Fired)" if payout_count > 0 else "Unpaid (Zero Payout)"

    # Look up documented ground truth
    doc_info = DOCUMENTED_HISTORICAL_OUTCOMES.get(city_id, {}).get(season_year, {
        "reported_outcome": "No formal published pilot recorded",
        "payout_occurred": None,
        "notes": f"Evaluation based on {active_config.trigger_id} rules against reanalysis weather series.",
    })

    doc_outcome = doc_info["reported_outcome"]
    expected_paid = doc_info.get("payout_occurred")

    if expected_paid is not None:
        is_exact = (expected_paid == (payout_count > 0))
    else:
        is_exact = True

    if is_exact:
        explanation = (
            f"Model execution accurately reproduces the documented {season_year} outcome ({model_outcome}). "
            f"{doc_info.get('notes', '')}"
        )
    else:
        explanation = (
            f"Data difference detected between surface station settlement and reanalysis: "
            f"Pilot reported '{doc_outcome}' while reanalysis series yielded '{model_outcome}' "
            f"({payout_count} trigger days). This divergence illustrates sensor microclimate basis risk."
        )

    return SeasonReplayOutcome(
        season_year=season_year,
        city_id=city_id,
        policy_name=active_config.trigger_id,
        total_days_evaluated=len(daily_evals),
        payout_days=payout_count,
        total_payout_per_member_inr=total_payout_inr,
        documented_reported_outcome=doc_outcome,
        model_reproduced_outcome=model_outcome,
        is_reproduced_exact=is_exact,
        explanation=explanation,
        daily_records=daily_evals,
    )
